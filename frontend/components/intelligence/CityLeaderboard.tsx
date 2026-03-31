'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ShieldCheck, Zap, Leaf, Award } from 'lucide-react';

export default function CityLeaderboard() {
  const teams = [
    { name: 'Tokyo Green Core', score: 98.4, impact: '-4.2°C', badge: <Trophy className="w-5 h-5 text-amber-400" /> },
    { name: 'Singapore Cooling Unit', score: 96.2, impact: '-3.8°C', badge: <Award className="w-5 h-5 text-slate-300" /> },
    { name: 'Hyderabad UrbanIQ', score: 94.8, impact: '-3.4°C', badge: <Star className="w-5 h-5 text-rose-300" /> },
    { name: 'Paris Albedo Team', score: 92.1, impact: '-2.9°C', badge: null },
    { name: 'Bangalore EcoNode', score: 89.4, impact: '-2.4°C', badge: null },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/40 backdrop-blur-3xl border border-white p-10 md:p-14 lg:p-16 rounded-[72px] shadow-premium hover:shadow-2xl transition-all duration-1000 relative overflow-hidden"
    >
       <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20 relative z-10">
          <div className="space-y-4 text-center lg:text-left">
             <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Global Performance Tier
             </div>
             <h3 className="text-5xl md:text-7xl font-display font-black text-slate-950 tracking-tighter leading-[0.8]">Strategic Leaderboard</h3>
             <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">High-efficiency municipal cooling teams ranked by realized thermodynamic impact and vegetation density gains.</p>
          </div>
          
          <div className="flex -space-x-6">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`w-20 h-20 rounded-full border-8 border-white shadow-2xl relative z-${10*i} overflow-hidden group hover:-translate-y-4 transition-all duration-700`}>
                  <img src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="team" />
               </div>
             ))}
          </div>
       </div>

       <div className="space-y-6 relative z-10">
          {teams.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + (i * 0.1) }}
               className="group flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[48px] hover:bg-slate-950 hover:text-white hover:-translate-x-4 transition-all duration-700 cursor-pointer shadow-premium"
            >
               <div className="flex items-center gap-10">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center text-xl font-black ${i === 0 ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-400'} group-hover:bg-white group-hover:text-slate-950 transition-all duration-700`}>
                     0{i+1}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black tracking-tight leading-none mb-2 font-display">{t.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-60">Impact: <span className="text-emerald-500">{t.impact}</span> / Conf: 98%</p>
                  </div>
               </div>

               <div className="flex items-center gap-10">
                  <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Intelligence Score</p>
                     <p className="text-3xl font-black tracking-tighter leading-none">{t.score}<span className="text-sm opacity-20 ml-1">%</span></p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white/10 transition-all duration-700">
                     {t.badge || <Zap className="w-6 h-6 text-slate-200 group-hover:text-amber-400 transition-colors" />}
                  </div>
               </div>
            </motion.div>
          ))}
       </div>

       <div className="mt-20 p-12 bg-slate-950 rounded-[64px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
             <div className="flex items-center gap-8">
                <div className="w-18 h-18 rounded-[28px] bg-emerald-500 flex items-center justify-center text-white shadow-3xl animate-pulse-slow">
                   <Leaf className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                   <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-1">Impact Goal 2030</p>
                   <h4 className="text-4xl font-black text-white tracking-tighter leading-none">Net Neutral Cooling</h4>
                </div>
             </div>
             <button className="px-14 py-5 bg-white text-slate-950 rounded-[28px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl active:scale-95 transition-all hover:bg-emerald-400 hover:text-white">Register Smart Node</button>
          </div>
       </div>
    </motion.div>
  );
}
