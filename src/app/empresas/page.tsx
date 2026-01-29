import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function EmpresasPage() {
    const companies = await db.getCompanies();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Empresas</h2>
                <Button asChild>
                    <Link href="/empresas/novo">
                        <Plus className="mr-2 h-4 w-4" /> Nova Empresa
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Empresas Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>CNPJ</TableHead>
                                <TableHead>Responsável</TableHead>
                                <TableHead>Cidade/UF</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companies.map((company) => (
                                <TableRow key={company.id}>
                                    <TableCell className="font-medium">{company.name}</TableCell>
                                    <TableCell>{company.cnpj}</TableCell>
                                    <TableCell>{company.techResp}</TableCell>
                                    <TableCell>{company.address.split('-').pop()?.trim()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Editar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {companies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        Nenhuma empresa cadastrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
