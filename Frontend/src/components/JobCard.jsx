import { Building2, MapPin, Clock, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * JobCard Component
 * High-end Emerald design with smooth transitions, 
 * logical grouping, and enhanced typography.
 */
function JobCard({ job }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(savedJobs.some(j => j.id === job.id));
  }, [job.id]);

  const toggleSave = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (isSaved) {
      const newSaved = savedJobs.filter(j => j.id !== job.id);
      localStorage.setItem('savedJobs', JSON.stringify(newSaved));
      setIsSaved(false);
    } else {
      savedJobs.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
    }
  };

  const getDaysAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Posted Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
      
      {/* Top Section: Title and Save Action */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
             <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
              {job.job_type}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2 font-medium">
            <Building2 className="w-4 h-4 mr-1.5" />
            <span className="text-sm">{job.company}</span>
          </div>
        </div>

        <button
          onClick={toggleSave}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isSaved 
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' 
            : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-emerald-500'
          }`}
        >
          {isSaved ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
        </button>
      </div>

      {/* Meta Info: Location and Date */}
      <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
        <div className="flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" />
          {job.work_mode}
        </div>
        <div className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {getDaysAgo(job.posted_date)}
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
        {job.description}
      </p>

      {/* Footer: Action Button */}
      <div className="mt-6 pt-5 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-400 italic">Verify listing before applying</span>
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-95"
        >
          Apply Now
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>

      {/* Decorative hover element */}
      <div className="absolute top-0 left-0 w-1 h-0 bg-emerald-500 group-hover:h-full transition-all duration-300 rounded-l-2xl" />
    </div>
  );
}

export default JobCard;