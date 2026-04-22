import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

/**
 * FilterPanel Component
 * Refined with a professional Emerald theme, custom focus states, 
 * and a streamlined layout.
 */
function FilterPanel({ filters, setFilters, onSearch }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      job_type: '',
      work_mode: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const selectStyles = "block w-full pl-3 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer";

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-5 items-end">
        
        {/* Keyword Search */}
        <div className="flex-1 w-full">
          <label htmlFor="keyword" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">
            Search Keywords
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-emerald-500 transition-colors group-focus-within:text-emerald-400" />
            </div>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Design, Engineering, React..."
              className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Dropdowns Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:w-auto">
          <div className="w-full md:w-44">
            <label htmlFor="job_type" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Job Type
            </label>
            <div className="relative">
              <select
                id="job_type"
                name="job_type"
                value={filters.job_type}
                onChange={handleChange}
                className={selectStyles}
              >
                <option value="">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <SlidersHorizontal className="h-3 w-3" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-44">
            <label htmlFor="work_mode" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Work Mode
            </label>
            <div className="relative">
              <select
                id="work_mode"
                name="work_mode"
                value={filters.work_mode}
                onChange={handleChange}
                className={selectStyles}
              >
                <option value="">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <SlidersHorizontal className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800"
            title="Reset Filters"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          
          <button
            type="submit"
            className="flex-1 lg:flex-none px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/40 text-sm active:scale-95"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default FilterPanel;