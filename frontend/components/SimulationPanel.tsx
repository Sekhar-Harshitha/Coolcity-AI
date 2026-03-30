'use client'

import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { simulateLocally, type SimulationResult } from '@/lib/simulator';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  TreeDeciduous, 
  Wind, 
  Droplets, 
  Banknote, 
  Thermometer, 
  BrainCircuit, 
  Activity, 
  LineChart, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  ChevronRight,
  Trophy
} from 'lucide-react';

interface SimulationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  zoneAreaM2: number;
  onOptimizeChange?: (optimized: boolean) => void;
}

export default function SimulationPanel({ isOpen, onClose, zoneAreaM2, onOptimizeChange }: SimulationPanelProps) {
  const [budget, setBudget] = useState(1500000); // 15 Lakh
  const [strategy, setStrategy] = useState<'balanced' | 'green_first' | 'tech_first'>('balanced');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    onOptimizeChange?.(showComparison);
  }, [showComparison, onOptimizeChange]);

  const runSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      const simResult = simulateLocally(strategy, budget, zoneAreaM2);
      setResult(simResult);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (isOpen) runSimulation();
  }, [isOpen, budget, strategy]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Simulation Laboratory">
      <div className="space-y-12 pb-20 pt-4">
        
        {/* Scenario Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
           <div className="flex flex-col gap-1.5">
             <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Urban Transformation Model</h2>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Zone S-{(zoneAreaM2/100).toFixed(0)}</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Analysis Validated</span>
             </div>
           </div>
           <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 self-start md:self-auto">
             <button 
               onClick={() => setShowComparison(false)}
               className={`px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${!showComparison ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Draft
             </button>
             <button 
               onClick={() => setShowComparison(true)}
               className={`px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${showComparison ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Optimized
             </button>
           </div>
        </div>

        {/* Predictive Heat Forecast - Modern SaaS Chart */}
        <div className="group relative bg-white rounded-[40px] p-10 shadow-premium border border-slate-200/60 overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20 group-hover:bg-slate-100 transition-colors pointer-events-none" />
           
           <div className="flex items-center justify-between mb-10 relative z-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100/50">
                   <LineChart className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl tracking-tight">Heat Trajectory Matrix</h3>
             </div>
             <div className="px-3.5 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-rose-100 animate-pulse">Critical Warning</div>
           </div>

           <div className="flex h-52 items-end justify-between gap-10 border-b border-slate-100 pb-6 relative z-10">
              <div className="flex flex-col items-center gap-4 w-1/4">
                 <div className="space-y-1 text-center">
                    <span className="text-sm font-bold text-slate-900">38.2°C</span>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-2xl h-[50%] transition-all duration-1000" />
              </div>
              <div className="flex flex-col items-center gap-4 w-1/4">
                 <div className="space-y-1 text-center">
                    <span className="text-sm font-bold text-slate-400">39.8°C</span>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Forecast</span>
                 </div>
                 <div className="w-full bg-slate-100/40 rounded-2xl h-[65%] transition-all duration-1000 border border-dashed border-slate-200" />
              </div>
              <div className="flex flex-col items-center gap-4 w-1/2">
                 <div className="flex items-center gap-4 mb-2">
                    <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-emerald-200">AI OPTIMIZED</div>
                    <span className="text-3xl font-bold text-slate-900 tracking-tight">{(38.2 - (result?.temp_reduction || 0)).toFixed(1)}°C</span>
                 </div>
                 <div 
                   className="w-full bg-slate-900 rounded-t-3xl transition-all duration-1000 shadow-2xl shadow-slate-300" 
                   style={{ height: `${Math.max(20, 50 - (result?.temp_reduction || 0) * 10)}%` }}
                 />
                 <span className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Mitigated State</span>
              </div>
           </div>
           
           <div className="mt-8 flex items-start gap-5 relative z-10 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                 <Activity className="w-6 h-6 text-slate-900" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Model Analysis Insight</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Projected intervention will result in a <span className="text-slate-900 font-bold">{(result?.temp_reduction || 0).toFixed(1)}°C drop</span> within 18 months, neutralizing the predicted heat surge and protecting local infrastructure.
                </p>
              </div>
           </div>
        </div>

        {/* Budget Optimizer Slider */}
        <div className="relative group p-10 bg-white rounded-[40px] border border-slate-200/60 shadow-premium overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
                  <Banknote className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-slate-900 text-xl tracking-tight">Resource Allocation</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Capital expenditure optimization</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">₹{(budget / 100000).toFixed(1)}L</span>
              </div>
           </div>
           
           <div className="px-2">
             <input 
               type="range" 
               min="100000" 
               max="5000000" 
               step="100000" 
               value={budget}
               onChange={(e) => setBudget(Number(e.target.value))}
               className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900 transition-all hover:bg-slate-200"
             />
             <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
               <span className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Baseline</span>
               <span className="flex items-center gap-2">Maximum Saturation <Zap className="w-3.5 h-3.5 text-amber-500" /></span>
             </div>
           </div>

           <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cooling Efficiency</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">−{( (result?.temp_reduction || 1) / (budget/10000000) ).toFixed(1)}°C / Cr</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investment Rating</span>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-bold text-emerald-600">{(Math.min(98, 40 + (budget/100000))).toFixed(0)}%</span>
                   <Trophy className="w-5 h-5 text-amber-500" />
                </div>
              </div>
           </div>
        </div>

        {/* Strategy Selection Matrix */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Optimization Protocol Matrix</h3>
             <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['balanced', 'green_first', 'tech_first'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStrategy(s)}
                className={`text-left p-8 rounded-[32px] transition-all duration-300 relative overflow-hidden group ${
                  strategy === s 
                    ? 'bg-slate-900 shadow-xl shadow-slate-300 scale-[1.02] border-slate-900' 
                    : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                } border-2`}
              >
                {strategy === s && <div className="absolute top-4 right-4"><ShieldCheck className="w-5 h-5 text-emerald-400" /></div>}
                <div className="flex flex-col h-full gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${strategy === s ? 'bg-white/10 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                    {s === 'balanced' ? <Activity className={`w-5 h-5 ${strategy === s ? 'text-white' : 'text-slate-400'}`} /> : s === 'green_first' ? <TreeDeciduous className={`w-5 h-5 ${strategy === s ? 'text-white' : 'text-slate-400'}`} /> : <BrainCircuit className={`w-5 h-5 ${strategy === s ? 'text-white' : 'text-slate-400'}`} />}
                  </div>
                  <div>
                    <h4 className={`text-[10px] font-bold uppercase tracking-widest ${strategy === s ? 'text-slate-400' : 'text-slate-400'}`}>
                      {s === 'balanced' ? 'Hybrid' : s === 'green_first' ? 'Bio-First' : 'Synthetic'}
                    </h4>
                    <p className={`text-lg font-bold ${strategy === s ? 'text-white' : 'text-slate-900'} tracking-tight mt-1`}>
                      {s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Epic Comparison Section */}
        {result && (
          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
             
             <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between px-2">
                   <h3 className="font-bold text-slate-900 text-2xl tracking-tight">Impact Visualization</h3>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Model Synchronized
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative px-2">
                   <div className="group relative rounded-[40px] overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-700">
                      <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-slate-900/90 backdrop-blur-xl rounded-full text-[10px] font-bold text-white uppercase tracking-widest">Baseline</div>
                      <div className="w-full aspect-[4/3] relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-orange-950/40 mix-blend-multiply z-10" />
                         <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover filter saturate-[1.1] brightness-90 group-hover:scale-110 transition-transform duration-[3000ms]" alt="Before" />
                         <div className="absolute bottom-8 left-8 z-20">
                            <span className="text-5xl font-bold text-white drop-shadow-2xl tracking-tighter">38.2<span className="text-xl ml-1 font-medium text-white/80">°C</span></span>
                            <div className="flex items-center gap-2 mt-2">
                               <TrendingUp className="w-4 h-4 text-rose-300" />
                               <span className="text-[11px] font-bold text-white/95 uppercase tracking-[0.2em]">Heat Spike Warning</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="group relative rounded-[40px] overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-700">
                      <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-emerald-500 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-xl">Optimized</div>
                      <div className="w-full aspect-[4/3] relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-sky-600/40 mix-blend-overlay z-10" />
                         <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover filter saturate-[1.4] brightness-105 hue-rotate-[15deg] group-hover:scale-110 transition-transform duration-[3000ms]" alt="After" />
                         <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-emerald-900/60 to-transparent pointer-events-none" />
                         <div className="absolute bottom-8 left-8 z-20">
                            <span className="text-6xl font-bold text-white drop-shadow-2xl tracking-tighter">{(38.2 - result.temp_reduction).toFixed(1)}<span className="text-xl ml-1 font-medium text-white/80">°C</span></span>
                            <div className="flex items-center gap-2 mt-2">
                               <ShieldCheck className="w-5 h-5 text-emerald-300" />
                               <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Neutralized State</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center border-8 border-white pointer-events-none hidden md:flex">
                      <ArrowRight className="w-6 h-6 text-white" />
                   </div>
                </div>
             </div>

             {/* Deployment Mix - Refined */}
            <div className="bg-slate-50/50 rounded-[40px] p-10 border border-slate-100">
               <div className="flex justify-between items-center mb-10">
                 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Deployment Specification Mix</h4>
                 <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest shadow-sm">
                   {Object.values(result.optimal_mix).reduce((a,b)=>a+b, 0).toFixed(0)} Unit Saturation
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {Object.entries(result.optimal_mix).map(([item, count]) => {
                   const itemsArr = {
                     tree_plantation: { icon: TreeDeciduous, label: 'Bio-Canopy', color: 'bg-emerald-50 text-emerald-900', b: 'border-emerald-100/50', iconBg: 'bg-white text-emerald-600' },
                     cool_roofs: { icon: Wind, label: 'Albedo Shields', color: 'bg-sky-50 text-sky-900', b: 'border-sky-100/50', iconBg: 'bg-white text-sky-600' },
                     green_walls: { icon: Activity, label: 'Vertical Moss', color: 'bg-indigo-50 text-indigo-900', b: 'border-indigo-100/50', iconBg: 'bg-white text-indigo-600' },
                     water_bodies: { icon: Droplets, label: 'Hydration Nodes', color: 'bg-blue-50 text-blue-900', b: 'border-blue-100/50', iconBg: 'bg-white text-blue-600' },
                   };
                   const meta = itemsArr[item as keyof typeof itemsArr] || { icon: Sparkles, label: item, color: 'bg-slate-100', b: 'border-slate-200', iconBg: 'bg-white text-slate-400' };
                   
                   return count > 0 && (
                     <div key={item} className={`flex items-center justify-between p-6 rounded-3xl border ${meta.b} ${meta.color} transition-all hover:bg-white hover:shadow-xl hover:scale-[1.02] duration-300 cursor-default`}>
                       <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 rounded-2xl ${meta.iconBg} flex items-center justify-center shadow-sm`}>
                           <meta.icon className="w-6 h-6" />
                         </div>
                         <div className="flex flex-col gap-0.5">
                           <span className="text-sm font-bold tracking-tight">{meta.label}</span>
                           <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Optimized Placement</span>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="text-3xl font-bold tracking-tighter">×{Math.floor(count as number)}</span>
                       </div>
                     </div>
                   )
                 })}
               </div>
            </div>

            {/* AI Endorsement - Modern Card */}
            <div className="relative group bg-slate-900 rounded-[48px] p-10 md:p-14 text-white overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-transparent blur-[120px] pointer-events-none" />
               <div className="flex flex-col md:flex-row gap-12 items-start md:items-center relative z-10">
                  <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/10">
                         <BrainCircuit className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h4 className="text-2xl font-bold tracking-tight">AI Strategy Endorsement</h4>
                    </div>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl italic">
                      "Implementing this configuration achieves a spectral cooling efficiency of <span className="text-white font-bold">{((result.temp_reduction / 3.8) * 100).toFixed(1)}%</span>. This intervention represents the optimal balance between initial CAPEX and long-term thermodynamic stability for this zone profile."
                    </p>
                    <div className="flex items-center gap-6 pt-4">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em] mb-1">CO2 Potential</span>
                          <span className="text-xl font-bold text-white">14.2 Tons / yr</span>
                       </div>
                       <div className="w-px h-10 bg-white/10" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em] mb-1">Public Health ROI</span>
                          <span className="text-xl font-bold text-emerald-400">+92.4%</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-6 px-2">
               <Button onClick={onClose} variant="ghost" className="flex-1 h-16 rounded-[24px] bg-white border border-slate-200 text-slate-900 font-bold text-lg hover:bg-slate-50 transition-all hover:scale-[1.01] active:scale-95">Save draft</Button>
               <Button className="flex-1 h-16 rounded-[24px] bg-slate-900 text-white font-bold text-lg shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.01] active:scale-95 flex gap-3">
                 Finalize for Implementation <ChevronRight className="w-5 h-5" />
               </Button>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

