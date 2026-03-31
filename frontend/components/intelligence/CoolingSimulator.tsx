'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  Leaf, 
  Waves, 
  Building2, 
  Play, 
  RotateCcw, 
  Wind,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function CoolingSimulator() {
  const [temp, setTemp] = useState(42.8);
  const [applied, setApplied] = useState<{ trees: boolean, water: boolean, roofs: boolean }>({
    trees: false,
    water: false,
    roofs: false
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const calculateTemp = () => {
    let t = 42.8;
    if (applied.trees) t -= 2.4;
    if (applied.water) t -= 4.2;
    if (applied.roofs) t -= 1.8;
    setTemp(parseFloat(t.toFixed(1)));
  };

  useEffect(() => {
    setIsSimulating(true);
    const timer = setTimeout(() => {
      calculateTemp();
      setIsSimulating(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [applied]);

  const reset = () => {
    setApplied({ trees: false, water: false, roofs: false });
  };

  return (
    <div className="mt-20 space-y-12 animate-in slide-in-from-bottom-12 duration-1000">
       <div className="flex flex-col md:flex-row items-baseline justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight leading-none text-balance">
               Impact Simulator 
            </h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-1">Live Thermodynamic Intervention Sandbox</p>
          </div>
          <button 
            onClick={reset}
            className="flex items-center gap-3 px-8 py-3 bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
          >
             <RotateCcw className="w-4 h-4" /> Reset Environment
          </button>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 lg:gap-16 items-center">
          <div className="col-span-1 xl:col-span-2 space-y-12 relative">
             <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[56px] overflow-hidden bg-slate-900 shadow-2xl border-4 border-white ring-1 ring-slate-100 p-8 md:p-14 group">
                {/* Background Representation */}
                <div className={`absolute inset-0 transition-all duration-2000 ease-in-out ${temp > 40 ? 'bg-gradient-to-br from-rose-500/30 to-slate-900' : temp > 38 ? 'bg-gradient-to-br from-amber-500/20 to-slate-900' : 'bg-gradient-to-br from-emerald-500/20 to-slate-900'}`} />
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Thermodynamic Grid</h4>
                         <p className="text-2xl font-black text-white tracking-tight uppercase">Jubilee Sector 4</p>
                      </div>
                      <div className="flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                         <div className={`w-2 h-2 rounded-full ${temp > 40 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'} shadow-lg`} />
                         {temp > 40 ? 'Extreme Heat Risk' : 'Sustainable Flux'}
                      </div>
                   </div>

                   <div className="flex items-center justify-center gap-12 py-10">
                      <div className="text-center space-y-4">
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Ambient Temperature</p>
                         <AnimatePresence mode="wait">
                            <motion.div 
                              key={temp}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-8xl md:text-[10rem] font-black text-white tracking-tighter tabular-nums drop-shadow-2xl flex items-baseline gap-4"
                            >
                               {isSimulating ? (
                                 <motion.span animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity }}>--.-</motion.span>
                               ) : temp}
                               <span className="text-3xl font-bold text-white/30 ml-2">°C</span>
                            </motion.div>
                         </AnimatePresence>
                      </div>
                   </div>

                   <div className="bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/5 flex flex-wrap gap-10 items-center justify-between">
                      <div className="flex gap-10">
                        <div className="space-y-1 text-center">
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">Net Goal</p>
                           <p className="text-xl font-black text-emerald-400 tracking-tighter">36.0°</p>
                        </div>
                        <div className="space-y-1 text-center">
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">Mitigation</p>
                           <p className="text-xl font-black text-sky-400 tracking-tighter">−{(42.8 - temp).toFixed(1)}°</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         {applied.trees && <Leaf className="w-5 h-5 text-emerald-400 animate-in fade-in" />}
                         {applied.water && <Waves className="w-5 h-5 text-sky-400 animate-in fade-in" />}
                         {applied.roofs && <Building2 className="w-5 h-5 text-amber-400 animate-in fade-in" />}
                      </div>
                   </div>
                </div>
                
                {/* Visual Cooling Particles */}
                {applied.water && !isSimulating && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 bg-[url('https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=1200')] bg-cover animate-pulse-slow" />
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 gap-6 w-full">
            {[
              { id: 'trees', label: 'Urban Afforestation', reduction: '−2.4°C', info: 'Maximized green index (NDVI) via deep canopy integration.', icon: <Leaf className="w-6 h-6" />, color: 'emerald' },
              { id: 'water', label: 'Riverine Cooling', reduction: '−4.2°C', info: 'Distributed evaporative cooling using high-pressure mist.', icon: <Waves className="w-6 h-6" />, color: 'sky' },
              { id: 'roofs', label: 'Reflective Surfaces', reduction: '−1.8°C', info: 'Correcting metropolitan albedo via cool roof deployment.', icon: <Building2 className="w-6 h-6" />, color: 'amber' },
            ].map((s) => (
              <div 
                key={s.id}
                onClick={() => setApplied(prev => ({ ...prev, [s.id]: !prev[s.id as keyof typeof prev] }))}
                className={`group p-8 rounded-[40px] border transition-all duration-700 cursor-pointer flex items-center justify-between shadow-premium hover:-translate-x-3 active:scale-[0.98] ${applied[s.id as keyof typeof applied] ? `bg-${s.color}-900 text-white border-${s.color}-800 shadow-${s.color}-900/40` : 'bg-white text-slate-900 border-slate-100 hover:bg-slate-50 shadow-slate-200'}`}
              >
                 <div className="flex items-center gap-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${applied[s.id as keyof typeof applied] ? 'bg-white/10 text-white' : `bg-${s.color}-50 text-${s.color}-600`}`}>
                       {s.icon}
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-lg font-black tracking-tight uppercase">{s.label}</h4>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${applied[s.id as keyof typeof applied] ? 'text-white/60' : 'text-slate-400'}`}>Potential: <span className={applied[s.id as keyof typeof applied] ? 'text-white' : `text-${s.color}-600`}>{s.reduction}</span></p>
                    </div>
                 </div>
                 <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${applied[s.id as keyof typeof applied] ? 'bg-white border-white' : 'border-slate-200'}`}>
                    <AnimatePresence>
                      {applied[s.id as keyof typeof applied] && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                           <ShieldCheck className={`w-5 h-5 text-${s.color}-600`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              </div>
            ))}
            
            <div className="mt-6 p-8 bg-slate-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                     <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Optimized Configuration</p>
                  </div>
                  <h4 className="text-xl font-bold leading-tight">Apply this scenario to the city's active <span className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-4">Decision Protocol</span>.</h4>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
}
