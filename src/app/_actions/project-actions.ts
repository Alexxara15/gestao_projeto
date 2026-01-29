'use server';

import { db, Project } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
    companyId: z.string().min(1),
    stateId: z.string().min(1),
    concessionaireId: z.string().min(1),
    city: z.string().min(2),
    projectType: z.string().min(1),
    poleCount: z.coerce.number().min(0),
});

export async function createProject(prevState: any, formData: FormData) {
    const rawData = {
        companyId: formData.get('companyId'),
        stateId: formData.get('stateId'),
        concessionaireId: formData.get('concessionaireId'),
        city: formData.get('city'),
        projectType: formData.get('projectType'),
        poleCount: formData.get('poleCount'),
    };

    const result = formSchema.safeParse(rawData);

    if (!result.success) {
        return { message: 'Dados inválidos. Verifique os campos.' };
    }

    // Fetch concessionaire to get required documents
    const apps = await db.getConcessionaires();
    const concessionaire = apps.find(c => c.id === result.data.concessionaireId);
    const requiredDocs = concessionaire?.requiredDocs || [];

    const newProject: Project = {
        id: crypto.randomUUID(),
        number: `PRJ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        companyId: result.data.companyId,
        stateId: result.data.stateId,
        concessionaireId: result.data.concessionaireId,
        city: result.data.city,
        infraType: result.data.projectType,
        poleCount: result.data.poleCount,
        status: 'PREPARATION',
        createdAt: new Date().toISOString(),
        documents: requiredDocs.map(name => ({
            id: crypto.randomUUID(),
            name,
            required: true,
            completed: false
        }))
    };

    await db.addProject(newProject);
    revalidatePath('/projetos');
    revalidatePath('/dashboard');
    redirect('/projetos');
}

export async function updateProjectStatus(id: string, status: Project['status']) {
    await db.updateProjectStatus(id, status);
    revalidatePath('/projetos');
    revalidatePath(`/projetos/${id}`);
}

export async function toggleDocumentStatus(projectId: string, docId: string) {
    const projects = await db.getProjects();
    const project = projects.find(p => p.id === projectId);

    if (project) {
        const updatedDocs = project.documents.map(d =>
            d.id === docId ? { ...d, completed: !d.completed } : d
        );
        await db.updateProject(projectId, { documents: updatedDocs });
        revalidatePath(`/projetos/${projectId}`);
    }
}

export async function deleteProjectAction(id: string) {
    await db.deleteProject(id);
    revalidatePath('/projetos');
    revalidatePath('/dashboard');
}
