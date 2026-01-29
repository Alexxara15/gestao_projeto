"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
    LayoutDashboard,
    Building2,
    FolderOpen,
    Settings,
    FileText,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Projetos",
            icon: FolderOpen,
            href: "/projetos",
            color: "text-violet-500",
        },
        {
            label: "Empresas",
            icon: Building2,
            href: "/empresas",
            color: "text-pink-700",
        },
        {
            label: "Produção de Docs",
            icon: FileText,
            href: "/documentos",
            color: "text-emerald-500",
        },
        {
            label: "Configurações",
            icon: Settings,
            href: "/configuracoes",
        },
    ];

    return (
        <div className={cn("pb-12 space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white", className)}>
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        {/* Logo placeholder */}
                        <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-black">P</div>
                    </div>
                    <h1 className="text-2xl font-bold">
                        Gestão Infra
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname.startsWith(route.href) ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3">
                <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Usuário</p>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs">US</div>
                        <div>
                            <p className="text-sm font-medium">Eng. Responsável</p>
                            <p className="text-xs text-slate-400">Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
