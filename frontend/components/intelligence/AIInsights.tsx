'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Leaf, 
  Waves, 
  Droplets,
  Building2,
  PieChart,
  ArrowRight,
  ThermometerSun
} from 'lucide-react';

export default function AIInsights() {
  const [predictionHour, setPredictionHour] = useState(35.2);
  const [riskLevel, setRiskLevel] = useState('Elevated');
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-11">
      {/* AI Heat Prediction Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1 xl:col-span-2 bg-white/40 backdrop-blur-3xl border border-white p-8 md:p-12 rounded-[56px] shadow-premium hover:shadow-2xl transition-all duration-700 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50/50 rounded-bl-[120px] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg animate-pulse">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">AI Heat Prediction</h3>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Predictive Thermodynamic Modeling</p>
          </div>
          
          <div className="flex bg-slate-900/5 backdrop-blur-sm p-1.5 rounded-full border border-slate-100">
             {['1 Hour', '24 Hours', 'Risk Zone'].map(f => (
               <button key={f} className={`px-5 md:px-7 py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${f === '1 Hour' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}>{f}</button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-10">
           <div className="space-y-8">
              <div className="p-10 bg-white shadow-premium rounded-[48px] border border-slate-50 hover:scale-[1.03] transition-all duration-500">
                 <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next 60 Mins</span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-500 rounded-full border border-rose-100">
                       <TrendingUp className="w-3.5 h-3.5" />
                       <span className="text-[9px] font-black uppercase tracking-tighter">+1.2° Surge</span>
                    </div>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black text-slate-900 tracking-tighter">36.<span className="text-rose-500">8</span></span>
                    <span className="text-2xl font-bold text-slate-300">°C</span>
                 </div>
                 <div className="mt-8 flex items-center justify-between text-[10px] font-black text-slate-400">
                    <p className="uppercase tracking-widest">Confidence: 87%</p>
                    <p className="uppercase tracking-widest">Zone 3 (CBD)</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between px-2">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Risk Timeline</h4>
                    <Clock className="w-4 h-4 text-slate-300" />
                 </div>
                 <div className="flex gap-2 h-14 items-end px-2">
                    {[30, 45, 60, 80, 75, 90, 85, 95].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className={`flex-1 rounded-t-lg ${h > 80 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-slate-200'} transition-colors`}
                      />
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="relative p-10 bg-slate-950 text-white rounded-[48px] shadow-2xl overflow-hidden group/card shadow-rose-900/5">
                 <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                 <h4 className="text-[10px] font-black uppercase text-rose-400 tracking-[0.4em] mb-4 relative z-10">Risk Escalation</h4>
                 <p className="text-2xl font-black mb-6 relative z-10 leading-tight">Emergency Protocol Required in <span className="text-rose-500 underline decoration-rose-500/30 underline-offset-8">2.4 Hours</span></p>
                 <button className="w-full py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-900/20 active:scale-95 relative z-10">Deploy Sensors</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-white/50 backdrop-blur-xl rounded-[32px] border border-slate-100 hover:bg-white transition-colors cursor-default">
                    <ThermometerSun className="w-5 h-5 text-amber-500 mb-3" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Peak Load</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">42.8°</p>
                 </div>
                 <div className="p-6 bg-white/50 backdrop-blur-xl rounded-[32px] border border-slate-100 hover:bg-white transition-colors cursor-default">
                    <Zap className="w-5 h-5 text-sky-500 mb-3" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Network</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">Stable</p>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Cooling Recommendation Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-1 bg-slate-900 text-white p-10 md:p-12 rounded-[56px] shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-tl-full -br-20 -bb-20" />
        
        <div className="relative z-10 mb-12">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                <Leaf className="w-5 h-5" />
             </div>
             <h3 className="text-2xl font-black text-white tracking-tight">AI Strategies</h3>
          </div>
          <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.4em] ml-1">Intelligent Decision Support</p>
        </div>

        <div className="space-y-6 relative z-10">
          {[
            { id: 1, label: 'Tree Plantation', val: 'Zone 4 Focus', icon: <Leaf className="w-5 h-5" />, color: 'bg-emerald-500/10 text-emerald-400' },
            { id: 2, label: 'Cool Roof Deployment', val: 'Phase II Scan', icon: <Droplets className="w-5 h-5" />, color: 'bg-sky-500/10 text-sky-400' },
            { id: 3, label: 'Water Mist Stations', val: 'Emergency Deploy', icon: <Waves className="w-5 h-5" />, color: 'bg-indigo-500/10 text-indigo-400' },
            { id: 4, label: 'Albedo Correction', val: 'SaaS Integration', icon: <Building2 className="w-5 h-5" />, color: 'bg-amber-500/10 text-amber-400' },
          ].map((item) => (
            <div key={item.id} className="group/item flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 hover:-translate-x-2 transition-all duration-500 cursor-pointer">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center border border-white/5 group-hover/item:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white tracking-tight group-hover/item:text-emerald-400 transition-colors uppercase">{item.label}</h4>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.val}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/20 group-hover/item:text-white transition-all transform -translate-x-2 group-hover/item:translate-x-0" />
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-br from-emerald-500 to-sky-600 rounded-[40px] shadow-2xl relative z-10 group/cta cursor-pointer active:scale-95 transition-transform overflow-hidden">
           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/cta:opacity-100 transition-opacity" />
           <p className="text-[11px] font-black uppercase text-white/60 tracking-widest mb-2">Simulated Outcome</p>
           <h4 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">−4.2°C Projected Gain</h4>
           <p className="text-[9px] font-bold text-white/80 uppercase tracking-widest">Execute Full Intervention</p>
        </div>
      </motion.div>

      {/* City Cooling Score - Third Column (or row on mobile) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1 xl:col-span-3 bg-white/60 backdrop-blur-3xl border border-white p-10 md:p-14 rounded-[72px] shadow-premium hover:shadow-2xl transition-all duration-1000 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-50 rounded-full blur-[140px] opacity-20 pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-16 relative z-10">
           <div className="space-y-4 text-center lg:text-left">
              <h3 className="text-4xl font-display font-black text-slate-900 tracking-tighter leading-[0.85]">City Cooling Intelligence</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">Cross-layered analytics of metropolitan urban heat risk and vegetation density index.</p>
           </div>
           
           <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative w-48 h-48 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="16" className="text-slate-100" />
                    <circle 
                      cx="96" cy="96" r="88" 
                      fill="none" stroke="currentColor" strokeWidth="16" strokeDasharray={552} strokeDashoffset={552 * (1 - 0.68)}
                      className="text-emerald-500 animate-dash"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full shadow-2xl scale-75 border-8 border-slate-50">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">68<span className="text-2xl text-slate-300 ml-0.5">%</span></span>
                    <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Cooling Score</span>
                 </div>
                 <Zap className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] bg-white rounded-full p-1.5 border border-slate-100 shadow-md" />
              </div>
           </div>

           <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
              {[
                { label: 'Heat Risk', val: 'High', color: 'text-rose-500', bg: 'bg-rose-50', icon: <ShieldAlert className="w-4 h-4" /> },
                { label: 'Vegetation', val: 'Low', color: 'text-amber-500', bg: 'bg-amber-50', icon: <Leaf className="w-4 h-4" /> },
                { label: 'Infrastructure', val: 'Medium', color: 'text-sky-500', bg: 'bg-sky-50', icon: <Droplets className="w-4 h-4" /> },
                { label: 'Density', val: 'High', color: 'text-slate-900', bg: 'bg-slate-100', icon: <Zap className="w-4 h-4" /> },
              ].map((m, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 bg-white/60 backdrop-blur-xl border border-white rounded-[32px] hover:shadow-xl transition-all cursor-default group">
                   <div className={`w-8 h-8 rounded-xl ${m.bg} ${m.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {m.icon}
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                      <p className={`text-sm font-black uppercase tracking-tight ${m.color}`}>{m.val}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </motion.div>
    </div>
  );
}
