import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stages = [
    { label: "Applied", count: 45, color: "bg-slate-400" },
    { label: "Scheduled", count: 23, color: "bg-blue-500" },
    { label: "Completed", count: 38, color: "bg-violet-500" },
    { label: "Shortlisted", count: 14, color: "bg-emerald-500" },
    { label: "Rejected", count: 18, color: "bg-red-400" },
    { label: "Hired", count: 7, color: "bg-amber-500" },
];

const total = stages.reduce((s, c) => s + c.count, 0);

export function CandidatePipelineSummary() {
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Candidate Pipeline</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                {stages.map((stage) => (
                    <div key={stage.label}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{stage.label}</span>
                            <span className="font-semibold">{stage.count}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", stage.color)} style={{ width: `${(stage.count / total) * 100}%` }} />
                        </div>
                    </div>
                ))}
                <div className="pt-2 border-t border-border flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Candidates</span>
                    <span className="font-bold">{total}</span>
                </div>
            </CardContent>
        </Card>
    );
}