import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

const assessments = [
    { id: "1", title: "Senior React Developer", role: "Frontend", difficulty: "HARD", invites: 24, completed: 18, active: true },
    { id: "2", title: "Backend Node.js Engineer", role: "Backend", difficulty: "MEDIUM", invites: 31, completed: 25, active: true },
    { id: "3", title: "Full Stack TypeScript", role: "Full Stack", difficulty: "MEDIUM", invites: 15, completed: 12, active: false },
    { id: "4", title: "DevOps Engineer", role: "DevOps", difficulty: "HARD", invites: 8, completed: 5, active: true },
];

export function RecentAssessments() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                    <CardTitle className="text-base">Recent Assessments</CardTitle>
                    <CardDescription>Your active interview campaigns</CardDescription>
                </div>
                <Link href="/recruiter/assessments">
                    <Button variant="ghost" size="sm" className="text-primary text-xs gap-1">View all <ChevronRight className="h-3 w-3" /></Button>
                </Link>
            </CardHeader>
            <CardContent className="divide-y divide-border">
                {assessments.map((a) => (
                    <Link key={a.id} href={`/recruiter/assessments/${a.id}`}>
                        <div className="flex items-center gap-4 py-3.5 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <ClipboardList className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{a.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{a.role}</Badge>
                                    <span className="text-muted-foreground text-xs flex items-center gap-1"><Users className="h-3 w-3" />{a.invites} invited</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold">{a.completed}/{a.invites}</p>
                                <p className="text-xs text-muted-foreground">completed</p>
                            </div>
                            <Badge className={a.active ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30" : "bg-muted text-muted-foreground"}>
                                {a.active ? "Active" : "Closed"}
                            </Badge>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}