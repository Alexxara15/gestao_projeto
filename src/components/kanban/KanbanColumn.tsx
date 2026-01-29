"use client";

import { useDroppable } from "@dnd-kit/core";
import { Project, Company } from "@/lib/db";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
    id: string;
    title: string;
    projects: Project[];
    companies: Company[];
    onRemoveProject: (id: string) => void;
}

export function KanbanColumn({ id, title, projects, companies, onRemoveProject }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className="flex-1 min-w-[250px] bg-muted/40 rounded-xl p-4 flex flex-col gap-4 border border-border shadow-sm"
        >
            <div className="flex items-center justify-between flex-shrink-0">
                <h3 className="font-semibold text-foreground/80">{title}</h3>
                <span className="bg-background text-muted-foreground text-xs px-2 py-1 rounded-full font-medium border border-border shadow-sm">
                    {projects.length}
                </span>
            </div>

            <div className="flex-1 flex flex-col gap-3 min-h-[0]">
                {projects.map((project) => (
                    <KanbanCard
                        key={project.id}
                        project={project}
                        companyName={companies.find(c => c.id === project.companyId)?.name || '...'}
                        onRemove={() => onRemoveProject(project.id)}
                    />
                ))}
                {projects.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200/60 rounded-lg text-slate-400 text-sm p-4 m-2">
                        Arraste itens aqui
                    </div>
                )}
            </div>
        </div>
    );
}
