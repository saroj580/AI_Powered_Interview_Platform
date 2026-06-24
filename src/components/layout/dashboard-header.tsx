"use client";
import { useState } from "react";
import { Bell, Search, Plus, LogOut, User, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

const NOTIFICATIONS = [
    { id: 1, title: "Interview complete!", desc: "Your React Developer session report is ready.", time: "2m ago", unread: true },
    { id: 2, title: "New challenge available", desc: "Binary Tree Maximum Path Sum — Hard", time: "1h ago", unread: true },
    { id: 3, title: "Progress milestone", desc: "You've completed 10 interviews! 🎉", time: "Yesterday", unread: false },
];

export function DashboardHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const [unreadCount] = useState(NOTIFICATIONS.filter(n => n.unread).length);

    const role = pathname.startsWith("/recruiter") ? "recruiter" : "candidate";

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center gap-4 px-4 sm:px-6 lg:px-8 lg:pl-6">
            {/* Left spacer for mobile hamburger */}
            <div className="w-10 lg:hidden" />

            {/* Search */}
            <div className="relative flex-1 max-w-md hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search interviews, challenges…" className="pl-10 h-9 bg-muted/50 border-0 focus-visible:ring-1" />
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {role === "candidate" && (
                    <Link href="/candidate/interviews/new">
                        <Button size="sm" className="bg-gradient-primary text-white border-0 hidden sm:flex items-center gap-1.5 h-8 text-xs font-semibold hover:opacity-90">
                            <Plus className="h-3.5 w-3.5" />
                            New Interview
                        </Button>
                    </Link>
                )}

                <ThemeToggle />

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-white border-0">
                                    {unreadCount}
                                </Badge>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {NOTIFICATIONS.map((n) => (
                            <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                                <div className="flex items-center gap-2 w-full">
                                    {n.unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                                    <span className={`text-sm font-medium ${!n.unread && "ml-4"}`}>{n.title}</span>
                                    <span className="ml-auto text-xs text-muted-foreground">{n.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground pl-4">{n.desc}</p>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center text-xs text-primary justify-center cursor-pointer">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Avatar with dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20">
                            <AvatarImage src={user?.image ?? undefined} />
                            <AvatarFallback className="bg-gradient-primary text-white text-xs">
                                {user ? getInitials(user.name) : "?"}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <p className="font-semibold">{user?.name ?? "Loading…"}</p>
                            <p className="text-xs text-muted-foreground font-normal">{user?.email ?? ""}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.push(`/${role}/settings`)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push(`/${role}/settings`)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            variant="destructive"
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
