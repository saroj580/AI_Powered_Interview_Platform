'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  MessageSquare,
  BookOpen,
  Zap,
  BarChart3,
  Code,
  FileText,
  Play,
} from 'lucide-react';

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {greeting}, John 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                Ready for your next interview? Let's practice.
              </p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
              <Button size="lg" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="ATS Score"
              value="78"
              unit="/100"
              change="+5"
              icon={<TrendingUp className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              label="Interviews"
              value="12"
              unit="completed"
              change="This month"
              icon={<MessageSquare className="w-5 h-5" />}
              color="green"
            />
            <StatCard
              label="Avg Score"
              value="72"
              unit="/100"
              change="↑ 8 points"
              icon={<BarChart3 className="w-5 h-5" />}
              color="purple"
            />
            <StatCard
              label="Streak"
              value="7"
              unit="days"
              change="🔥 Keep going"
              icon={<Zap className="w-5 h-5" />}
              color="amber"
            />
          </div>

          {/* Interview Readiness & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Readiness Score */}
            <Card className="lg:col-span-1 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Interview Readiness
              </h2>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-32 h-32">
                  <svg
                    className="transform -rotate-90 w-full h-full"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-blue-600 dark:text-blue-400"
                      strokeDasharray={`${(72 / 100) * 339.3} 339.3`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">72%</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Readiness</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Technical</span>
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Communication</span>
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Problem Solving</span>
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Behavioral Interview',
                    type: 'Interview',
                    score: '78/100',
                    date: '2 days ago',
                    icon: MessageSquare,
                  },
                  {
                    title: 'System Design Coding Round',
                    type: 'Coding',
                    score: '85/100',
                    date: '4 days ago',
                    icon: Code,
                  },
                  {
                    title: 'Resume Analysis',
                    type: 'ATS',
                    score: '78/100',
                    date: '1 week ago',
                    icon: FileText,
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{item.date}</p>
                        </div>
                      </div>
                      <Badge variant="default">{item.score}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              AI-Powered Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'System Design Concepts',
                  reason: 'Low performance (45%)',
                  action: 'Practice',
                },
                {
                  title: 'SQL Query Optimization',
                  reason: '3 failed attempts last week',
                  action: 'Learn',
                },
                {
                  title: 'Behavioral Questions',
                  reason: 'Communication score at 72%',
                  action: 'Practice',
                },
              ].map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{rec.reason}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {rec.action}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Roadmap Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                This Week's Goals
              </h2>
              <Button variant="ghost" size="sm">
                View Full Roadmap
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Learn Docker Basics', progress: 60 },
                { title: 'Practice System Design', progress: 40 },
                { title: 'Code 3 LeetCode Problems', progress: 100 },
              ].map((goal, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900 dark:text-white">{goal.title}</p>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
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
  unit: string;
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

function StatCard({ label, value, unit, change, icon, color }: StatCardProps) {
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
      <div className="space-y-1">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
          <span className="text-lg text-slate-600 dark:text-slate-400 ml-1">{unit}</span>
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{change}</p>
      </div>
    </Card>
  );
}
