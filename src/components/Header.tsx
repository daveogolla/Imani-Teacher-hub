import React from 'react';
import { Moon, Sun, Smartphone, Monitor, Search, User, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  isFrameView: boolean;
  onToggleFrameView: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  userProfile: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  themeMode,
  onToggleTheme,
  isFrameView,
  onToggleFrameView,
  onOpenSearch,
  onOpenProfile,
  userProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Zone: 1 Clean Line */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#008751] to-emerald-600 shadow-sm shadow-emerald-900/20 text-white font-black text-sm tracking-tight">
            CBC
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base">
                CBC HUB
              </span>
              <span className="hidden xs:inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/70 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                KENYA
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
              PP1 – Grade 12 & KCSE Revision
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex h-9 w-9 sm:w-auto sm:px-3 items-center justify-center gap-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Search Syllabus, Schemes & Ideas"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline text-xs font-medium text-slate-500 dark:text-slate-400">Search topics...</span>
          </button>

          {/* Device Frame View Toggle (Phone Simulation vs Desktop Canvas) */}
          <button
            onClick={onToggleFrameView}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title={isFrameView ? "Switch to Fullscreen Desktop View" : "Switch to Android Mobile Device Frame"}
            aria-label="Toggle frame preview"
          >
            {isFrameView ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          {/* Teacher Profile / Sign-in */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            title="Teacher Profile & Account"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
              {userProfile.teacherName ? userProfile.teacherName.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {userProfile.teacherName || 'Mwalimu'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                {userProfile.tscNumber || 'TSC Reg.'}
              </span>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
