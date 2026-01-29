'use server';

import { db, State, Concessionaire } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- States ---
const stateSchema = z.object({
    name: z.string().min(2),
    uf: z.string().length(2),
});

export async function addState(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        uf: formData.get('uf'),
    };

    const result = stateSchema.safeParse(rawData);
    if (!result.success) return { message: 'Dados inválidos.' };

    await db.addState({
        id: crypto.randomUUID(),
        name: result.data.name,
        uf: result.data.uf.toUpperCase(),
    });

    revalidatePath('/configuracoes/estados');
    return { message: 'Estado adicionado com sucesso!' };
}

// --- Concessionaires ---
const concessionaireSchema = z.object({
    name: z.string().min(2),
    stateId: z.string().min(1),
    requiredDocs: z.string(), // We'll expect a comma-separated string or handle it differently
});

export async function addConcessionaire(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        stateId: formData.get('stateId'),
        requiredDocs: formData.get('requiredDocs'),
    };

    const result = concessionaireSchema.safeParse(rawData);
    if (!result.success) return { message: 'Dados inválidos.' };

    // Parse docs from newline or comma separated string
    const docsList = result.data.requiredDocs
        .split(/[\n,]/)
        .map(d => d.trim())
        .filter(d => d.length > 0);

    await db.addConcessionaire({
        id: crypto.randomUUID(),
        name: result.data.name,
        stateId: result.data.stateId,
        requiredDocs: docsList,
    });

    revalidatePath('/configuracoes/concessionarias');
    return { message: 'Concessionária adicionada!' };
}

export async function updateConcessionaireAction(prevState: any, formData: FormData) {
    const rawData = {
        id: formData.get('id'),
        name: formData.get('name'),
        stateId: formData.get('stateId'),
        requiredDocs: formData.get('requiredDocs'),
    };

    // Validate ID presence
    if (!rawData.id || typeof rawData.id !== 'string') {
        return { message: 'ID da concessionária não encontrado.' };
    }

    const result = concessionaireSchema.safeParse({
        name: rawData.name,
        stateId: rawData.stateId,
        requiredDocs: rawData.requiredDocs
    });

    if (!result.success) return { message: 'Dados inválidos.' };

    const docsList = result.data.requiredDocs
        .split(/[\n,]/)
        .map(d => d.trim())
        .filter(d => d.length > 0);

    await db.updateConcessionaire(rawData.id, {
        name: result.data.name,
        stateId: result.data.stateId,
        requiredDocs: docsList,
    });

    revalidatePath('/configuracoes/concessionarias');
    return { message: 'Concessionária atualizada!' };
}

export async function deleteConcessionaire(id: string) {
    // In a real app we'd delete, for now let's just implement add.
    // The JSON DB adapter doesn't have delete yet, so we'd need to add it to db.ts first.
    // skipping for MVP unless requested.
}
