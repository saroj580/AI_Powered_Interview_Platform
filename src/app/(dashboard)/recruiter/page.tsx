'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart3, CheckCircle2, Clock } from 'lucide-react';

export default function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Recruiter Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Manage assessments and evaluate candidates
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Active Assessments"
              value="8"
              icon={<BarChart3 className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              label="Pending Evaluations"
              value="5"
              icon={<Clock className="w-5 h-5" />}
              color="amber"
            />
            <StatCard
              label="Completed This Week"
              value="23"
              icon={<CheckCircle2 className="w-5 h-5" />}
              color="green"
            />
            <StatCard
              label="Average Time"
              value="18m"
              icon={<Clock className="w-5 h-5" />}
              color="purple"
            />
          </div>

          {/* Candidates Pipeline */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Candidate Pipeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { stage: 'Applied', count: 24, color: 'bg-blue-50 dark:bg-blue-900/20' },
                { stage: 'Screening', count: 12, color: 'bg-amber-50 dark:bg-amber-900/20' },
                { stage: 'Interview', count: 8, color: 'bg-purple-50 dark:bg-purple-900/20' },
                { stage: 'Offer', count: 3, color: 'bg-green-50 dark:bg-green-900/20' },
              ].map((stage) => (
                <div
                  key={stage.stage}
                  className={`p-4 rounded-lg border border-slate-200 dark:border-slate-700 ${stage.color}`}
                >
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {stage.stage}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stage.count}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Evaluations */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Pending Evaluations
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Frontend Developer',
                  submittedDate: '2 hours ago',
                  score: null,
                },
                {
                  name: 'Mike Chen',
                  role: 'Backend Engineer',
                  submittedDate: '5 hours ago',
                  score: null,
                },
                {
                  name: 'Emma Davis',
                  role: 'Full Stack Developer',
                  submittedDate: '1 day ago',
                  score: null,
                },
              ].map((candidate, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{candidate.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {candidate.role} • {candidate.submittedDate}
                    </p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">Evaluate</Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Assessments */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Your Assessments
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Frontend Engineering Internship',
                  candidates: 12,
                  completion: 75,
                },
                {
                  title: 'Backend Senior Engineer',
                  candidates: 8,
                  completion: 100,
                },
                {
                  title: 'Full Stack Developer',
                  candidates: 15,
                  completion: 53,
                },
              ].map((assessment, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {assessment.title}
                    </h3>
                    <Badge variant="secondary">{assessment.candidates} candidates</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mr-3">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${assessment.completion}%` }}
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {assessment.completion}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </Card>
  );
}
