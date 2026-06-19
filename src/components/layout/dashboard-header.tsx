"use client";
import { Bell, Search, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center gap-4 px-4 sm:px-6 lg:px-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search interviews, challenges…" className="pl-10 h-9 bg-muted/50 border-0 focus-visible:ring-1" />
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <Link href="/candidate/interviews/new">
                    <Button size="sm" className="bg-gradient-primary text-white border-0 hidden sm:flex items-center gap-1.5 h-8 text-xs font-semibold hover:opacity-90">
                        <Plus className="h-3.5 w-3.5" />
                        New Interview
                    </Button>
                </Link>

                <ThemeToggle />

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-white border-0">3</Badge>
                </Button>

                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-gradient-primary text-white text-xs">JD</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}