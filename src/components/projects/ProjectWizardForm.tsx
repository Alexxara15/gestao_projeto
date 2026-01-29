"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import Link from "next/link";
import { createProject } from "@/app/_actions/project-actions";
import { Company, State, Concessionaire } from "@/lib/db";

interface ProjectWizardFormProps {
    companies: Company[];
    states: State[];
    concessionaires: Concessionaire[];
}

export function ProjectWizardForm({ companies, states, concessionaires }: ProjectWizardFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyId: '',
        stateId: '',
        concessionaireId: '',
        city: '',
        projectType: 'POSTES', // Default changed
        poleCount: '',
    });

    // const nextStep = () => setStep(s => Math.min(s + 1, 3)); // Removed duplicate
    // const prevStep = () => setStep(s => Math.max(s - 1, 1)); // Removed duplicate

    const [state, formAction, isPending] = useActionState(createProject, { message: '' });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!formData.companyId) return "Selecione uma empresa";
            if (!formData.stateId) return "Selecione um estado";
            if (!formData.city) return "Digite a cidade";
            if (!formData.concessionaireId) return "Selecione uma concessionária";
        }
        if (currentStep === 2) {
            if (!formData.poleCount) return "Informe a quantidade de postes";
        }
        return null;
    };

    const nextStep = () => {
        const error = validateStep(step);
        if (error) {
            alert(error); // Simple feedback for now, could be better UI
            return;
        }
        setStep(s => Math.min(s + 1, 3));
    };

    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    // Filter concessionaires by selected state if possible, or just list all
    const filteredConcessionaires = formData.stateId
        ? concessionaires.filter(c => c.stateId === formData.stateId)
        : concessionaires;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header ... */}
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/projetos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">Novo Projeto</h2>
                    <p className="text-muted-foreground">Assistente de criação de processo</p>
                </div>
            </div>

            {/* Progress Steps ... */}
            <div className="flex justify-between relative py-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex flex-col items-center bg-white px-2`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= s ? 'bg-primary border-primary text-white' : 'bg-white border-slate-300 text-slate-500'
                            }`}>
                            {s}
                        </div>
                        <span className="text-xs mt-1 font-medium text-slate-600">
                            {s === 1 ? 'Cliente/Local' : s === 2 ? 'Detalhes' : 'Confirmação'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <Card>
                <form action={formAction}>
                    {/* Hidden inputs to pass state to server action */}
                    <input type="hidden" name="companyId" value={formData.companyId} />
                    <input type="hidden" name="stateId" value={formData.stateId} />
                    <input type="hidden" name="concessionaireId" value={formData.concessionaireId} />
                    <input type="hidden" name="city" value={formData.city} />
                    <input type="hidden" name="projectType" value={formData.projectType} />
                    <input type="hidden" name="poleCount" value={formData.poleCount} />

                    <CardHeader>
                        <CardTitle>
                            {step === 1 && "Dados do Cliente e Localização"}
                            {step === 2 && "Detalhes do Projeto"}
                            {step === 3 && "Revisão e Geração"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && "Selecione o cliente e a área de atuação."}
                            {step === 2 && "Informe as características da rede."}
                            {step === 3 && "Confira os dados antes de gerar os documentos."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {step === 1 && (
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Empresa / Cliente</Label>
                                    <Select onValueChange={(v) => updateField('companyId', v)} defaultValue={formData.companyId}>
                                        <SelectTrigger><SelectValue placeholder="Selecione a empresa" /></SelectTrigger>
                                        <SelectContent>
                                            {companies.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Estado (UF)</Label>
                                        <Select onValueChange={(v) => updateField('stateId', v)} defaultValue={formData.stateId}>
                                            <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                                            <SelectContent>
                                                {states.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cidade</Label>
                                        <Input
                                            placeholder="Digite a cidade"
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Concessionária</Label>
                                    <Select onValueChange={(v) => updateField('concessionaireId', v)} defaultValue={formData.concessionaireId}>
                                        <SelectTrigger><SelectValue placeholder="Selecione a concessionária" /></SelectTrigger>
                                        <SelectContent>
                                            {filteredConcessionaires.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo de Projeto</Label>
                                    <Select onValueChange={(v) => updateField('projectType', v)} defaultValue={formData.projectType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="POSTES">Compartilhamento de Postes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Quantidade de Postes</Label>
                                    <Input
                                        type="number"
                                        placeholder="Ex: 45"
                                        value={formData.poleCount}
                                        onChange={(e) => updateField('poleCount', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                {state?.message && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                        {state.message}
                                    </div>
                                )}

                                <div className="bg-slate-50 p-4 rounded-lg flex items-start space-x-4">
                                    <FileText className="h-6 w-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-medium">Documentação Automática</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Com base na concessionária selecionada (<strong>{concessionaires.find(c => c.id === formData.concessionaireId)?.name || 'N/A'}</strong>),
                                            o sistema irá gerar a lista de documentos obrigatórios e preencher os modelos disponíveis.
                                        </p>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cidade:</span>
                                        <span className="font-medium">{formData.city}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tipo:</span>
                                        <span className="font-medium">{formData.projectType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Postes:</span>
                                        <span className="font-medium">{formData.poleCount}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        {step > 1 ? (
                            <Button type="button" variant="outline" onClick={prevStep} disabled={isPending}>Voltar</Button>
                        ) : <div></div>}

                        {step < 3 ? (
                            <Button type="button" onClick={nextStep}>Próximo <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        ) : (
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Criando...' : 'Criar Projeto'}
                                {!isPending && <Check className="ml-2 h-4 w-4" />}
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
