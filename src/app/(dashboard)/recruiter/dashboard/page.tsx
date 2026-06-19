import { RecruiterStatsCards } from "@/components/recruiter/stats-cards";
import { CandidatePipelineSummary } from "@/components/recruiter/pipeline-summary";
import { RecentAssessments } from "@/components/recruiter/recent-assessments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function RecruiterDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage assessments and track candidates</p>
                </div>
                <Link href="/recruiter/assessments/new">
                    <Button className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5">
                        <Plus className="h-4 w-4" />New Assessment
                    </Button>
                </Link>
            </div>
            <RecruiterStatsCards />
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><RecentAssessments /></div>
                <CandidatePipelineSummary />
            </div>
        </div>
    );
}