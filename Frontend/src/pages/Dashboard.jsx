import { useState, useEffect } from 'react';
import { getStats, getJobs } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import JobCard from '../components/JobCard';
import { Loader2, ArrowRight, Sparkles, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Dashboard Component
 * The main landing view, refined with emerald accents and 
 * professional data-visualization layout.
 */
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, jobsData] = await Promise.all([
          getStats(),
          getJobs(0, 6) 
        ]);
        setStats(statsData);
        setRecentJobs(jobsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <Database className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Synchronizing database...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Welcome Header */}
      <div className="relative overflow-hidden mb-10 p-8 rounded-3xl bg-emerald-600 dark:bg-emerald-700 shadow-2xl shadow-emerald-600/20 text-white">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-900/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">Live Insights</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Dashboard Overview</h1>
            <p className="text-emerald-50/80 mt-2 max-w-lg font-medium leading-relaxed">
              Your automated engine has indexed the latest fresher and internship opportunities across the web.
            </p>
          </div>
          <Link 
            to="/jobs" 
            className="group flex items-center justify-center px-6 py-3 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all active:scale-95"
          >
            Explore All Jobs
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <DashboardStats stats={stats} />

      {/* Recent Listings Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 flex items-center">
              Recent Listings
              <span className="ml-3 px-2 py-0.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-lg">
                New
              </span>
            </h2>
            <p className="text-emerald-500 dark:text-emerald-500 mt-1 font-medium">Hand-picked latest career opportunities</p>
          </div>
          
          <Link to="/jobs" className="flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
            View full directory
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        {recentJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
            <div className="inline-flex p-4 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 mb-4">
              <Database className="w-8 h-8" />
            </div>
            <p className="text-gray-900 dark:text-white font-bold text-lg mb-2">The database is currently empty.</p>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">Initiate a scrape to populate your dashboard with the most recent job data available.</p>
            <button 
               onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
               className="text-emerald-600 font-bold hover:underline"
            >
              Back to top to Scrape &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;