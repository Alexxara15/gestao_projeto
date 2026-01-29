"use client";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addConcessionaire, updateConcessionaireAction } from "@/app/_actions/config-actions";
import { useEffect, useState } from "react";
import { Concessionaire } from "@/lib/db";

type State = {
    id: string;
    name: string;
    uf: string;
};

const initialState = {
    message: '',
};

interface ConcessionaireFormProps {
    states: State[];
    initialData?: Concessionaire | null;
    onCancel?: () => void;
}

export function ConcessionaireForm({ states, initialData, onCancel }: ConcessionaireFormProps) {
    // Determine which action to use
    const action = initialData ? updateConcessionaireAction : addConcessionaire;
    // @ts-ignore
    const [state, formAction] = useFormState(action, initialState);

    // Local state to handle resetting form when initialData changes (if needed) or just for controlled inputs if we wanted
    // But for Server Actions + useFormState, uncontrolled inputs with defaultValue works best.

    // Key trick: Remount form when initialData changes to reset defaultValues
    return (
        <form key={initialData?.id || 'new'} action={formAction} className="space-y-4 border p-4 rounded-lg bg-slate-50">
            <div className="flex justify-between items-center">
                <h3 className="font-medium text-sm">
                    {initialData ? 'Editar Concessionária' : 'Adicionar Nova Concessionária'}
                </h3>
                {onCancel && (
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
                )}
            </div>

            {initialData && <input type="hidden" name="id" value={initialData.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome da Concessionária</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Ex: CPFL Paulista"
                        defaultValue={initialData?.name}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Estado de Atuação</Label>
                    <Select name="stateId" defaultValue={initialData?.stateId} required>
                        <SelectTrigger><SelectValue placeholder="Selecione o UF" /></SelectTrigger>
                        <SelectContent>
                            {states.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name} ({s.uf})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="requiredDocs">Documentos Obrigatórios (Um por linha)</Label>
                <Textarea
                    id="requiredDocs"
                    name="requiredDocs"
                    placeholder="Ex:\nProjeto Técnico\nART\nMemorial Descritivo"
                    rows={5}
                    defaultValue={initialData?.requiredDocs.join('\n')}
                    required
                />
                <p className="text-xs text-muted-foreground">Estes documentos serão exigidos automaticamente ao criar um projeto para esta concessionária.</p>
            </div>

            {state?.message && <p className="text-sm text-blue-600">{state.message}</p>}

            <div className="flex justify-end">
                <Button type="submit" size="sm">{initialData ? 'Salvar Alterações' : 'Salvar Concessionária'}</Button>
            </div>
        </form>
    );
}
