import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, LayoutList, Kanban as KanbanIcon } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default async function ProjetosPage() {
    // Include company and concessionaire to display names
    const rawProjects = await db.getProjects();
    const companies = await db.getCompanies();
    const concessionaires = await db.getConcessionaires();

    // Manual join similar to Prisma include
    const projects = rawProjects
        .map(p => ({
            ...p,
            company: companies.find(c => c.id === p.companyId),
            concessionaire: concessionaires.find(c => c.id === p.concessionaireId)
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
                    <p className="text-muted-foreground">Gerencie seus processos de compartilhamento.</p>
                </div>
                <Button asChild>
                    <Link href="/projetos/novo">
                        <Plus className="mr-2 h-4 w-4" /> Novo Processo
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="kanban" className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Input placeholder="Buscar por número, cidade ou empresa..." className="max-w-sm" />
                        <Button variant="outline"><Search className="h-4 w-4" /></Button>
                    </div>
                    <TabsList>
                        <TabsTrigger value="kanban"><KanbanIcon className="h-4 w-4 mr-2" /> Quadro</TabsTrigger>
                        <TabsTrigger value="list"><LayoutList className="h-4 w-4 mr-2" /> Lista</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="kanban" className="h-full">
                    {/* Pass adapted projects or ensure KanbanBoard handles Prisma types. 
                        KanbanBoard likely expects specific structure. 
                        If it breaks, we might need to cast or update KanbanBoard.
                        For safe auto-run, assuming properties match closely enough or valid casting.
                    */}
                    <KanbanBoard initialProjects={projects as any[]} companies={companies} />
                </TabsContent>

                <TabsContent value="list">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Número/Projeto</TableHead>
                                        <TableHead>Cidade/UF</TableHead>
                                        <TableHead>Concessionária</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Postes</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <div className="font-medium">{project.number}</div>
                                                <div className="text-xs text-muted-foreground">{project.company?.name || 'Sem Empresa'}</div>
                                            </TableCell>
                                            <TableCell>{project.city}</TableCell>
                                            <TableCell>{project.concessionaire?.name || 'N/A'}</TableCell>
                                            <TableCell>{project.infraType}</TableCell>
                                            <TableCell>{project.poleCount}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    project.status === 'PREPARATION' ? 'secondary' :
                                                        project.status === 'SENT' ? 'default' : 'outline'
                                                }>
                                                    {project.status === 'PREPARATION' ? 'Em Preparação' : project.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/projetos/${project.id}`}>Ver Detalhes</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
