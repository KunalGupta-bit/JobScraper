import { useState, useEffect } from 'react';
import { filterJobs } from '../services/api';
import JobCard from '../components/JobCard';
import FilterPanel from '../components/FilterPanel';
import { Loader2, Briefcase, SearchX, Sparkles } from 'lucide-react';

/**
 * JobsList Component
 * Optimized for high-density data display with an Emerald professional theme.
 */
function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    job_type: '',
    work_mode: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const data = await filterJobs(activeFilters);
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const clearFilters = () => {
    setFilters({ keyword: '', job_type: '', work_mode: '' });
    // Using a functional state update or an effect would be cleaner, 
    // but for this flow, we trigger the fetch immediately after reset.
  };

  // Re-fetch when filters are explicitly cleared via the button
  useEffect(() => {
    if (filters.keyword === '' && filters.job_type === '' && filters.work_mode === '') {
      fetchJobs();
    }
  }, [filters.keyword, filters.job_type, filters.work_mode]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
              <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
              Opportunities
            </span>
          </div>
          <h1 className="text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight">
            Job Listings
          </h1>
          <p className="text-emerald-500 dark:text-emerald-500 mt-1 font-medium">
            Explore {jobs.length} curated roles matching your expertise.
          </p>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-sm font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-2xl">
          <Sparkles className="w-4 h-4" />
          <span>New jobs added daily</span>
        </div>
      </div>

      {/* Modern Filter Panel Wrapper */}
      <div className="relative z-20">
        <FilterPanel filters={filters} setFilters={setFilters} onSearch={fetchJobs} />
      </div>

      {/* Content Area */}
      <div className="mt-10">
        {loading ? (
          <div className="flex flex-col h-96 items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-100 dark:border-emerald-900/30 border-t-emerald-600 rounded-full animate-spin" />
            </div>
            <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">
              Filtering Results...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="inline-flex p-5 rounded-3xl bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 mb-6">
              <SearchX className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No matching opportunities</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
              We couldn't find any jobs matching your current search criteria. Try adjusting your keywords or filters.
            </p>
            <button 
              onClick={clearFilters}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, index) => (
              <div 
                key={job.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobsList;