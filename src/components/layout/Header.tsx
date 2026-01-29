"use client";

import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { cn } from "@/lib/utils";

interface HeaderProps {
    className?: string;
}

export const Header = ({ className }: HeaderProps) => {
    return (
        <div className={cn("flex items-center p-4 border-b h-16 w-full bg-background", className)}>
            <MobileSidebar />
            <div className="flex w-full justify-end">
                {/* UserButton or similar could go here */}
            </div>
        </div>
    );
};
