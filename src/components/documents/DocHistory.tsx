'use client';

import { GeneratedDocument, Company, Project } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, History, Building2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMemo } from "react";

interface DocHistoryProps {
    documents: GeneratedDocument[];
    projects?: Project[];
    companies?: Company[];
    onEdit?: (doc: GeneratedDocument) => void;
}

export function DocHistory({ documents, projects = [], companies = [], onEdit }: DocHistoryProps) {
    // Group documents by Company
    const groupedDocs = useMemo(() => {
        const groups: Record<string, GeneratedDocument[]> = {};

        documents.forEach(doc => {
            const project = projects.find(p => p.id === doc.projectId);
            const companyId = project?.companyId || 'unknown';
            if (!groups[companyId]) {
                groups[companyId] = [];
            }
            groups[companyId].push(doc);
        });

        return groups;
    }, [documents, projects]);

    const companyList = useMemo(() => {
        return Object.keys(groupedDocs).map(companyId => {
            const company = companies.find(c => c.id === companyId);
            return {
                id: companyId,
                name: company?.name || 'Empresa Desconhecida',
                docs: groupedDocs[companyId].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            };
        }).sort((a, b) => {
            // Sort companies by most recent doc
            const lastDocA = a.docs[0]?.createdAt || '';
            const lastDocB = b.docs[0]?.createdAt || '';
            return new Date(lastDocB).getTime() - new Date(lastDocA).getTime();
        });
    }, [groupedDocs, companies]);

    if (documents.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground border rounded-lg bg-white">
                <History className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>Nenhum documento gerado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
                <History className="mr-2 h-4 w-4" /> Histórico por Empresa
            </h3>

            <Accordion type="single" collapsible className="w-full space-y-2">
                {companyList.map((group) => (
                    <AccordionItem key={group.id} value={group.id} className="border rounded-lg bg-white px-2">
                        <AccordionTrigger className="hover:no-underline px-2 py-3">
                            <div className="flex items-center text-left">
                                <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                                <span className="font-semibold text-sm">{group.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                                    {group.docs.length}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4 px-2 space-y-3">
                            {group.docs.map(doc => (
                                <div key={doc.id} className="flex flex-col space-y-2 p-3 rounded-md bg-slate-50 border border-slate-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium text-sm text-blue-900">{doc.templateName}</div>
                                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                                                <span className="mx-1">•</span>
                                                v{doc.version}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 pt-1">
                                        <Button variant="outline" size="xs" className="h-7 text-xs w-full" onClick={() => alert('Download simulado: ' + doc.fileUrl)}>
                                            <Download className="h-3 w-3 mr-1" /> Baixar
                                        </Button>
                                        {onEdit && (
                                            <Button variant="secondary" size="xs" className="h-7 text-xs w-full" onClick={() => onEdit(doc)}>
                                                Editar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
