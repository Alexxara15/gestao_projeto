import { db } from "@/lib/db";
import { ProjectWizardForm } from "@/components/projects/ProjectWizardForm";

export default async function NovoProjetoPage() {
    // Fetch all necessary data for the wizard dropdowns
    const companies = await db.getCompanies();
    const states = await db.getStates();
    const concessionaires = await db.getConcessionaires();

    return (
        <ProjectWizardForm
            companies={companies}
            states={states}
            concessionaires={concessionaires}
        />
    );
}
