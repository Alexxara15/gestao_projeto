import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DocumentChecklist } from "@/components/projects/DocumentChecklist";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProjetoDetalhesPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const projects = await db.getProjects();
    const project = projects.find(p => p.id === params.id);

    if (!project) {
        notFound();
    }

    const companies = await db.getCompanies();
    const company = companies.find(c => c.id === project.companyId);

    if (!company) {
        return <div>Erro: Empresa não encontrada para este projeto.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/projetos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center space-x-2">
                        <h2 className="text-3xl font-bold tracking-tight">{project.number}</h2>
                        <Badge>{project.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">Projeto de compartilhamento de infraestrutura em {project.city}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <Tabs defaultValue="documentos" className="w-full">
                    <TabsList>
                        <TabsTrigger value="documentos">Checklist de Entrada</TabsTrigger>
                        <TabsTrigger value="historico">Histórico Timeline</TabsTrigger>
                    </TabsList>

                    <TabsContent value="documentos" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-6">
                                <DocumentChecklist
                                    projectId={project.id}
                                    initialDocuments={project.documents}
                                />
                            </div>
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Detalhes</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block">Empresa</span>
                                            <span className="font-medium">{company.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Cidade</span>
                                            <span className="font-medium">{project.city}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Postes</span>
                                            <span className="font-medium">{project.poleCount}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="historico">
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Histórico de atividades em breve.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
