"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Download, RotateCcw, TrendingUp, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { getScoreColor, getScoreLabel } from "@/lib/utils";

const MOCK_REPORT = {
    title: "Senior React Developer",
    type: "Technical",
    date: "Today",
    duration: "42 minutes",
    scores: {
        technical: 82,
        communication: 88,
        problemSolving: 74,
        confidence: 79,
        overall: 81,
    },
    strengths: ["Deep knowledge of React hooks and lifecycle", "Clear communication and structured answers", "Good understanding of JavaScript closures"],
    weaknesses: ["System design explanations need more depth", "Could improve on time complexity analysis"],
    improvements: ["Practice STAR method for behavioral questions", "Review distributed systems concepts", "Solve 2–3 LeetCode medium problems daily"],
    summary: "Strong overall performance with excellent communication skills. Technical knowledge is solid, particularly in React ecosystem. Focus on system design depth and algorithm complexity to reach the next level.",
};

const radarData = [
    { skill: "Technical", score: MOCK_REPORT.scores.technical },
    { skill: "Communication", score: MOCK_REPORT.scores.communication },
    { skill: "Problem Solving", score: MOCK_REPORT.scores.problemSolving },
    { skill: "Confidence", score: MOCK_REPORT.scores.confidence },
];

export function InterviewReport() {
    const { overall } = MOCK_REPORT.scores;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <Badge variant="secondary" className="mb-2">Interview Report</Badge>
                    <h1 className="text-2xl font-bold">{MOCK_REPORT.title}</h1>
                    <p className="text-muted-foreground text-sm mt-1">{MOCK_REPORT.type} · {MOCK_REPORT.date} · {MOCK_REPORT.duration}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" />PDF</Button>
                    <Link href="/candidate/interviews/new"><Button size="sm" className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5"><RotateCcw className="h-4 w-4" />Retry</Button></Link>
                </div>
            </motion.div>

            {/* Overall Score Hero */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/20">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="text-center">
                                <div className={`text-7xl font-black ${getScoreColor(overall)}`}>{overall}</div>
                                <p className="text-muted-foreground text-sm mt-1">Overall Score</p>
                                <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">{getScoreLabel(overall)}</Badge>
                            </div>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height={200}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                                        <Radar name="Score" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Score breakdown */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card>
                    <CardHeader><CardTitle className="text-base">Score Breakdown</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(MOCK_REPORT.scores).filter(([k]) => k !== "overall").map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                    <span className={`font-bold text-sm ${getScoreColor(val)}`}>{val}/100</span>
                                </div>
                                <Progress value={val} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Strengths + Weaknesses */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-2 gap-4">
                <Card className="border-emerald-200 dark:border-emerald-800/30">
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Strengths</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {MOCK_REPORT.strengths.map((s) => (
                            <div key={s} className="flex items-start gap-2 text-sm">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <span>{s}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="border-red-200 dark:border-red-800/30">
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />Areas to Improve</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {MOCK_REPORT.weaknesses.map((w) => (
                            <div key={w} className="flex items-start gap-2 text-sm">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <span>{w}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* AI Summary */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />AI Summary</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{MOCK_REPORT.summary}</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Improvement Plan */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" />Improvement Plan</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {MOCK_REPORT.improvements.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                                <span className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                <span className="text-sm">{item}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}