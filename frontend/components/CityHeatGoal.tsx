'use client'

import React, { useState, useEffect } from 'react';
import { Target, Leaf, TrendingDown, Thermometer, ShieldCheck } from 'lucide-react';

export const CityHeatGoal = () => {
  const [progress, setProgress] = useState(15);
  const target = 5.0; // 5 degrees reduction target
  const current = 0.8; // 0.8 degrees achieved

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => setProgress(32), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-white rounded-[32px] p-8 border border-slate-200/50 shadow-premium hover:shadow-xl transition-all group overflow-hidden relative">
      {/* Decorative Background Element */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-slate-200 text-white shrink-0">
            <Target className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5 focus:outline-none">Strategic Mitigation Goal</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-slate-900 tracking-tight">−{current}°C</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target: −{target}°C</span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-end justify-between text-[11px] font-bold uppercase tracking-[0.15em] mb-1">
            <span className="text-slate-900">Aggregate Progress</span>
            <span className="text-emerald-600 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> {progress}% Validated
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0">
            <div 
              className="h-full bg-slate-900 rounded-full transition-all duration-[1500ms] ease-out relative"
              style={{ width: `${progress}%` }}
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
               <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-slate-900" />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex gap-6 shrink-0">
           <div className="px-6 py-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-100/50">
                 <Thermometer className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Critical Hotspots</p>
                 <p className="font-bold text-slate-900 text-sm">12 Active Zones</p>
              </div>
           </div>
           <div className="px-6 py-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100/50">
                 <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Impact Velocity</p>
                 <p className="font-bold text-slate-900 text-sm">1.2% Gain / Mo</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

