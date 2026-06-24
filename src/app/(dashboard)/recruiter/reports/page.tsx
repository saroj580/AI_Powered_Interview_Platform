"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Users, ClipboardList, Award } from "lucide-react";

const monthlyData = [
    { month: "Jan", candidates: 12, completed: 9 },
    { month: "Feb", candidates: 18, completed: 14 },
    { month: "Mar", candidates: 24, completed: 20 },
    { month: "Apr", candidates: 16, completed: 12 },
    { month: "May", candidates: 30, completed: 26 },
    { month: "Jun", candidates: 22, completed: 18 },
];

const scoreData = [
    { month: "Jan", avg: 72 },
    { month: "Feb", avg: 74 },
    { month: "Mar", avg: 78 },
    { month: "Apr", avg: 76 },
    { month: "May", avg: 82 },
    { month: "Jun", avg: 80 },
];

const roleBreakdown = [
    { role: "Frontend Developer", candidates: 28, hired: 5, avgScore: 79 },
    { role: "Backend Engineer", candidates: 22, hired: 4, avgScore: 81 },
    { role: "Full Stack Developer", candidates: 18, hired: 3, avgScore: 76 },
    { role: "DevOps Engineer", candidates: 10, hired: 2, avgScore: 84 },
    { role: "Mobile Developer", candidates: 8, hired: 1, avgScore: 71 },
];

export default function RecruiterReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground text-sm mt-1">Hiring funnel insights and candidate performance</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Candidates", value: "86", change: "+12%", up: true, icon: Users },
                    { label: "Assessments Sent", value: "124", change: "+8%", up: true, icon: ClipboardList },
                    { label: "Avg Score", value: "80%", change: "+4pts", up: true, icon: Award },
                    { label: "Hire Rate", value: "17%", change: "-2%", up: false, icon: TrendingUp },
                ].map((kpi) => (
                    <Card key={kpi.label}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                                    <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                                        {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {kpi.change}
                                    </div>
                                </div>
                                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <kpi.icon className="h-4 w-4 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="text-base">Monthly Candidates</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="candidates" name="Invited" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="completed" name="Completed" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Avg Score Trend</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={scoreData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="avg" name="Avg Score" stroke="#7C3AED" strokeWidth={2} dot={{ fill: "#7C3AED", r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Role Breakdown */}
            <Card>
                <CardHeader><CardTitle className="text-base">Breakdown by Role</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {roleBreakdown.map((r) => (
                            <div key={r.role}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium">{r.role}</span>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary">{r.candidates} candidates</Badge>
                                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">{r.hired} hired</Badge>
                                        <span className="text-sm font-bold text-primary">{r.avgScore}%</span>
                                    </div>
                                </div>
                                <Progress value={(r.hired / r.candidates) * 100} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">{Math.round((r.hired / r.candidates) * 100)}% hire rate</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
