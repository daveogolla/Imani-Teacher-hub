import React from 'react';
import { LayoutDashboard, Search, FileSpreadsheet, Library, Lightbulb, CalendarDays } from 'lucide-react';

export type NavTab = 'dashboard' | 'search' | 'generator' | 'syllabus' | 'ideas' | 'calendar';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
    { id: 'search' as NavTab, label: 'Search', icon: Search },
    { id: 'generator' as NavTab, label: 'Generator', icon: FileSpreadsheet },
    { id: 'syllabus' as NavTab, label: 'Syllabus', icon: Library },
    { id: 'ideas' as NavTab, label: 'Ideas', icon: Lightbulb },
    { id: 'calendar' as NavTab, label: 'Calendar', icon: CalendarDays },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-xl items-center justify-around px-1 pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex min-h-[44px] min-w-[48px] sm:min-w-[56px] flex-col items-center justify-center rounded-2xl py-1 transition-all ${
                isActive
                  ? 'text-[#008751] dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 h-0.5 w-6 rounded-full bg-[#008751] dark:bg-emerald-400" />
              )}
              <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] sm:text-[11px] tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
