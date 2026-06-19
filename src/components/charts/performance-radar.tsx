"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const data = [
    { skill: "Technical", score: 80 },
    { skill: "Communication", score: 72 },
    { skill: "Problem Solving", score: 65 },
    { skill: "Confidence", score: 78 },
    { skill: "System Design", score: 55 },
    { skill: "DSA", score: 60 },
];

export function PerformanceRadar() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Skill Radar</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={data}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                        <Radar name="Score" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}