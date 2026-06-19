import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getScoreColor } from "@/lib/utils";

const history = [
    { id: "1", title: "Senior React Developer", type: "Technical", score: 84, date: "Feb 14, 2025", duration: "42 min" },
    { id: "2", title: "System Design Interview", type: "Technical", score: 62, date: "Feb 9, 2025", duration: "55 min" },
    { id: "3", title: "Node.js Full Stack", type: "Mixed", score: 71, date: "Feb 5, 2025", duration: "38 min" },
    { id: "4", title: "Behavioral Round", type: "Behavioral", score: 88, date: "Jan 30, 2025", duration: "28 min" },
    { id: "5", title: "Java Developer", type: "Technical", score: 77, date: "Jan 24, 2025", duration: "45 min" },
];

export function InterviewHistoryTable() {
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Interview History</CardTitle></CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-muted-foreground text-xs">
                                <th className="text-left font-medium py-2.5 pr-4">Title</th>
                                <th className="text-left font-medium py-2.5 pr-4">Type</th>
                                <th className="text-left font-medium py-2.5 pr-4">Date</th>
                                <th className="text-left font-medium py-2.5 pr-4">Duration</th>
                                <th className="text-right font-medium py-2.5">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {history.map((row) => (
                                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-3 pr-4 font-medium">{row.title}</td>
                                    <td className="py-3 pr-4"><Badge variant="secondary" className="text-[10px]">{row.type}</Badge></td>
                                    <td className="py-3 pr-4 text-muted-foreground">{row.date}</td>
                                    <td className="py-3 pr-4 text-muted-foreground">{row.duration}</td>
                                    <td className={`py-3 text-right font-bold ${getScoreColor(row.score)}`}>{row.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}