"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

interface DataPoint { month: string; score: number }

export function ScoreHistoryChart() {
  const { theme } = useTheme();
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/progress")
      .then((r) => r.json())
      .then((d) => setData(d.scoreHistory ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const gridColor = theme === "dark" ? "#1e293b" : "#f1f5f9";
  const textColor = theme === "dark" ? "#64748b" : "#94a3b8";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Score History</CardTitle>
        <CardDescription>Your overall interview score over time</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : data.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
            Complete interviews to see your score history
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: theme === "dark" ? "#0f172a" : "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 13 }}
                formatter={(v: unknown) => [`${v}/100`, "Score"]}
              />
              <Area type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={2.5} fill="url(#scoreGradient)" dot={{ fill: "#7C3AED", r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
