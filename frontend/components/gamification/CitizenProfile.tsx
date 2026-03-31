'use client';

import { useState, useEffect } from 'react';
import { getUserProfile } from '@/lib/gamification/pointsEngine';
import { 
  Award, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Zap, 
  Shield, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Share2,
  Settings,
  MoreHorizontal
} from 'lucide-react';

import { useGamification } from '@/components/gamification/GamificationProvider';

export default function CitizenProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [activeSegment, setActiveSegment] = useState('Overview');
  const { addToast, addXP } = useGamification();

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  if (!profile) return (
    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
       <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
    </div>
  );

  const nextBadgeXP = profile.currentBadge.xpRequired * 2; 
  const progress = Math.min((profile.totalPoints / (nextBadgeXP || 1000)) * 100, 100);

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6 flex flex-col gap-10">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-premium relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 blur-[120px] pointer-events-none group-hover:bg-emerald-100 transition-all duration-[2000ms]" />
         
         <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 relative z-10">
            <div className="relative">
               <div className="w-40 h-40 rounded-[48px] bg-slate-900 flex items-center justify-center text-7xl shadow-2xl relative overflow-hidden group-hover:rotate-3 transition-transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  {profile.currentBadge.icon}
               </div>
               <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white animate-bounce">
                  <Award className="w-6 h-6" />
               </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight mb-2">Citizen Scientist</h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                       <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-500 text-xs font-black uppercase tracking-widest border border-slate-100">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" /> Hyderabad, IN
                       </span>
                       <span className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-600 text-xs font-black uppercase tracking-widest border border-emerald-100">
                          <Shield className="w-3.5 h-3.5" /> Level {Math.floor(profile.totalPoints / 1000) + 1}
                       </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                     <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm active:scale-95">
                        <Share2 className="w-5 h-5" />
                     </button>
                     <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm active:scale-95">
                        <Settings className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               <div className="mt-12">
                  <div className="flex justify-between items-end mb-4">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Rank Progress</p>
                        <p className="text-sm font-bold text-slate-700">Next Rank: <span className="text-emerald-600 font-black">Urban Architect</span></p>
                     </div>
                     <span className="text-sm font-black text-slate-900">{profile.totalPoints} / {nextBadgeXP || 1000} XP</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                     <div 
                       className="h-full bg-emerald-500 transition-all duration-1000 ease-out relative" 
                       style={{ width: `${progress}%` }} 
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Scans', value: profile.actionsCount, color: 'text-sky-600', bg: 'bg-sky-50', icon: <Zap className="w-5 h-5" /> },
           { label: 'Current Streak', value: `${profile.streakDays} Days`, color: 'text-rose-600', bg: 'bg-rose-50', icon: <Flame className="w-5 h-5" /> },
           { label: 'Global Rank', value: '#142', color: 'text-amber-600', bg: 'bg-amber-50', icon: <TrendingUp className="w-5 h-5" /> },
           { label: 'Heat Mitigation', value: '-1.4°C', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle2 className="w-5 h-5" /> },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                 {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className={`text-3xl font-black text-slate-900`}>{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
         {/* Activity Log */}
         <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Recent Activity</h3>
               <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">View Timeline</button>
            </div>
            
            <div className="space-y-6">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                       <Clock className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                       <p className="font-bold text-slate-900 text-lg">Heat Anomaly Reported</p>
                       <p className="text-sm text-slate-500">Jubilee Hills Precinct • 2h ago</p>
                    </div>
                    <div className="text-right">
                       <p className="text-emerald-600 font-black text-lg">+45 XP</p>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-400" />
                 </div>
               ))}
            </div>
         </div>

         {/* Badges Gallery */}
         <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            <h3 className="text-2xl font-display font-black text-white tracking-tight mb-8">Badge Gallery</h3>
            
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: '🌱', label: 'Sprout', locked: false },
                 { icon: '🌿', label: 'Gardener', locked: false },
                 { icon: '🛡️', label: 'Sentry', locked: false },
                 { icon: '🏢', label: 'Planner', locked: true },
                 { icon: '🌳', label: 'Forester', locked: true },
                 { icon: '🏛️', label: 'Architect', locked: true },
               ].map((badge, i) => (
                 <div key={i} className={`p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 transition-all ${badge.locked ? 'bg-white/5 opacity-40' : 'bg-white/10 hover:bg-white/20 active:scale-95 cursor-pointer'}`}>
                    <span className="text-4xl filter drop-shadow-lg">{badge.icon}</span>
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{badge.label}</span>
                 </div>
               ))}
            </div>
            
            <button className="w-full mt-8 py-4 bg-white text-slate-900 rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 hover:text-white transition-all shadow-xl">
               Browse All Achievements <MoreHorizontal className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
