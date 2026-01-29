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
            <Card className="hover:shadow-md transition-all relative">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 data-[state=open]:opacity-100">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 cursor-pointer"
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-4 w-4" />
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

                <CardHeader className="p-3 pb-1 space-y-1">
                    <CardTitle className="text-sm font-bold leading-tight text-blue-900 truncate pr-6" title={companyName}>
                        {companyName}
                    </CardTitle>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>{project.number}</span>
                        <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 font-normal">
                            {project.poleCount} Postes
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-3 pt-1 space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {project.city}
                    </div>

                    {/* Embedded Checklist */}
                    <div
                        className="bg-white rounded-md p-2 border shadow-sm"
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <DocumentChecklist
                            projectId={project.id}
                            initialDocuments={project.documents}
                            compact={true}
                        />
                    </div>

                    <div className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full text-[10px] h-6 text-slate-400 hover:text-slate-600" asChild>
                            <Link href={`/projetos/${project.id}`}>
                                Ver detalhes
                            </Link>
                        </Button>
                    </div>
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
