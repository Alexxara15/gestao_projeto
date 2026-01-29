'use client';

import { useState, useEffect } from "react";
import { Project, Company, GeneratedDocument } from "@/lib/db";
import { DocumentTemplate } from "@/lib/templates";
import { DocSelector } from "./DocSelector";
import { DocForm } from "./DocForm";
import { DocHistory } from "./DocHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DocProductionTabProps {
    project?: Project | null;
    company?: Company | null;
    concessionaires: { id: string, name: string }[];
    states: { id: string, name: string }[];
    initialDocuments: GeneratedDocument[];
    docToEdit?: GeneratedDocument | null;
}

export function DocProductionTab({ project, company, concessionaires, states, initialDocuments, docToEdit }: DocProductionTabProps) {
    // ...
    // Effect to handle external edit requests
    const [lastEditedId, setLastEditedId] = useState<string>('');

    useEffect(() => {
        if (docToEdit && docToEdit.id !== lastEditedId) {
            // Logic moved from handleEditDocument
            const { DOCUMENT_TEMPLATES } = require('@/lib/templates');
            const template = DOCUMENT_TEMPLATES.find((t: DocumentTemplate) => t.id === docToEdit.templateId);

            if (template) {
                setSelectedTemplate(template);
                setInitialFormData(docToEdit.data);
                setView('form');
                setLastEditedId(docToEdit.id);
            }
        }
    }, [docToEdit, lastEditedId]);

    // View state: 'selector' | 'form'
    const [view, setView] = useState<'selector' | 'form'>('selector');
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

    const [initialFormData, setInitialFormData] = useState<Record<string, any>>({});

    const handleSelectTemplate = (template: DocumentTemplate) => {
        setSelectedTemplate(template);
        setInitialFormData({}); // Reset form data for new doc
        setView('form');
    };

    const handleCancel = () => {
        setView('selector');
        setSelectedTemplate(null);
        setInitialFormData({});
    };

    const handleSuccess = () => {
        setView('selector');
        setSelectedTemplate(null);
        setInitialFormData({});
        // Ideally we would trigger a refresh or toast here
    };

    return (
        <div className="space-y-6">
            {view === 'form' && selectedTemplate ? (
                <div>
                    <div className="mb-4">
                        <Button variant="link" onClick={handleCancel} className="pl-0 text-muted-foreground hover:text-primary">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Trocar Modelo
                        </Button>
                    </div>
                    <DocForm
                        template={selectedTemplate}
                        project={project}
                        company={company}
                        initialData={initialFormData} // Pass reused data
                        onCancel={handleCancel}
                        onSuccess={handleSuccess}
                    />
                </div>
            ) : (
                <DocSelector
                    concessionaires={concessionaires}
                    states={states}
                    onSelectTemplate={handleSelectTemplate}
                />
            )}
        </div>
    );
}
