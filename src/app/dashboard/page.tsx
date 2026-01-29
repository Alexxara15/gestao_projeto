import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { db } from "@/lib/db";

export default async function DashboardPage() {
    const projects = await db.getProjects();
    // Sort logic handled in db or here. Array.sort mutates, so slice first ? No need if single use.
    // db.getProjects returns array. 
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalProjects = projects.length;
    const preparing = projects.filter(p => p.status === 'PREPARATION').length;
    const sent = projects.filter(p => p.status === 'SENT').length;
    const signed = projects.filter(p => p.status === 'SIGNED').length;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProjects}</div>
                        <p className="text-xs text-muted-foreground">Projetos ativos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Em Preparação</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{preparing}</div>
                        <p className="text-xs text-muted-foreground">Aguardando documentos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Enviados</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sent}</div>
                        <p className="text-xs text-muted-foreground">Aguardando assinatura</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assinados</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{signed}</div>
                        <p className="text-xs text-muted-foreground">Prontos para protocolo</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Visão Geral</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Gráfico de Projetos por Mês (Placeholder)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Projetos Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {projects.slice(0, 5).map(project => (
                                <div key={project.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{project.number}</p>
                                        <p className="text-sm text-muted-foreground">{project.city}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs bg-slate-100 px-2 py-1 rounded">
                                        {project.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
