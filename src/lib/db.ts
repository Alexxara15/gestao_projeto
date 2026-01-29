import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

export type Company = {
    id: string;
    name: string;
    cnpj: string;
    address: string;
    techResp: string;
    email: string;
    phone: string;
};

export type State = {
    id: string;
    name: string;
    uf: string;
};

export type Concessionaire = {
    id: string;
    name: string;
    stateId: string;
    requiredDocs: string[]; // List of document names
};

export type Project = {
    id: string;
    number: string;
    companyId: string;
    stateId: string;
    concessionaireId: string;
    city: string;
    infraType: string;
    poleCount: number;
    status: 'PREPARATION' | 'SENT' | 'SIGNED';
    createdAt: string;
    documents: {
        id: string;
        name: string;
        required: boolean;
        completed: boolean;
    }[];
};

export type GeneratedDocument = {
    id: string;
    projectId: string | null; // Nullable for standalone docs
    templateId: string;
    templateName: string;
    data: Record<string, any>; // Snapshot of form data
    fileUrl?: string; // Simulated file path
    createdAt: string;
    version: number;
    createdBy: string; // 'User' for now
    context?: 'PROJECT' | 'STANDALONE';
};

type Schema = {
    companies: Company[];
    states: State[];
    concessionaires: Concessionaire[];
    projects: Project[];
    generatedDocuments: GeneratedDocument[];
};

const INITIAL_DATA: Schema = {
    companies: [],
    states: [
        { id: '1', name: 'São Paulo', uf: 'SP' },
        { id: '2', name: 'Rio de Janeiro', uf: 'RJ' },
        { id: '3', name: 'Ceará', uf: 'CE' },
    ],
    concessionaires: [
        { id: '1', name: 'Enel SP', stateId: '1', requiredDocs: ['Requerimento', 'Projeto Técnico'] },
        { id: '2', name: 'Light', stateId: '2', requiredDocs: ['Solicitação de Acesso'] },
        { id: '3', name: 'Enel CE', stateId: '3', requiredDocs: ['Solicitação de Compartilhamento'] },
    ],
    projects: [],
    generatedDocuments: []
};

class Database {
    private async read(): Promise<Schema> {
        try {
            const data = await fs.readFile(DB_PATH, 'utf-8');
            const parsed = JSON.parse(data);
            // Migration for old files without generatedDocuments
            if (!parsed.generatedDocuments) parsed.generatedDocuments = [];
            return parsed;
        } catch (error) {
            // If file doesn't exist, create it
            await this.write(INITIAL_DATA);
            return INITIAL_DATA;
        }
    }

    private async write(data: Schema): Promise<void> {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    }

    // Companies
    async getCompanies() { return (await this.read()).companies; }
    async addCompany(company: Company) {
        const data = await this.read();
        data.companies.push(company);
        await this.write(data);
        return company;
    }

    // States
    async getStates() { return (await this.read()).states; }
    async addState(state: State) {
        const data = await this.read();
        data.states.push(state);
        await this.write(data);
        return state;
    }

    // Concessionaires
    async getConcessionaires() { return (await this.read()).concessionaires; }
    async addConcessionaire(concessionaire: Concessionaire) {
        const data = await this.read();
        data.concessionaires.push(concessionaire);
        await this.write(data);
        return concessionaire;
    }
    async updateConcessionaire(id: string, updates: Partial<Concessionaire>) {
        const data = await this.read();
        data.concessionaires = data.concessionaires.map(c => c.id === id ? { ...c, ...updates } : c);
        await this.write(data);
    }

    // Projects
    async getProjects() { return (await this.read()).projects; }
    async addProject(project: Project) {
        const data = await this.read();
        data.projects.push(project);
        await this.write(data);
        return project;
    }
    async updateProject(id: string, updates: Partial<Project>) {
        const data = await this.read();
        data.projects = data.projects.map(p => p.id === id ? { ...p, ...updates } : p);
        await this.write(data);
    }
    async updateProjectStatus(id: string, status: Project['status']) {
        return this.updateProject(id, { status });
    }
    async deleteProject(id: string) {
        const data = await this.read();
        data.projects = data.projects.filter(p => p.id !== id);
        if (data.generatedDocuments) {
            data.generatedDocuments = data.generatedDocuments.filter(d => d.projectId !== id);
        }
        await this.write(data);
    }

    // Generated Documents
    async getAllGeneratedDocuments() {
        const data = await this.read();
        return (data.generatedDocuments || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async getGeneratedDocuments(projectId: string) {
        const data = await this.read();
        return (data.generatedDocuments || []).filter(d => d.projectId === projectId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async addGeneratedDocument(doc: GeneratedDocument) {
        const data = await this.read();
        if (!data.generatedDocuments) data.generatedDocuments = [];
        data.generatedDocuments.push(doc);
        await this.write(data);
        return doc;
    }

    async getDocumentById(id: string) {
        const data = await this.read();
        return (data.generatedDocuments || []).find(d => d.id === id);
    }
}

export const db = new Database();
