"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toggleDocumentStatus } from "@/app/_actions/project-actions";

interface DocumentItem {
    id: string;
    name: string;
    required: boolean;
    completed: boolean;
}

interface DocumentChecklistProps {
    projectId: string;
    initialDocuments: DocumentItem[];
    compact?: boolean;
}

export function DocumentChecklist({ projectId, initialDocuments, compact = false }: DocumentChecklistProps) {
    const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
    const [isPending, startTransition] = useTransition();

    const toggleDoc = (docId: string) => {
        // Optimistic update
        setDocuments(docs =>
            docs.map(doc =>
                doc.id === docId ? { ...doc, completed: !doc.completed } : doc
            )
        );

        startTransition(async () => {
            await toggleDocumentStatus(projectId, docId);
        });
    };

    const completedCount = documents.filter(d => d.completed).length;
    const totalCount = documents.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if (compact) {
        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium mb-1">
                    <span>Docs ({completedCount}/{totalCount})</span>
                    <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
                    {documents.map((doc) => (
                        <div key={doc.id} className="flex items-start space-x-3 p-1 hover:bg-slate-100 rounded">
                            <Checkbox
                                id={`compact-${doc.id}`}
                                checked={doc.completed}
                                onCheckedChange={() => toggleDoc(doc.id)}
                                className="h-5 w-5 mt-0.5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            <label
                                htmlFor={`compact-${doc.id}`}
                                className={cn(
                                    "text-sm leading-tight cursor-pointer transition-colors",
                                    doc.completed ? "text-green-700 font-medium" : "text-slate-600"
                                )}
                                title={doc.name}
                            >
                                {doc.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Checklist de Documentação</CardTitle>
                    <span className="text-sm text-muted-foreground">{progress}% completo</span>
                </div>
                <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className={cn(
                            "flex items-start space-x-3 p-2 rounded-lg transition-colors",
                            doc.completed ? "bg-green-50/50" : "hover:bg-slate-50"
                        )}
                    >
                        <Checkbox
                            id={doc.id}
                            checked={doc.completed}
                            onCheckedChange={() => toggleDoc(doc.id)}
                            className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            disabled={isPending}
                        />
                        <div className="grid gap-1.5 leading-none w-full">
                            <label
                                htmlFor={doc.id}
                                className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer transition-colors",
                                    doc.completed ? "text-green-700" : "text-foreground"
                                )}
                            >
                                {doc.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                                {doc.required ? "Obrigatório" : "Opcional"}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
