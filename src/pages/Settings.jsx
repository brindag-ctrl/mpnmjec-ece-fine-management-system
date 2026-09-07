import React from 'react';
import { Building2 } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-5 pb-12 max-w-4xl">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
          System Configuration
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
          Department Information
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Connected live to Cloud Firestore Database & Firebase Authentication. All student records are automatically synced with Firebase.
        </p>
      </div>

      {/* College & Department Profile */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-red-700" />
          <h3 className="text-sm font-bold text-slate-900">Institution Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
          <div>
            <p className="text-slate-500">Institution Name</p>
            <p className="font-bold text-slate-900 mt-0.5">M.P. Nachimuthu M. Jaganathan Engineering College</p>
          </div>
          <div>
            <p className="text-slate-500">Department</p>
            <p className="font-bold text-red-700 mt-0.5">Electronics and Communication Engineering (ECE)</p>
          </div>
          <div>
            <p className="text-slate-500">Location</p>
            <p className="font-semibold text-slate-700 mt-0.5">Chennimalai, Erode - 638 112</p>
          </div>
          <div>
            <p className="text-slate-500">Academic Batches</p>
            <p className="font-semibold text-slate-700 mt-0.5">2nd, 3rd & 4th Year ECE (121 Students Total)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
