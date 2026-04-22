import React from 'react';
import { Briefcase, MapPin, Users, ArrowUpRight } from 'lucide-react';

/**
 * DashboardStats Component
 * Enhanced with a professional Emerald theme, glassmorphism effects, 
 * and subtle micro-interactions.
 */
function DashboardStats({ stats }) {
  if (!stats) return null;

  const statConfig = [
    {
      label: 'Total Jobs',
      value: stats.total_jobs,
      icon: Briefcase,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      trend: '+12% this month'
    },
    {
      label: 'Internships',
      value: stats.internships_count,
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      trend: 'Active Now'
    },
    {
      label: 'Remote Jobs',
      value: stats.remote_jobs_count,
      icon: MapPin,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/40',
      trend: 'Global'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {statConfig.map((item, index) => (
        <div 
          key={index}
          className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100 dark:border-gray-800"
        >
          {/* Subtle Decorative Background Gradient */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-4">
              <div className={`p-3 w-fit rounded-xl ${item.bgColor} ${item.color} shadow-sm ring-1 ring-inset ring-black/5`}>
                <item.icon className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {item.label}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {item.value?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Right "Action" or Trend Indicator */}
            <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {item.trend}
            </div>
          </div>

          {/* Bottom highlight bar */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-emerald-500 transition-all duration-500 group-hover:w-full" />
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;