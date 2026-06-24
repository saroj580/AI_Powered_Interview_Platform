"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getScoreColor } from "@/lib/utils";

interface SkillPoint { skill: string; score: number }

export function WeakAreasPanel() {
  const [skills, setSkills] = useState<SkillPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/progress")
      .then((r) => r.json())
      .then((d) => {
        const radar: SkillPoint[] = d.skillRadar ?? [];
        setSkills([...radar].sort((a, b) => a.score - b.score));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
        ) : skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skill data yet. Complete interviews to see your breakdown.</p>
        ) : (
          skills.map((s) => (
            <div key={s.skill}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">{s.skill}</span>
                <span className={`text-sm font-bold ${getScoreColor(s.score)}`}>{s.score}</span>
              </div>
              <Progress value={s.score} className="h-1.5" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
