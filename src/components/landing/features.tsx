"use client";
import { motion } from "framer-motion";
import { MessageSquare, Code2, BarChart3, Mic, FileText, TrendingUp, Users, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: MessageSquare,
        title: "AI Interviews",
        description: "Dynamic questioning with context-aware conversations and adaptive difficulty that matches your level in real time.",
    },
    {
        icon: Code2,
        title: "Coding Interviews",
        description: "Monaco Editor with Judge0 execution, hidden test cases, complexity analysis, and AI-powered code review.",
    },
    {
        icon: BarChart3,
        title: "Analytics",
        description: "Multi-dimensional scoring across technical depth, communication clarity, problem solving, and confidence.",
    },
    {
        icon: FileText,
        title: "Resume Analyzer",
        description: "PDF parsing with skill extraction, ATS score, and personalized interview generation based on your resume.",
    },
    {
        icon: Mic,
        title: "Voice Interviews",
        description: "Speech-to-text transcription, live analysis of speaking speed, pause frequency, and vocal confidence score.",
    },
    {
        icon: TrendingUp,
        title: "Progress Tracking",
        description: "Performance graphs, radar charts, historical trends, and detailed growth insights across all sessions.",
    },
    {
        icon: Users,
        title: "Recruiter Dashboard",
        description: "Create assessments, invite candidates, track pipeline stages, and export detailed PDF reports instantly.",
    },
    {
        icon: ClipboardCheck,
        title: "AI Feedback",
        description: "Detailed AI-generated improvement plans, curated learning resources, and targeted practice recommendations.",
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
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                        Everything you need to ace every interview
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From AI-generated questions to real-time evaluation — a complete interview ecosystem for candidates and recruiters.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="group relative rounded-xl p-6 border border-border bg-card card-hover overflow-hidden"
                        >
                            <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center mb-4">
                                <feature.icon className="h-5 w-5 text-foreground" />
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