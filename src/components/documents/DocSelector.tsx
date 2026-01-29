'use client';

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTemplates, DocumentTemplate } from "@/lib/templates";

interface DocSelectorProps {
    concessionaires: { id: string, name: string }[];
    states: { id: string, name: string }[];
    onSelectTemplate: (template: DocumentTemplate) => void;
}

export function DocSelector({ concessionaires, states, onSelectTemplate }: DocSelectorProps) {
    // MVP: Hardcoded to ENEL CE
    const [selectedConc, setSelectedConc] = useState<string>('3'); // Enel CE ID
    const [selectedState, setSelectedState] = useState<string>('3'); // CE ID
    const [availableTemplates, setAvailableTemplates] = useState<DocumentTemplate[]>([]);

    useEffect(() => {
        if (selectedConc && selectedState) {
            const temps = getTemplates(selectedConc, selectedState);
            setAvailableTemplates(temps);
        } else {
            setAvailableTemplates([]);
        }
    }, [selectedConc, selectedState]);

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Concessionária</span>
                        <div className="font-medium text-lg">ENEL</div>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">UF</span>
                        <div className="font-medium text-lg">CE</div>
                    </div>
                </div>
            </div>

            {availableTemplates.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Documentos Obrigatórios</Label>
                    <div className="grid gap-3">
                        {availableTemplates.map(t => (
                            <Card key={t.id} className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all" onClick={() => onSelectTemplate(t)}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-blue-900">{t.name}</div>
                                        <div className="text-sm text-muted-foreground mt-1">{t.description}</div>
                                    </div>
                                    <Button size="sm" variant="default">Gerar / Editar</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {availableTemplates.length === 0 && (
                <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    Nenhum documento configurado para ENEL CE.
                </div>
            )}
        </div>
    );
}
