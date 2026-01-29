"use client";

import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard, KanbanCardContent } from "./KanbanCard";
import { Project, Company } from "@/lib/db";
import { updateProjectStatus } from "@/app/_actions/project-actions";

interface KanbanBoardProps {
    initialProjects: Project[];
    companies: Company[];
}

export type Status = 'PREPARATION' | 'SENT' | 'SIGNED';

const COLUMNS: { id: Status; title: string }[] = [
    { id: 'PREPARATION', title: 'Em Preparação' },
    { id: 'SENT', title: 'Enviado para Cliente' },
    { id: 'SIGNED', title: 'Assinado / Pronto' },
];

export function KanbanBoard({ initialProjects, companies }: KanbanBoardProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function getCompanyName(id: string) {
        return companies.find(c => c.id === id)?.name || 'Empresa Desconhecida';
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeProject = projects.find((p) => p.id === activeId);
        if (!activeProject) return;

        const overProject = projects.find((p) => p.id === overId);

        // Determine the new status
        const overStatus = overProject ? overProject.status : (over.id as Status);

        if (activeProject.status !== overStatus) {
            // Optimistic Update
            setProjects((items) => {
                return items.map(item =>
                    item.id === activeId ? { ...item, status: overStatus as Status } : item
                );
            });
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const activeId = active.id as string;

        setActiveId(null);

        if (over) {
            const activeProject = projects.find((p) => p.id === activeId);
            if (activeProject) {
                await updateProjectStatus(activeId, activeProject.status);
            }
        }
    }

    function removeProject(id: string) {
        setProjects((items) => items.filter((p) => p.id !== id));
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-row gap-6 pb-4 items-start px-2 overflow-x-auto">
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        projects={projects.filter((p) => p.status === col.id)}
                        companies={companies}
                        onRemoveProject={removeProject}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <KanbanCardContent
                        project={projects.find((p) => p.id === activeId)!}
                        companyName={getCompanyName(projects.find((p) => p.id === activeId)!.companyId)}
                        className="cursor-grabbing" // Force grabbing cursor on overlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
