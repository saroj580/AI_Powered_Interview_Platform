"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Star, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const MOCK_SCORE_CARDS = [
    { label: "Technical", score: 88, color: "text-primary" },
    { label: "Communication", score: 92, color: "text-emerald-500" },
    { label: "Problem Solving", score: 85, color: "text-blue-500" },
    { label: "Confidence", score: 79, color: "text-amber-500" },
];

export function HeroSection() {
    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-hero">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/3 right-0 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "4s" }} />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "64px 64px" }}
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="flex flex-col gap-8">
                        <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp}>
                            <Badge className="bg-primary/15 text-primary-300 border-primary/20 px-4 py-1.5 text-sm font-medium">
                                <Zap className="h-3.5 w-3.5 mr-1.5" />
                                Powered by Gemini 2.5 Pro
                            </Badge>
                        </motion.div>

                        <motion.h1
                            custom={1} initial="hidden" animate="show" variants={fadeUp}
                            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.08] text-white"
                        >
                            AI-Powered Interview Platform for{" "}
                            <span className="gradient-text-light">Modern Hiring</span>
                        </motion.h1>

                        <motion.p
                            custom={2} initial="hidden" animate="show" variants={fadeUp}
                            className="text-lg text-slate-300 leading-relaxed max-w-lg"
                        >
                            Conduct technical, behavioral and coding interviews with AI-generated
                            questions and real-time evaluation. Practice smarter,{" "}
                            <span className="text-white font-medium">get hired faster.</span>
                        </motion.p>

                        <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp} className="flex flex-wrap gap-3">
                            <Link href="/register">
                                <Button size="lg" className="bg-gradient-primary text-white border-0 shadow-glow-purple hover:opacity-90 h-12 px-6 text-base font-semibold">
                                    Start Free Interview
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-6 text-base backdrop-blur-sm">
                                <Play className="mr-2 h-4 w-4" />
                                Watch Demo
                            </Button>
                        </motion.div>

                        <motion.div custom={4} initial="hidden" animate="show" variants={fadeUp} className="flex items-center gap-6 pt-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-9 w-9 rounded-full border-2 border-slate-800 bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                                    <span className="text-white font-semibold ml-1">4.9</span>
                                </div>
                                <p className="text-slate-400 text-sm">Trusted by 500+ engineering teams</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Mock Dashboard Card */}
                    <motion.div
                        custom={2} initial="hidden" animate="show" variants={fadeUp}
                        className="hidden lg:block"
                    >
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
                            <div className="glass rounded-2xl p-6 max-w-md ml-auto">
                                {/* Interview header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-white/60 text-xs mb-1">AI Interview Session</p>
                                        <h3 className="text-white font-semibold">Senior React Developer</h3>
                                    </div>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                                        Live
                                    </Badge>
                                </div>

                                {/* Question display */}
                                <div className="bg-white/5 rounded-xl p-4 mb-5">
                                    <p className="text-white/50 text-xs mb-2">Question 3 of 10</p>
                                    <p className="text-white text-sm leading-relaxed">
                                        Explain the difference between <code className="text-primary-300 bg-primary/10 px-1 py-0.5 rounded text-xs">useCallback</code> and{" "}
                                        <code className="text-primary-300 bg-primary/10 px-1 py-0.5 rounded text-xs">useMemo</code> hooks and when you would use each one.
                                    </p>
                                </div>

                                {/* Score cards */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {MOCK_SCORE_CARDS.map((card) => (
                                        <div key={card.label} className="bg-white/5 rounded-lg p-3">
                                            <p className="text-white/50 text-xs mb-1">{card.label}</p>
                                            <p className={`text-2xl font-bold ${card.color}`}>{card.score}</p>
                                            <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
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

                                {/* Footer */}
                                <div className="flex items-center justify-between text-white/40 text-xs">
                                    <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> AI Evaluated</span>
                                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Real-time Feedback</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}