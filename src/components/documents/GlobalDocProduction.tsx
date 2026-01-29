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
    const [isStandalone, setIsStandalone] = useState(false);

    // Derived state
    const selectedCompany = selectedProject ? companies.find(c => c.id === selectedProject.companyId) : null;

    // Filter docs based on mode
    let projectDocs: GeneratedDocument[] = [];
    if (selectedProject) {
        projectDocs = allGeneratedDocuments.filter(d => d.projectId === selectedProject.id);
    } else if (isStandalone) {
        projectDocs = allGeneratedDocuments.filter(d => d.projectId === null);
    }

    const handleEditFromHistory = (doc: GeneratedDocument) => {
        if (doc.projectId) {
            // Project Document
            const project = projects.find(p => p.id === doc.projectId);
            if (project) {
                setIsStandalone(false);
                setSelectedProject(project);
                setDocToEdit(doc);
            } else {
                alert('Projeto associado ao documento não encontrado.');
            }
        } else {
            // Standalone Document
            setSelectedProject(null);
            setIsStandalone(true);
            setDocToEdit(doc);
        }
    };

    const handleExitMode = () => {
        setSelectedProject(null);
        setIsStandalone(false);
        setDocToEdit(null);
    };

    return (
        <div className="grid grid-cols-1 2xl:grid-cols-4 gap-8">
            <div className="2xl:col-span-3 space-y-6">
                {(selectedProject && selectedCompany) || isStandalone ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 text-sm font-medium text-muted-foreground text-right">
                                {isStandalone ? (
                                    <span className="text-slate-900 font-bold bg-amber-100 px-2 py-1 rounded text-amber-800 border border-amber-200">
                                        Modo Avulso (Sem Projeto)
                                    </span>
                                ) : (
                                    <>Projeto: <span className="text-slate-900">{selectedProject?.number}</span> - <span className="text-slate-900">{selectedCompany?.name}</span></>
                                )}
                            </div>
                        </div>

                        <DocProductionTab
                            project={selectedProject}
                            company={selectedCompany}
                            concessionaires={concessionaires}
                            states={states}
                            initialDocuments={projectDocs}
                            docToEdit={docToEdit}
                            onExit={handleExitMode}
                        />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="mb-8 space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Produção de Documentos</h2>
                            <p className="text-muted-foreground">Selecione um projeto para iniciar ou crie um documento avulso.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="hover:border-primary transition-colors cursor-pointer group" onClick={() => setIsStandalone(true)}>
                                <CardHeader>
                                    <CardTitle className="text-blue-900 group-hover:text-blue-700">Documento Avulso</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Gera documentos sem vincular a um projeto específico. Ideal para rascunhos ou solicitações rápidas.
                                    </p>
                                    <Button variant="secondary" className="w-full">Criar Avulso</Button>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2 border-dashed bg-slate-50/50">
                                <CardHeader>
                                    <CardTitle>Selecionar Projeto Existente</CardTitle>
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
