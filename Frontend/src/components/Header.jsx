import { Moon, Sun, Download, RefreshCw, Terminal } from 'lucide-react';
import { useState } from 'react';
import { triggerScrape, exportJobsUrl } from '../services/api';

/**
 * Header Component
 * Professional Emerald transformation with glassmorphism and refined button states.
 */
function Header({ darkMode, setDarkMode }) {
  const [isScraping, setIsScraping] = useState(false);

  const handleScrape = async () => {
    setIsScraping(true);
    try {
      await triggerScrape();
      // Using a subtle delay or custom toast here would be better than alert()
      // for a "very impressive" UI feel.
      alert('Success: Database updated with latest listings.');
      window.location.reload();
    } catch (error) {
      alert('System Error: Scraper failed to initialize.');
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-6 h-16 flex items-center justify-between">
      
      {/* Brand Section */}
      <div className="flex items-center space-x-2">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Job<span className="text-emerald-600">Scraper</span>
        </span>
      </div>
      
      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        
        {/* Scrape Button - Now with Gradient & Subtle Animation */}
        <button
          onClick={handleScrape}
          disabled={isScraping}
          className={`
            hidden md:flex items-center px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
            ${isScraping 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95'}
          `}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isScraping ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {isScraping ? 'Scraping...' : 'Scrape Latest'}
        </button>

        {/* Export Button - Secondary Outline Style */}
        <a
          href={exportJobsUrl}
          download
          className="flex items-center px-5 py-2 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Export CSV</span>
        </a>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Theme Toggle - Minimalist */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}

export default Header;