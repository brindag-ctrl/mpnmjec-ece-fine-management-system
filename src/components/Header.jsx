import React from 'react';
import { 
  Menu, 
  Plus, 
  UserPlus 
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';

export const Header = ({ onOpenMobileMenu, onOpenAddFine, onOpenAddStudent }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Trigger & Department Titles */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 border border-slate-200 active:bg-slate-200 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <CollegeLogo size={38} className="shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug truncate">
                  M.P. Nachimuthu M. Jaganathan Engineering College
                </h2>
                <span className="hidden xl:inline-flex items-center text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-900 text-white uppercase tracking-wider">
                  Chennimalai
                </span>
              </div>
              <p className="text-xs text-red-700 font-bold tracking-wide mt-0.5 truncate">
                Department of Electronics and Communication Engineering (ECE)
              </p>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Add Student Button */}
          <button
            onClick={onOpenAddStudent}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 rounded-xl border border-slate-300 transition-all shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-800" />
            <span>Add Student</span>
          </button>

          {/* Prominent + Add Fine Button */}
          <button
            onClick={onOpenAddFine}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 rounded-xl shadow-md shadow-red-700/20 transition-all duration-150 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fine</span>
          </button>
        </div>
      </div>
    </header>
  );
};
