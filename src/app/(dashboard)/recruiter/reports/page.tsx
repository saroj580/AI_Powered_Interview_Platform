"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Users, ClipboardList, Award } from "lucide-react";

interface MonthlyData { month: string; candidates: number; completed: number; avg: number; }
interface RoleBreakdown { role: string; candidates: number; hired: number; avgScore: number; }
interface ReportData { monthlyData: MonthlyData[]; roleBreakdown: RoleBreakdown[]; stageCounts: Record<string, number>; }

export default function RecruiterReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recruiter/reports")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalCandidates = data ? Object.values(data.stageCounts).reduce((a, b) => a + b, 0) : 0;
  const hired = data?.stageCounts?.HIRED ?? 0;
  const completed = data?.stageCounts?.INTERVIEW_COMPLETED ?? 0;
  const avgScore = data?.monthlyData
    ? (() => { const s = data.monthlyData.filter((m) => m.avg > 0); return s.length ? Math.round(s.reduce((a, m) => a + m.avg, 0) / s.length) : 0; })()
    : 0;

  const summaryCards = [
    { label: "Total Candidates", value: totalCandidates, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Hired", value: hired, icon: Award, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Avg Score", value: avgScore || "—", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Completed", value: completed, icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Hiring analytics and candidate performance trends</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s) => (
          <Card key={s.label}><CardContent className="p-5">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
              <s.icon className={`h-4.5 w-4.5 ${s.color}`} />
            </div>
            {loading ? <Skeleton className="h-8 w-16 mb-1" /> : <p className="text-2xl font-extrabold">{s.value}</p>}
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly candidates chart */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Candidates per Month</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-48 w-full" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.monthlyData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="candidates" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Invited" />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Avg score trend */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Average Score Trend</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-48 w-full" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data?.monthlyData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Avg Score" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role breakdown */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">By Target Role</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0">
                <Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-20" />
              </div>
            ))
          ) : !data?.roleBreakdown?.length ? (
            <p className="text-sm text-muted-foreground px-5 py-8 text-center">No data yet</p>
          ) : (
            <div className="divide-y divide-border">
              {data.roleBreakdown.map((r) => (
                <div key={r.role} className="flex items-center gap-4 px-5 py-3.5 text-sm">
                  <p className="flex-1 font-medium truncate">{r.role}</p>
                  <span className="text-muted-foreground text-xs w-24 text-right">{r.candidates} invited</span>
                  <span className="text-emerald-600 font-semibold text-xs w-16 text-right">{r.hired} hired</span>
                  <span className="text-amber-600 font-semibold text-xs w-16 text-right">{r.avgScore || "—"} avg</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
