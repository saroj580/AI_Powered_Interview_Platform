"use client";
import { motion } from "framer-motion";
import { Video, TrendingUp, Target, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
    {
        label: "Total Interviews",
        value: "24",
        change: "+3 this week",
        positive: true,
        icon: Video,
        color: "text-violet-500",
        bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
        label: "Average Score",
        value: "78",
        change: "+5 from last month",
        positive: true,
        icon: TrendingUp,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
        label: "Strong Areas",
        value: "3",
        change: "React, Node.js, SQL",
        positive: true,
        icon: Target,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
        label: "Needs Work",
        value: "2",
        change: "System Design, DSA",
        positive: false,
        icon: AlertCircle,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/30",
    },
];

export function StatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                >
                    <Card className="card-hover">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg)}>
                                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                                </div>
                            </div>
                            <p className="text-3xl font-extrabold mb-1">{stat.value}</p>
                            <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                            <p className={cn("text-xs", stat.positive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}