"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LiveReportView, LiveReportData } from "@/components/interview/live-report-view";
import { Loader2 } from "lucide-react";

export default function LiveReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<LiveReportData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`live_report_${id}`);
    if (stored) setData(JSON.parse(stored));
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Loading your report…</p>
      </div>
    );
  }

  return <LiveReportView data={data} />;
}
