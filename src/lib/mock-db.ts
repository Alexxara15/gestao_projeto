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
};

export const mockCompanies: Company[] = [
    {
        id: '1',
        name: 'TechSolutions Engenharia',
        cnpj: '12.345.678/0001-90',
        address: 'Av. Paulista, 1000 - SP',
        techResp: 'João Silva',
        email: 'contato@techsolutions.com',
        phone: '(11) 98765-4321',
    },
    {
        id: '2',
        name: 'Connect Fibra',
        cnpj: '98.765.432/0001-10',
        address: 'Rua das Flores, 50 - RJ',
        techResp: 'Maria Oliveira',
        email: 'eng@connectfibra.com.br',
        phone: '(21) 91234-5678',
    },
];

export const mockStates: State[] = [
    { id: '1', name: 'São Paulo', uf: 'SP' },
    { id: '2', name: 'Rio de Janeiro', uf: 'RJ' },
    { id: '3', name: 'Minas Gerais', uf: 'MG' },
];

export const mockConcessionaires: Concessionaire[] = [
    { id: '1', name: 'Enel SP', stateId: '1' },
    { id: '2', name: 'CPFL', stateId: '1' },
    { id: '3', name: 'Light', stateId: '2' },
    { id: '4', name: 'Cemig', stateId: '3' },
];

export const mockProjects: Project[] = [
    {
        id: '101',
        number: 'PRJ-2024-001',
        companyId: '1',
        stateId: '1',
        concessionaireId: '1',
        city: 'São Paulo',
        infraType: 'Fibra Óptica',
        poleCount: 50,
        status: 'PREPARATION',
        createdAt: new Date().toISOString(),
    },
];

// Helper functions (simulating async DB calls)
export const getCompanies = async () => Promise.resolve(mockCompanies);
export const getStates = async () => Promise.resolve(mockStates);
export const getConcessionaires = async () => Promise.resolve(mockConcessionaires);
export const getProjects = async () => Promise.resolve(mockProjects);
