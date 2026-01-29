"use client";

import { Concessionaire, State } from "@/lib/db";
import { ConcessionaireForm } from "@/components/admin/ConcessionaireForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ConcessionairesManagerProps {
    concessionaires: Concessionaire[];
    states: State[];
}

export function ConcessionairesManager({ concessionaires, states }: ConcessionairesManagerProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    const editingItem = editingId ? concessionaires.find(c => c.id === editingId) : null;
    const getUf = (id: string) => states.find(s => s.id === id)?.uf || '?';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Concessionárias Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>UF</TableHead>
                                    <TableHead>Docs Exigidos</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {concessionaires.map((conn) => (
                                    <TableRow key={conn.id}>
                                        <TableCell className="font-medium align-top">{conn.name}</TableCell>
                                        <TableCell className="align-top">{getUf(conn.stateId)}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {conn.requiredDocs.slice(0, 3).map((d, i) => (
                                                    <Badge key={i} variant="outline" className="text-[10px]">{d}</Badge>
                                                ))}
                                                {conn.requiredDocs.length > 3 && (
                                                    <Badge variant="outline" className="text-[10px]">+{conn.requiredDocs.length - 3}</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right align-top">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingId(conn.id)}
                                            >
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <ConcessionaireForm
                    states={states}
                    initialData={editingItem}
                    onCancel={() => setEditingId(null)}
                />
            </div>
        </div>
    );
}
