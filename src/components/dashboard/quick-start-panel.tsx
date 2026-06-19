"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Code2, FileText, Mic } from "lucide-react";

const actions = [
    { label: "AI Interview", desc: "Technical or behavioral", icon: Video, href: "/candidate/interviews/new", color: "text-violet-500 bg-violet-50 dark:bg-violet-950/40" },
    { label: "Coding Challenge", desc: "DSA & algorithms", icon: Code2, href: "/candidate/coding", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40" },
    { label: "Voice Interview", desc: "Practice communication", icon: Mic, href: "/candidate/interviews/new?type=voice", color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40" },
    { label: "Analyze Resume", desc: "Get ATS score", icon: FileText, href: "/candidate/resume", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40" },
];

export function QuickStartPanel() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                {actions.map((action) => (
                    <Link key={action.label} href={action.href}>
                        <Button variant="outline" className="w-full h-auto flex flex-col items-center py-3 gap-2 card-hover text-center">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${action.color}`}>
                                <action.icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold">{action.label}</p>
                                <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                            </div>
                        </Button>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}