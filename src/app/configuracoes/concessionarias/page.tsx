import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ConcessionairesManager } from "@/components/admin/ConcessionairesManager";

export default async function ConcessionariasPage() {
    const concessionaires = await db.getConcessionaires();
    const states = await db.getStates();

    // Helper to find state uf
    const getUf = (id: string) => states.find(s => s.id === id)?.uf || '?';

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/configuracoes">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Concessionárias</h2>
                    <p className="text-muted-foreground">Cadastre concessionárias e suas regras de documentação.</p>
                </div>
            </div>

            <ConcessionairesManager concessionaires={concessionaires} states={states} />
        </div>
    );
}
