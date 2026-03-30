'use client'

import React, { useEffect, useState } from 'react';
import { getRecentAnalyses } from '@/lib/offlineStore';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Clock, MapPin, ChevronRight, Wind, History, Search } from 'lucide-react';

interface RecentAnalysesProps {
  onSelect: (analysis: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ onSelect, isOpen, onClose }) => {
  const [analyses, setAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadAnalyses();
    }
  }, [isOpen]);

  const loadAnalyses = async () => {
    const data = await getRecentAnalyses(10);
    setAnalyses(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-premium p-8 overflow-y-auto animate-in slide-in-from-right-full duration-500"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
                <History className="w-5 h-5 text-white" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Scans</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-slate-50 text-slate-400">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Search Mockup for realism */}
        <div className="relative mb-8">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search past reports..." 
             className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
           />
        </div>

        <div className="space-y-6">
          {analyses.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                 <MapPin className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900">No Historical Data</p>
                <p className="text-xs text-slate-400 max-w-[200px]">Perform a region scan to populate your historical archive.</p>
              </div>
            </div>
          ) : (
            analyses.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-base leading-none tracking-tight">
                        {item.location_name || `Area Scan #40${idx + 1}`}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    item.avg_heat_index > 0.7 ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    item.avg_heat_index > 0.4 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {Math.round(item.avg_heat_index * 100)}% Index
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-slate-50 relative z-10">
                  <div className="flex-1">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Vegetation</div>
                    <div className="text-sm font-bold text-slate-900">{(item.avg_vegetation_index * 100).toFixed(0)}% <span className="text-[10px] font-medium text-slate-400 ml-0.5">Density</span></div>
                  </div>
                  <div className="w-px h-8 bg-slate-100 self-center" />
                  <div className="flex-1">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Thermal Avg</div>
                    <div className="text-sm font-bold text-slate-900">{item.avg_temp}°C <span className="text-[10px] font-medium text-slate-400 ml-0.5">Peak</span></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl" />
           <div className="flex items-center gap-3 text-emerald-400 mb-2.5">
             <Wind className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Deployment Tip</span>
           </div>
           <p className="text-xs text-slate-400 leading-relaxed font-medium">
             Analysis results are synchronized with your local browser storage, enabling ultra-fast retrieval and offline auditing of historical heat maps.
           </p>
        </div>
      </div>
    </div>
  );
};

