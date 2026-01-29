import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Map, Zap, FileText } from "lucide-react";

export default function ConfiguracoesPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
            <p className="text-muted-foreground">Gerencie os parâmetros do sistema.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/configuracoes/estados">
                    <Card className="hover:bg-slate-50 transition cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Map className="h-5 w-5 text-blue-600" />
                                <span>Estados (UF)</span>
                            </CardTitle>
                            <CardDescription>Gerencie os estados atendidos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="ghost" className="w-full justify-start pl-0">Acessar &rarr;</Button>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/configuracoes/concessionarias">
                    <Card className="hover:bg-slate-50 transition cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Zap className="h-5 w-5 text-yellow-600" />
                                <span>Concessionárias</span>
                            </CardTitle>
                            <CardDescription>Cadastre empresas de energia e regras de documentos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="ghost" className="w-full justify-start pl-0">Acessar &rarr;</Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
