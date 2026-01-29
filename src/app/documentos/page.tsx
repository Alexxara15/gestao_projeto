import { db } from "@/lib/db";
import { GlobalDocProduction } from "@/components/documents/GlobalDocProduction";

export const dynamic = 'force-dynamic';

export default async function DocumentosPage() {
    const projects = await db.getProjects();
    const companies = await db.getCompanies();
    const concessionaires = await db.getConcessionaires();
    const states = await db.getStates();

    // In a real app with many docs, we wouldn't fetch ALL. 
    // We would fetch on demand via server action in the component.
    // For MVP/small scale, reading the file is fine.
    // We need to expose a method to get ALL docs or filter later.
    // db.getGeneratedDocuments accepts projectId.
    // We can add a method to get all or just map here.
    // Let's assume we can modify db.ts or just iterate.
    // Since `db.ts` reads the whole file, we can expose `getAllGeneratedDocuments`.
    const allDocs = await db.getAllGeneratedDocuments();
    // Wait, method doesn't exist yet.
    // Let's look at db.ts again.
    // It has `getGeneratedDocuments(projectId)`.
    // I should add `getAllGeneratedDocuments` to db.ts first.

    return (
        <div className="space-y-6">
            {/* We will implement getAllGeneratedDocuments in db.ts or just fix it now */}
            <GlobalDocProduction
                projects={projects}
                companies={companies}
                concessionaires={concessionaires}
                states={states}
                allGeneratedDocuments={allDocs}
            />
        </div>
    );
}
