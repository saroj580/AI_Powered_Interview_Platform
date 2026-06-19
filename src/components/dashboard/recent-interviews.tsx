import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { getScoreColor } from "@/lib/utils";

const interviews = [
    { id: "1", title: "Senior React Developer", type: "Technical", score: 84, duration: "42 min", date: "2 days ago", status: "COMPLETED" },
    { id: "2", title: "Full Stack Node.js", type: "Mixed", score: 71, duration: "38 min", date: "5 days ago", status: "COMPLETED" },
    { id: "3", title: "System Design Interview", type: "Technical", score: 62, duration: "55 min", date: "1 week ago", status: "COMPLETED" },
    { id: "4", title: "Behavioral Interview", type: "Behavioral", score: 88, duration: "28 min", date: "2 weeks ago", status: "COMPLETED" },
];

export function RecentInterviews() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                    <CardTitle className="text-base">Recent Interviews</CardTitle>
                    <CardDescription>Your last 4 sessions</CardDescription>
                </div>
                <Link href="/candidate/interviews">
                    <Button variant="ghost" size="sm" className="text-primary text-xs gap-1">
                        View all <ChevronRight className="h-3 w-3" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="divide-y divide-border">
                {interviews.map((interview) => (
                    <Link key={interview.id} href={`/candidate/interviews/${interview.id}/report`}>
                        <div className="flex items-center gap-4 py-3.5 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Video className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{interview.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{interview.type}</Badge>
                                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                                        <Clock className="h-3 w-3" />{interview.duration}
                                    </span>
                                    <span className="text-muted-foreground text-xs">{interview.date}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-xl font-bold ${getScoreColor(interview.score)}`}>{interview.score}</span>
                                <p className="text-muted-foreground text-xs">/100</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}