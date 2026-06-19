"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Users, CheckCircle, TrendingUp } from "lucide-react";

const stats = [
    { label: "Active Assessments", value: "8", change: "+2 this week", icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
    { label: "Total Candidates", value: "142", change: "+18 this month", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Interviews Completed", value: "89", change: "63% completion rate", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Avg Candidate Score", value: "74", change: "+3 from last batch", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
];

export function RecruiterStatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <Card className="card-hover">
                        <CardContent className="p-5">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${s.bg}`}>
                                <s.icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                            <p className="text-3xl font-extrabold mb-1">{s.value}</p>
                            <p className="text-sm text-muted-foreground font-medium mb-1">{s.label}</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">{s.change}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}