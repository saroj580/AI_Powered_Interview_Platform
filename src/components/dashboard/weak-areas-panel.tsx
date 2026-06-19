import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getScoreColor } from "@/lib/utils";

const areas = [
    { name: "System Design", score: 55 },
    { name: "Data Structures", score: 60 },
    { name: "Algorithms", score: 63 },
    { name: "Communication", score: 72 },
    { name: "React Advanced", score: 80 },
];

export function WeakAreasPanel() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Skill Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {areas.map((area) => (
                    <div key={area.name}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">{area.name}</span>
                            <span className={`text-sm font-bold ${getScoreColor(area.score)}`}>{area.score}</span>
                        </div>
                        <Progress value={area.score} className="h-1.5" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}