"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface SkillPoint { skill: string; score: number }

export function PerformanceRadar() {
  const [data, setData] = useState<SkillPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/progress")
      .then((r) => r.json())
      .then((d) => setData(d.skillRadar ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Skill Radar</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[220px] w-full rounded-full" />
        ) : data.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm text-center px-4">
            Complete interviews with evaluations to see your skill radar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={data}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Radar name="Score" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
