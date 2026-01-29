"use client";

import { useDraggable } from "@dnd-kit/core";
import { Project } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DocumentChecklist } from "@/components/projects/DocumentChecklist";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProjectAction } from "@/app/_actions/project-actions";

interface KanbanCardProps {
    project: Project;
    companyName: string;
    onRemove?: () => void;
}

interface KanbanCardContentProps {
    project: Project;
    companyName: string;
    onRemove?: () => void;
    handleDelete?: (e: React.MouseEvent) => void;
    // We can pass drag props here if needed, or spread strict props
    dragListeners?: any;
    dragAttributes?: any;
    active?: boolean;
    style?: React.CSSProperties;
    innerRef?: (node: HTMLElement | null) => void;
    className?: string;

}

export function KanbanCardContent({
    project,
    companyName,
    handleDelete,
    dragListeners,
    dragAttributes,
    style,
    innerRef,
    className
}: KanbanCardContentProps) {
    return (
        <div ref={innerRef} style={style} {...dragListeners} {...dragAttributes} className={className}>
            <Card className="hover:shadow-md transition-all relative group border-slate-200">
                {/* Header Row: Company Name + Menu */}
                <div className="flex justify-between items-start p-2 pb-0">
                    <span className="text-xs font-bold text-blue-900 truncate pr-2 flex-1" title={companyName}>
                        {companyName}
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-slate-400 hover:text-slate-600 -mt-1 -mr-1"
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/projetos/${project.id}`}>Editar / Detalhes</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleDelete}>
                                Excluir Projeto
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Sub-header: Number + Badge */}
                <div className="px-2 pb-1 flex justify-between items-center mt-1">
                    <span className="text-[10px] text-muted-foreground font-mono bg-slate-100 px-1 rounded">
                        {project.number}
                    </span>
                    <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 font-normal leading-none flex items-center">
                        {project.poleCount} postes
                    </Badge>
                </div>

                <CardContent className="p-2 pt-0 space-y-1.5">
                    {/* Location Row */}
                    <div className="flex items-center text-[10px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5 mr-1 text-slate-400" />
                        <span className="truncate">{project.city}</span>
                    </div>

                    {/* Embedded Checklist (Compact) */}
                    <div
                        className="bg-slate-50 rounded p-1 border border-slate-100"
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <DocumentChecklist
                            projectId={project.id}
                            initialDocuments={project.documents}
                            compact={true}
                        />
                    </div>

                    {/* Invisible Link Overlay for Card Click */}
                    <Link
                        href={`/projetos/${project.id}`}
                        className="absolute inset-0 z-0"
                        title="Ver detalhes"
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export function KanbanCard({ project, companyName, onRemove }: KanbanCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: project.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0 : 1,
    } : undefined;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            onRemove?.();
            await deleteProjectAction(project.id);
        }
    };

    return (
        <KanbanCardContent
            project={project}
            companyName={companyName}
            handleDelete={handleDelete}
            dragListeners={listeners}
            dragAttributes={attributes}
            innerRef={setNodeRef}
            style={style}
            className="cursor-grab active:cursor-grabbing touch-none group"
        />
    );
}
