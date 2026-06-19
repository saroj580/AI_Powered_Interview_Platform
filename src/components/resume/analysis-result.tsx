"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, Zap } from "lucide-react";

const MOCK_RESULT = {
    atsScore: 82,
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "Redis"],
    strengths: ["Strong project descriptions with measurable outcomes", "Relevant tech stack for target roles", "Clear career progression shown"],
    improvements: ["Add more quantified achievements", "Include system design experience", "Add open source contributions"],
    suggestedRoles: ["Senior Frontend Developer", "Full Stack Engineer", "React Tech Lead"],
};

export function ResumeAnalysisResult() {
    return (
        <div className="space-y-4">
            {/* ATS Score */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-gradient-card border-primary/20">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-5xl font-black text-primary">{MOCK_RESULT.atsScore}</div>
                            <p className="text-muted-foreground text-sm mt-1">ATS Score</p>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1.5"><span>0</span><span>100</span></div>
                            <Progress value={MOCK_RESULT.atsScore} className="h-3" />
                            <p className="text-sm text-muted-foreground mt-2">Your resume scores <span className="text-emerald-600 font-semibold">higher than 78%</span> of candidates for senior roles.</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Skills */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-base">Detected Skills</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {MOCK_RESULT.skills.map((s) => (
                                    <Badge key={s} variant="secondary" className="bg-primary/8 text-primary border-primary/20">{s}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Suggested Roles */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-base">Target Roles</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {MOCK_RESULT.suggestedRoles.map((role) => (
                                <div key={role} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
                                    <span className="text-sm font-medium">{role}</span>
                                    <Badge className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">Good Fit</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Generate Interview from Resume */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/20">
                    <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Resume-Based Interview</p>
                                <p className="text-muted-foreground text-xs">AI generates questions from your actual experience</p>
                            </div>
                        </div>
                        <Button className="bg-gradient-primary text-white border-0 hover:opacity-90 shrink-0 gap-1.5">
                            <Zap className="h-4 w-4" />Generate Interview
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}