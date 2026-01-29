'use server';

import { db, GeneratedDocument } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { DOCUMENT_TEMPLATES } from "@/lib/templates"; // Import at top level

function formatDateFull(dateString: string): string {
    // Input: YYYY-MM-DD (e.g., 2026-01-28)
    if (!dateString) return dateString;
    const [year, month, day] = dateString.split('-').map(Number);

    // Validate
    if (!year || !month || !day) return dateString;

    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    // Format: "15 de janeiro de 2026" (day without leading zero)
    return `${day} de ${months[month - 1]} de ${year}`;
}

export async function generateDocument(projectId: string | null, templateId: string, templateName: string, formData: Record<string, any>) {
    // 1. Determine new version
    let existingDocs: GeneratedDocument[] = [];

    if (projectId) {
        existingDocs = await db.getGeneratedDocuments(projectId);
    } else {
        // For standalone, we get ALL docs and filter for standalone ones (where projectId is null)
        const allDocs = await db.getAllGeneratedDocuments();
        existingDocs = allDocs.filter(d => d.projectId === null);
    }

    const sameTemplateDocs = existingDocs.filter(d => d.templateId === templateId);
    const version = sameTemplateDocs.length + 1;

    // 2. Prepare Data for Template
    const preparedData = { ...formData };

    // Apply special date formatting rule for 'data_documento'
    if (preparedData['data_documento']) {
        preparedData['data_documento'] = formatDateFull(preparedData['data_documento']);
    }

    // 3. Load Template File
    // We need to find the template path. For MVP, we can assume it's in templates.ts, 
    // but we can't import dynamic modules easily in server actions if not careful.
    // Let's re-import the constant or fetch it.
    // Ideally we would fetch the template definition. 
    // Since we know the ID scheme or passed params, but we didn't pass file path.
    // Let's try to load the template dictionary here or passed in arg? 
    // No, server action receives primitive args usually.
    // We will hardcode only for this MVP or Import the constant.
    const templateDef = DOCUMENT_TEMPLATES.find((t: any) => t.id === templateId);

    if (!templateDef || !templateDef.templateFile) {
        console.error(`TemplateDefinitionNotFound: ID=${templateId}`);
        throw new Error('Template file not configured.');
    }

    const templatePath = path.resolve(process.cwd(), templateDef.templateFile);
    console.log(`Loading template from: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
        console.error(`FileDoesNotExist: ${templatePath}`);
        throw new Error(`Template file missing at: ${templateDef.templateFile}`);
    }

    // 4. Generate DOCX
    try {
        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);

        // --- AUTO-CLEANUP START ---
        // Attempt to clean common XML artifacts that break tags
        try {
            const xmlFile = "word/document.xml";
            const fileInZip = zip.file(xmlFile);

            if (fileInZip) {
                let xml = fileInZip.asText();

                // 1. Remove proofing errors (red/blue squiggly lines)
                xml = xml.replace(/<w:proofErr[^>]*\/>/g, "");
                xml = xml.replace(/<w:gramE[^>]*\/>/g, "");
                xml = xml.replace(/<w:lang[^>]*\/>/g, "");

                // 2. Remove RSID tags (Revision Save IDs) which litter the XML
                xml = xml.replace(/w:rsidR="[^"]*"/g, "");
                xml = xml.replace(/w:rsidRPr="[^"]*"/g, "");
                xml = xml.replace(/w:rsidRDefault="[^"]*"/g, "");
                xml = xml.replace(/w:rsidP="[^"]*"/g, "");

                // 3. Remove Bookmarks (often wrapped around text)
                xml = xml.replace(/<w:bookmarkStart[^>]*\/>/g, "");
                xml = xml.replace(/<w:bookmarkEnd[^>]*\/>/g, "");

                zip.file(xmlFile, xml);
                console.log("Template XML auto-cleaned (Advanced).");
            }
        } catch (cleanError) {
            console.warn("Failed to auto-clean XML, proceeding with original:", cleanError);
        }
        // --- AUTO-CLEANUP END ---

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: { start: '{', end: '}' }, // Switch to single brackets to simplify
        });

        doc.render(preparedData);

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });

        // 5. Save File
        const companyName = formData['empresa_razao_social'] || 'AVULSO';
        const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 15);
        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const fileName = `ENEL_CE_Doc_${safeCompanyName}_v${version}_${dateStr}.docx`;

        // Ensure directory exists
        const outputDir = path.resolve(process.cwd(), 'public/generated-docs');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, fileName);
        fs.writeFileSync(outputPath, buf);

        // 6. Persist to DB
        const newDoc: GeneratedDocument = {
            id: crypto.randomUUID(),
            projectId, // Can be null
            templateId,
            templateName,
            data: formData, // Save ORIGINAL raw data for re-editing
            createdAt: new Date().toISOString(),
            version: version,
            createdBy: 'Usuário Demo',
            fileUrl: `/generated-docs/${fileName}`,
            context: projectId ? 'PROJECT' : 'STANDALONE'
        };

        await db.addGeneratedDocument(newDoc);

        revalidatePath(`/documentos`);
        if (projectId) {
            revalidatePath(`/projetos/${projectId}`);
        }

        return { success: true, document: newDoc };

    } catch (error: any) {
        console.error('Error generating document:', error);

        // Improve error message if it's from docxtemplater
        if (error.properties && error.properties.errors) {
            error.properties.errors.forEach((e: any) => {
                console.error('Docxtemplater Error:', e);
            });
            throw new Error(`Template Error: ${error.properties.errors.map((e: any) => e.message).join(', ')}`);
        }

        throw new Error(`Failed to generate document: ${error.message}`);
    }
}

export async function getProjectDocuments(projectId: string) {
    return await db.getGeneratedDocuments(projectId);
}
