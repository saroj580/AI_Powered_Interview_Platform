"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, MessageSquare, BarChart3, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

const MOCK_SCORE_CARDS = [
    { label: "Technical", score: 88, color: "text-primary" },
    { label: "Communication", score: 92, color: "text-emerald-500" },
    { label: "Problem Solving", score: 85, color: "text-blue-500" },
    { label: "Confidence", score: 79, color: "text-amber-500" },
];

export function HeroSection() {
    return (
        <section className="relative min-h-[92vh] flex items-center bg-background">

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="flex flex-col gap-8">
                        <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp}>
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
                                New: Voice Interviews
                            </Badge>
                        </motion.div>

                        <motion.h1
                            custom={1} initial="hidden" animate="show" variants={fadeUp}
                            className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] text-foreground"
                        >
                            Practice Interviews Like They're Real
                        </motion.h1>

                        <motion.p
                            custom={2} initial="hidden" animate="show" variants={fadeUp}
                            className="text-lg text-muted-foreground leading-relaxed max-w-lg"
                        >
                            AI-powered technical interviews, coding challenges, and resume analysis. 
                            Prepare smarter with real-time feedback and detailed scoring.
                        </motion.p>

                        <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp} className="flex flex-wrap gap-3">
                            <Link href="/register">
                                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 h-12 px-6 text-base font-semibold">
                                    Start Free Interview
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted h-12 px-6 text-base">
                                <Play className="mr-2 h-4 w-4" />
                                Watch Demo
                            </Button>
                        </motion.div>

                        <motion.div custom={4} initial="hidden" animate="show" variants={fadeUp} className="flex items-center gap-6 pt-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-primary-100 text-primary-700 dark:bg-primary/25 dark:text-primary-200 flex items-center justify-center text-xs font-bold">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="font-semibold text-foreground">4.9/5 rating</div>
                                <p className="text-muted-foreground text-sm">Trusted by 500+ engineering teams</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Product Screenshot */}
                    <motion.div
                        custom={2} initial="hidden" animate="show" variants={fadeUp}
                        className="hidden lg:block"
                    >
                        <div className="border border-border rounded-lg bg-card shadow-lg overflow-hidden max-w-md ml-auto">
                            {/* Browser chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <div className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="h-2 bg-border rounded max-w-xs mx-auto" />
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">AI Interview Session</p>
                                        <h3 className="font-semibold text-foreground">Senior React Developer</h3>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                                        Live
                                    </Badge>
                                </div>

                                <div className="bg-muted rounded-lg p-4 mb-5">
                                    <p className="text-muted-foreground text-xs mb-2">Question 3 of 10</p>
                                    <p className="text-foreground text-sm leading-relaxed">
                                        Explain the difference between <code className="bg-primary/10 text-primary px-1 py-0.5 rounded text-xs">useCallback</code> and{" "}
                                        <code className="bg-primary/10 text-primary px-1 py-0.5 rounded text-xs">useMemo</code> hooks and when you would use each one.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {MOCK_SCORE_CARDS.map((card) => (
                                        <div key={card.label} className="bg-muted rounded-lg p-3">
                                            <p className="text-muted-foreground text-xs mb-1">{card.label}</p>
                                            <p className={`text-2xl font-bold ${card.color}`}>{card.score}</p>
                                            <div className="mt-1.5 h-1 bg-border rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-current rounded-full"
                                                    style={{ color: "inherit" }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${card.score}%` }}
                                                    transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between text-muted-foreground text-xs">
                                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> AI Evaluated</span>
                                    <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Real-time Feedback</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}