'use client';

import { useState, useEffect } from "react";
import { DocumentTemplate } from "@/lib/templates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateDocument } from "@/app/_actions/doc-actions";
import { Loader2 } from "lucide-react";
import { Project, Company } from "@/lib/db";

interface DocFormProps {
    template: DocumentTemplate;
    project?: Project | null;
    company?: Company | null;
    initialData?: Record<string, any>;
    onCancel: () => void;
    onSuccess: () => void;
}

export function DocForm({ template, project, company, initialData, onCancel, onSuccess }: DocFormProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Initial pre-fill based on template defaultValue OR initialData (reused)
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(initialData);
            return;
        }

        const initial: Record<string, string> = {};
        template.fields.forEach(field => {
            if (field.defaultValue) {
                let value = field.defaultValue;
                let resolved = false;

                // Attempt Project replacements
                if (project) {
                    if (value.includes('{{project.city}}')) { value = value.replace('{{project.city}}', project.city); resolved = true; }
                    if (value.includes('{{project.poleCount}}')) { value = value.replace('{{project.poleCount}}', project.poleCount.toString()); resolved = true; }
                }

                // Global replacements
                if (value.includes('{{today}}')) { value = new Date().toISOString().split('T')[0]; resolved = true; }

                // Attempt Company replacements
                if (company) {
                    if (value.includes('{{company.name}}')) { value = value.replace('{{company.name}}', company.name); resolved = true; }
                    if (value.includes('{{company.cnpj}}')) { value = value.replace('{{company.cnpj}}', company.cnpj); resolved = true; }
                    if (value.includes('{{company.techResp}}')) { value = value.replace('{{company.techResp}}', company.techResp); resolved = true; }
                    if (value.includes('{{company.email}}')) { value = value.replace('{{company.email}}', company.email); resolved = true; }
                    if (value.includes('{{company.address}}')) { value = value.replace('{{company.address}}', company.address); resolved = true; }
                }

                // If resolved, or if it didn't look like a variable to begin with, set it.
                // Otherwise (if it still contains curly braces), skip setting it so it shows as empty.
                if (!value.includes('{{')) {
                    initial[field.id] = value;
                }
            }
        });
        setFormData(initial);
    }, [template, project, company, initialData]);

    const handleChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await generateDocument(project?.id || null, template.id, template.name, formData);

            // Auto-download
            if (result && result.document && result.document.fileUrl) {
                const link = document.createElement('a');
                link.href = result.document.fileUrl;
                link.download = result.document.fileUrl.split('/').pop() || 'documento.docx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            onSuccess();
        } catch (error: any) {
            console.error(error);
            alert(`Erro ao gerar documento: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-white shadow-sm">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>

            <div className="grid gap-4">
                {template.fields.map(field => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                            <Textarea
                                id={field.id}
                                placeholder={field.placeholder}
                                value={formData[field.id] || ''}
                                onChange={e => handleChange(field.id, e.target.value)}
                                required={field.required}
                            />
                        ) : (
                            <Input
                                id={field.id}
                                type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                                placeholder={field.placeholder}
                                value={formData[field.id] || ''}
                                onChange={e => handleChange(field.id, e.target.value)}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Gerar Documento
                </Button>
            </div>
        </form>
    );
}
