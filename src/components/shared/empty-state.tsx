import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: { label: string; href: string };
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">{description}</p>
            {action && (
                <Link href={action.href}>
                    <Button className="bg-gradient-primary text-white border-0 hover:opacity-90">{action.label}</Button>
                </Link>
            )}
        </div>
    );
}