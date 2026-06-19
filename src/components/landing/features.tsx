"use client";
import { motion } from "framer-motion";
import { Bot, Code2, BarChart3, Mic, FileSearch, TrendingUp, Brain, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: Bot,
        title: "AI Interviewer",
        description: "Dynamic questioning with context-aware conversations and adaptive difficulty that matches your level in real time.",
        color: "text-violet-500",
        bg: "bg-violet-50 dark:bg-violet-950/30",
        border: "border-violet-200 dark:border-violet-800/30",
        gradient: "from-violet-500/10 to-purple-500/5",
    },
    {
        icon: Code2,
        title: "Coding Interviews",
        description: "Monaco Editor with Judge0 execution, hidden test cases, complexity analysis, and AI-powered code review.",
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-200 dark:border-blue-800/30",
        gradient: "from-blue-500/10 to-indigo-500/5",
    },
    {
        icon: BarChart3,
        title: "AI Evaluation",
        description: "Multi-dimensional scoring across technical depth, communication clarity, problem solving, and confidence.",
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800/30",
        gradient: "from-emerald-500/10 to-teal-500/5",
    },
    {
        icon: FileSearch,
        title: "Resume Analyzer",
        description: "PDF parsing with skill extraction, ATS score, and personalized interview generation based on your resume.",
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-800/30",
        gradient: "from-amber-500/10 to-orange-500/5",
    },
    {
        icon: Mic,
        title: "Voice Interviews",
        description: "Speech-to-text transcription, live analysis of speaking speed, pause frequency, and vocal confidence score.",
        color: "text-rose-500",
        bg: "bg-rose-50 dark:bg-rose-950/30",
        border: "border-rose-200 dark:border-rose-800/30",
        gradient: "from-rose-500/10 to-pink-500/5",
    },
    {
        icon: TrendingUp,
        title: "Progress Tracking",
        description: "Performance graphs, radar charts, historical trends, and detailed growth insights across all sessions.",
        color: "text-cyan-500",
        bg: "bg-cyan-50 dark:bg-cyan-950/30",
        border: "border-cyan-200 dark:border-cyan-800/30",
        gradient: "from-cyan-500/10 to-sky-500/5",
    },
    {
        icon: Brain,
        title: "Smart Feedback",
        description: "Detailed AI-generated improvement plans, curated learning resources, and targeted practice recommendations.",
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-950/30",
        border: "border-purple-200 dark:border-purple-800/30",
        gradient: "from-purple-500/10 to-violet-500/5",
    },
    {
        icon: Zap,
        title: "Recruiter Suite",
        description: "Create assessments, invite candidates, track pipeline stages, and export detailed PDF reports instantly.",
        color: "text-primary",
        bg: "bg-primary-50 dark:bg-primary-950/30",
        border: "border-primary-200 dark:border-primary-800/30",
        gradient: "from-primary-500/10 to-violet-500/5",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Platform Features</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        Everything you need to <span className="gradient-text">ace every interview</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From AI-generated questions to real-time evaluation — a complete interview ecosystem for candidates and recruiters.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className={cn(
                                "group relative rounded-2xl p-6 border card-hover overflow-hidden",
                                `bg-gradient-to-br ${feature.gradient}`,
                                feature.border
                            )}
                        >
                            <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center mb-4", feature.bg)}>
                                <feature.icon className={cn("h-5 w-5", feature.color)} />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2 text-[15px]">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}