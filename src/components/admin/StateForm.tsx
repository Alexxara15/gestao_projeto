"use client";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addState } from "@/app/_actions/config-actions";

const initialState = {
    message: '',
};

export function StateForm() {
    // @ts-ignore
    const [state, formAction] = useFormState(addState, initialState);

    return (
        <form action={formAction} className="space-y-4 border p-4 rounded-lg bg-slate-50">
            <h3 className="font-medium text-sm">Adicionar Novo Estado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome do Estado</Label>
                    <Input id="name" name="name" placeholder="Ex: Minas Gerais" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="uf">Sigla (UF)</Label>
                    <Input id="uf" name="uf" placeholder="MG" maxLength={2} required />
                </div>
            </div>

            {state?.message && <p className="text-sm text-blue-600">{state.message}</p>}

            <Button type="submit" size="sm">Salvar Estado</Button>
        </form>
    );
}
