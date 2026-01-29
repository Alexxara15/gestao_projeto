import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StateForm } from "@/components/admin/StateForm";

export default async function EstadosPage() {
    const states = await db.getStates();

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/configuracoes">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gerenciar Estados</h2>
                    <p className="text-muted-foreground">Cadastre os estados onde sua empresa atua.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estados Cadastrados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>UF</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {states.map((state) => (
                                        <TableRow key={state.id}>
                                            <TableCell className="font-medium">{state.name}</TableCell>
                                            <TableCell>{state.uf}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" disabled>Editar</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {states.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">Nenhum estado encontrado.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <StateForm />
                </div>
            </div>
        </div>
    );
}
