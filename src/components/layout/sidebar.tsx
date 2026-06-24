"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Video, Code2, FileText, TrendingUp, Settings,
    ChevronLeft, ChevronRight, Sparkles, LogOut, ClipboardList,
    Users, BarChart3, Kanban, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";

const candidateNav = [
    { label: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
    { label: "My Interviews", href: "/candidate/interviews", icon: Video },
    { label: "Coding", href: "/candidate/coding", icon: Code2 },
    { label: "Resume", href: "/candidate/resume", icon: FileText },
    { label: "Progress", href: "/candidate/progress", icon: TrendingUp },
];

const recruiterNav = [
    { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
    { label: "Assessments", href: "/recruiter/assessments", icon: ClipboardList },
    { label: "Candidates", href: "/recruiter/candidates", icon: Users },
    { label: "Pipeline", href: "/recruiter/pipeline", icon: Kanban },
    { label: "Reports", href: "/recruiter/reports", icon: BarChart3 },
];

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function NavContent({ collapsed, role, navItems, pathname, onLogout }: {
    collapsed: boolean;
    role: string;
    navItems: typeof candidateNav;
    pathname: string;
    onLogout: () => void;
}) {
    const { user } = useAuthStore();

    return (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 p-4 border-b border-border h-16">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-bold gradient-text text-lg">
                            InterviewAI
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
                {navItems.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                    active
                                        ? "bg-primary/10 text-primary dark:text-primary-400 border border-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {active && !collapsed && (
                                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: User + Settings */}
            <div className="p-3 border-t border-border space-y-2">
                <Link href={`/${role}/settings`}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                        <Settings className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>Settings</span>}
                    </div>
                </Link>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>

                <div className="flex items-center gap-3 px-3 py-2.5">
                    <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
                        <AvatarImage src={user?.image ?? undefined} />
                        <AvatarFallback className="bg-gradient-primary text-white text-xs">
                            {user ? getInitials(user.name) : "?"}
                        </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name ?? "Loading…"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const role = pathname.startsWith("/recruiter") ? "recruiter" : "candidate";
    const navItems = role === "recruiter" ? recruiterNav : candidateNav;

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 h-9 w-9 rounded-lg bg-background border border-border shadow-sm flex items-center justify-center"
                onClick={() => setMobileOpen(true)}
            >
                <Menu className="h-4 w-4" />
            </button>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 z-40 bg-black/50"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-card border-r border-border"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <NavContent
                                collapsed={false}
                                role={role}
                                navItems={navItems}
                                pathname={pathname}
                                onLogout={handleLogout}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-30 flex-col bg-card border-r border-border transition-all duration-300 hidden lg:flex",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                <NavContent
                    collapsed={collapsed}
                    role={role}
                    navItems={navItems}
                    pathname={pathname}
                    onLogout={handleLogout}
                />

                {/* Collapse toggle */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background shadow-md"
                >
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>
            </aside>
        </>
    );
}
