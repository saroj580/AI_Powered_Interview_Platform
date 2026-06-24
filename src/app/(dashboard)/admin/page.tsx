'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Activity, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Platform metrics and system health
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value="12,543"
              change="+245 this week"
              icon={<Users className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              label="Monthly Revenue"
              value="$89,456"
              change="+12% vs last month"
              icon={<TrendingUp className="w-5 h-5" />}
              color="green"
            />
            <StatCard
              label="Active Candidates"
              value="4,892"
              change="39% of total users"
              icon={<Activity className="w-5 h-5" />}
              color="purple"
            />
            <StatCard
              label="System Health"
              value="98.9%"
              change="↑ All systems operational"
              icon={<AlertCircle className="w-5 h-5" />}
              color="amber"
            />
          </div>

          {/* User Growth */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              User Growth
            </h2>
            <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
              <p className="text-slate-600 dark:text-slate-400">Chart placeholder</p>
            </div>
          </Card>

          {/* Subscription Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Subscription Status
              </h2>
              <div className="space-y-4">
                {[
                  { plan: 'Free', count: 8234, revenue: '$0' },
                  { plan: 'Pro', count: 2456, revenue: '$61,400' },
                  { plan: 'Enterprise', count: 123, revenue: '$28,056' },
                ].map((sub) => (
                  <div key={sub.plan} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{sub.plan}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{sub.count} users</p>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{sub.revenue}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                System Status
              </h2>
              <div className="space-y-4">
                {[
                  { service: 'API Server', status: 'Operational' },
                  { service: 'Database', status: 'Operational' },
                  { service: 'File Storage', status: 'Operational' },
                  { service: 'Cache', status: 'Operational' },
                ].map((item) => (
                  <div key={item.service} className="flex items-center justify-between">
                    <p className="text-slate-900 dark:text-white">{item.service}</p>
                    <Badge
                      className="bg-green-600 hover:bg-green-700"
                      variant="default"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                { action: 'New user signup', user: 'john.doe@example.com', time: '5 minutes ago' },
                { action: 'Subscription created', user: 'sarah.smith@acme.com', time: '12 minutes ago' },
                { action: 'Assessment completed', user: 'mike.chen@tech.com', time: '1 hour ago' },
                { action: 'Organization created', user: 'acme-corp-admin', time: '3 hours ago' },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activity.user}</p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{activity.time}</p>
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
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

function StatCard({ label, value, change, icon, color }: StatCardProps) {
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
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{change}</p>
    </Card>
  );
}
