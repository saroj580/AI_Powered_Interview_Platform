"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getScoreColor } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

interface Interview {
  id: string;
  title: string;
  type: string;
  score: number | null;
  createdAt: string;
  durationMinutes: number;
  status: string;
}

export function InterviewHistoryTable() {
  const [rows, setRows] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/interviews?limit=20")
      .then((r) => r.json())
      .then((d) => setRows(Array.isArray(d) ? d.filter((i: Interview) => i.status === "COMPLETED") : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base">Interview History</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No completed interviews yet.</p>
        ) : (
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
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4 font-medium">
                      <Link href={`/candidate/interviews/${row.id}/report`} className="hover:text-primary transition-colors">
                        {row.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4"><Badge variant="secondary" className="text-[10px]">{row.type}</Badge></td>
                    <td className="py-3 pr-4 text-muted-foreground">{format(new Date(row.createdAt), "MMM d, yyyy")}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.durationMinutes}m</td>
                    <td className={`py-3 text-right font-bold ${row.score !== null ? getScoreColor(row.score) : "text-muted-foreground"}`}>
                      {row.score ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
