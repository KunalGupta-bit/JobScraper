import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Terminal, Sparkles } from 'lucide-react';

/**
 * Sidebar Component
 * Refined with Emerald branding, active route indicators, 
 * and a professional dark-mode optimized layout.
 */
function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 hidden md:block">
      <div className="flex h-full flex-col">
        
        {/* Brand Logo Section */}
        <div className="flex items-center px-6 h-16 mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg shadow-lg shadow-emerald-600/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Job<span className="text-emerald-600">Scraper</span>
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>
          
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink to="/jobs" icon={Briefcase} label="Job Listings" />
        </nav>

        {/* Pro/Upgrade Teaser (Optional Professional Touch) */}
        <div className="p-4 m-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Pro Features</span>
          </div>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
            Unlock advanced filters and automated daily exports.
          </p>
        </div>
      </div>
    </aside>
  );
}

/**
 * Helper component for Sidebar Links
 */
function SidebarLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
          isActive
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-emerald-600'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-emerald-600' : 'group-hover:text-emerald-500'}`} />
          <span className="text-sm tracking-wide">{label}</span>
          
          {/* Active Indicator Pill */}
          {isActive && (
            <div className="absolute left-0 w-1 h-6 bg-emerald-600 rounded-r-full" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default Sidebar;