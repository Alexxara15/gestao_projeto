'use client';

import { Project, Company } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ProjectSelectorProps {
    projects: Project[];
    companies: Company[];
    onSelectProject: (project: Project) => void;
}

export function ProjectSelector({ projects, companies, onSelectProject }: ProjectSelectorProps) {
    const [search, setSearch] = useState('');

    const filteredProjects = projects.filter(p =>
        p.number.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        companies.find(c => c.id === p.companyId)?.name.toLowerCase().includes(search.toLowerCase())
    );

    function getCompanyName(id: string) {
        return companies.find(c => c.id === id)?.name || 'Empresa desconhecida';
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar projeto por número, cidade ou empresa..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-2">
                {filteredProjects.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground border rounded-lg">
                        Nenhum projeto encontrado.
                    </div>
                )}
                {filteredProjects.slice(0, 5).map(project => (
                    <Card key={project.id} className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onSelectProject(project)}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="font-medium text-blue-900">{getCompanyName(project.companyId)}</div>
                                <div className="text-sm font-medium">{project.number} <span className="text-muted-foreground font-normal">• {project.city}</span></div>
                            </div>
                            <Button size="sm" variant="ghost">Selecionar</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
