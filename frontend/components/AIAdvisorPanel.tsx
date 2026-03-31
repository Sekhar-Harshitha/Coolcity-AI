'use client'

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  TrendingDown, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  BarChart3,
  Lightbulb,
  Activity,
  ChevronRight
} from 'lucide-react';

interface AIAdvisorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  simulationResults?: any;
}

export const AIAdvisorPanel: React.FC<AIAdvisorPanelProps> = ({ isOpen, onClose, simulationResults }) => {
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      const timer = setTimeout(() => setIsScanning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center md:items-center md:justify-right p-4 md:p-8 pointer-events-none">
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className={`
        relative w-full max-w-md bg-white shadow-premium
        rounded-[32px] overflow-hidden pointer-events-auto transition-all duration-500 transform
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 md:translate-x-full'}
        border border-slate-200/60 flex flex-col max-h-[90dvh]
      `}>
        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-100 relative">
          <div className="absolute top-8 right-8">
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Strategy Advisor</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Neural Model v4.2.0
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
          {isScanning ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-6">
              <div className="relative">
                 <div className="absolute inset-0 bg-[var(--lavender-500)]/20 blur-3xl rounded-full" />
                 <div className="w-16 h-16 border-4 border-slate-100 border-t-[var(--lavender-500)] rounded-full animate-spin relative" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-lg">Synthesizing Models</h4>
                <p className="text-sm font-medium text-slate-500 max-w-[240px]">Processing thermal anomalies & local spatial constraints...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Critical Insight */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0 border border-emerald-100/50">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-emerald-900 leading-tight">Optimization Peak</h4>
                  <p className="text-sm font-medium text-emerald-700/80 leading-relaxed">
                    Transitioning to <strong>Cool Albedo Surfaces</strong> in the CBD core shows 32% faster heat dissipation than current tree mortality models.
                  </p>
                </div>
              </div>

              {/* Data Breakdown */}
              <div className="space-y-4">
                 <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Efficiency Projection</h3>
                 <div className="space-y-3">
                   {[
                     { label: 'Surface Reflection', val: 84, color: 'bg-emerald-500' },
                     { label: 'Thermal Lag Reduction', val: 62, color: 'bg-sky-500' },
                     { label: 'Community Adoption', val: 45, color: 'bg-amber-500' }
                   ].map((item, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                           <span className="text-slate-600 uppercase tracking-wider">{item.label}</span>
                           <span className="text-slate-900">{item.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${item.color} transition-all duration-1000 delay-300`} style={{ width: `${item.val}%` }} />
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Action Recommendation */}
              <div className="p-7 rounded-[32px] bg-slate-900 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-sky-500/10 blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Strategic Protocol</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold tracking-tight">Deploy CoolGrid Alpha</h4>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                      Initialize decentralized cooling node deployment across the identified thermal hotspots of Bangalore CBD.
                    </p>
                  </div>
                  <button 
                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-950/20"
                    onClick={() => {
                        alert("🚀 Initializing CoolGrid Alpha decentralized cooling node deployment sequence...");
                        onClose();
                    }}
                  >
                    Implement Protocol <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 py-4 grayscale opacity-40">
                 <CheckCircle2 className="w-4 h-4 text-slate-900" />
                 <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Validated Engine Output</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

