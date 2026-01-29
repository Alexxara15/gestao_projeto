'use client';

import { useState } from "react";
import { Project, Company, GeneratedDocument } from "@/lib/db";
import { ProjectSelector } from "./ProjectSelector";
import { DocProductionTab } from "./DocProductionTab";
import { DocHistory } from "./DocHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GlobalDocProductionProps {
    projects: Project[];
    companies: Company[];
    concessionaires: { id: string, name: string }[];
    states: { id: string, name: string }[];
    allGeneratedDocuments: GeneratedDocument[];
}

export function GlobalDocProduction({ projects, companies, concessionaires, states, allGeneratedDocuments }: GlobalDocProductionProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [docToEdit, setDocToEdit] = useState<GeneratedDocument | null>(null);

    // Derived state
    const selectedCompany = selectedProject ? companies.find(c => c.id === selectedProject.companyId) : null;
    const projectDocs = selectedProject ? allGeneratedDocuments.filter(d => d.projectId === selectedProject.id) : [];

    const handleEditFromHistory = (doc: GeneratedDocument) => {
        // 1. Find the project for this doc
        const project = projects.find(p => p.id === doc.projectId);
        if (project) {
            setSelectedProject(project);
            setDocToEdit(doc);
        } else {
            alert('Projeto associado ao documento não encontrado.');
        }
    };

    return (
        <div className="grid grid-cols-1 2xl:grid-cols-4 gap-8">
            <div className="2xl:col-span-3 space-y-6">
                {selectedProject && selectedCompany ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" onClick={() => { setSelectedProject(null); setDocToEdit(null); }}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Trocar Projeto
                            </Button>
                            <div className="text-sm font-medium text-muted-foreground">
                                Projeto: <span className="text-slate-900">{selectedProject.number}</span> - <span className="text-slate-900">{selectedCompany.name}</span>
                            </div>
                        </div>

                        <DocProductionTab
                            project={selectedProject}
                            company={selectedCompany}
                            concessionaires={concessionaires}
                            states={states}
                            initialDocuments={projectDocs}
                            docToEdit={docToEdit}
                        />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="mb-8 space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Produção de Documentos</h2>
                            <p className="text-muted-foreground">Selecione um projeto para iniciar a geração ou acesse o histórico ao lado.</p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Selecionar Projeto</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProjectSelector
                                    projects={projects}
                                    companies={companies}
                                    onSelectProject={setSelectedProject}
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            <div className="2xl:col-span-1 border-l-0 2xl:border-l pl-0 2xl:pl-8 pt-8 2xl:pt-0 border-t 2xl:border-t-0">
                <DocHistory
                    documents={allGeneratedDocuments}
                    projects={projects}
                    companies={companies}
                    onEdit={handleEditFromHistory}
                />
            </div>
        </div>
    );
}
