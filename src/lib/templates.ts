export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea';

export interface TemplateField {
    id: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    options?: string[]; // For select type
    defaultValue?: string; // Can be a variable like {{project.city}}
}

export interface DocumentTemplate {
    id: string;
    name: string;
    type: 'Requerimento' | 'Projeto' | 'Termo' | 'Outros';
    description: string;
    concessionaireId: string; // Linked to specific utility company
    stateId?: string; // Optional, if specific to a state
    fields: TemplateField[];
    contentTemplate: string; // The text content with {{variables}}
    templateFile?: string; // Path to .docx template
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
    {
        id: 'enel-ce-solicitacao-01',
        name: 'Solicitação de Compartilhamento',
        type: 'Requerimento',
        description: 'Documento obrigatório para início de processo na Enel Ceará.',
        concessionaireId: '3', // Enel CE
        stateId: '3', // CE
        templateFile: 'public/templates/enel/ce/modelo_base_solicitacao_compartilhamento_enel_ce.docx',
        fields: [
            { id: 'municipio', label: 'Município', type: 'text', required: true, defaultValue: '{{project.city}}' },
            { id: 'data_documento', label: 'Data do Documento', type: 'date', required: true, defaultValue: '{{today}}' },
            { id: 'representante_nome', label: 'Nome do Representante', type: 'text', required: true, defaultValue: '{{company.techResp}}' },
            { id: 'representante_cargo', label: 'Cargo do Representante', type: 'text', required: true, placeholder: 'Ex: Sócio-Administrador' },
            { id: 'empresa_razao_social', label: 'Razão Social', type: 'text', required: true, defaultValue: '{{company.name}}' },
            { id: 'empresa_cnpj', label: 'CNPJ', type: 'text', required: true, defaultValue: '{{company.cnpj}}' },
            { id: 'email_contato', label: 'E-mail de Contato', type: 'text', required: true, defaultValue: '{{company.email}}' },
            { id: 'endereco_correspondencia', label: 'Endereço para Correspondência', type: 'textarea', required: true, defaultValue: '{{company.address}}' }
        ],
        contentTemplate: '' // Unused for DOCX generation but kept for type compatibility if needed
    }
];

export function getTemplates(concessionaireId: string, stateId: string) {
    return DOCUMENT_TEMPLATES.filter(
        t => t.concessionaireId === concessionaireId && (!t.stateId || t.stateId === stateId)
    );
}
