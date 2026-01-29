import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão de Infraestrutura",
  description: "Sistema de gestão de projetos de compartilhamento de infraestrutura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="h-full relative">
          <div className="hidden h-full md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900">
            <Sidebar />
          </div>
          <main className="md:pl-60 h-full bg-slate-50 min-h-screen flex flex-col">
            <div className="md:hidden">
              <Header />
            </div>
            <div className="p-8 flex-1 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
