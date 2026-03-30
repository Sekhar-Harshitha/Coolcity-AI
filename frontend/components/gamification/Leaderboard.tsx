'use client';

import { useState, useEffect, useMemo } from 'react';
import { getUserProfile } from '@/lib/gamification/pointsEngine';
import { Trophy, Medal, Star, TrendingUp, Globe, Users, Briefcase, GraduationCap, ChevronRight, Search } from 'lucide-react';

const mockCitizensBase = [
  { name: 'Aditya Sharma', points: 4800, badge: '🌆', zones: 5, trend: [20, 30, 45, 60, 80, 70, 90], city: 'Hyderabad' },
  { name: 'Priya Nair', points: 4200, badge: '⚡', zones: 4, trend: [10, 25, 40, 50, 65, 80, 85], city: 'Hyderabad' },
  { name: 'Rohan Mehta', points: 3900, badge: '⚡', zones: 3, trend: [30, 40, 35, 50, 70, 75, 80], city: 'Bangalore' },
  { name: 'Sneha Reddy', points: 3400, badge: '⚡', zones: 4, trend: [15, 20, 30, 40, 60, 55, 65], city: 'Hyderabad' },
  { name: 'Arjun Iyer', points: 2900, badge: '🏆', zones: 2, trend: [5, 10, 20, 35, 45, 50, 60], city: 'Chennai' },
  { name: 'Meera Patel', points: 2400, badge: '🏆', zones: 2, trend: [10, 15, 25, 30, 40, 45, 50], city: 'Hyderabad' },
  { name: 'Vikram Rao', points: 2100, badge: '🏆', zones: 1, trend: [5, 8, 15, 20, 25, 35, 40], city: 'Bangalore' },
  { name: 'Kavitha Singh', points: 1800, badge: '🏆', zones: 1, trend: [2, 5, 10, 15, 20, 25, 30], city: 'Hyderabad' },
  { name: 'Nikhil Kumar', points: 1400, badge: '🔬', zones: 1, trend: [0, 5, 8, 12, 18, 20, 25], city: 'Chennai' },
  { name: 'Divya Chandra', points: 1100, badge: '🔬', zones: 0, trend: [0, 2, 5, 8, 10, 15, 18], city: 'Hyderabad' },
];

const mockColleges = [
  { name: 'BITS Hyderabad', points: 5400, badge: '🏛️', zones: 12, trend: [40, 45, 50, 60, 70, 80, 85], city: 'Hyderabad' },
  { name: 'IIT Hyderabad', points: 5100, badge: '🎓', zones: 10, trend: [30, 35, 40, 50, 65, 70, 75], city: 'Hyderabad' },
  { name: 'IIIT Hyderabad', points: 4900, badge: '💻', zones: 8, trend: [20, 25, 30, 40, 50, 60, 65], city: 'Hyderabad' },
  { name: 'Osmania University', points: 3600, badge: '📖', zones: 6, trend: [15, 20, 25, 35, 45, 50, 55], city: 'Hyderabad' },
  { name: 'NIT Warangal', points: 3300, badge: '⚙️', zones: 5, trend: [10, 15, 20, 30, 40, 45, 50], city: 'Warangal' },
];

const mockCompanies = [
  { name: 'Cyient', points: 6200, badge: '🏢', zones: 8, trend: [50, 60, 65, 75, 85, 90, 95], city: 'Hyderabad' },
  { name: 'TCS Hyderabad', points: 5900, badge: '☁️', zones: 7, trend: [40, 50, 55, 65, 75, 80, 85], city: 'Hyderabad' },
  { name: 'Infosys Gachibowli', points: 5600, badge: '📡', zones: 6, trend: [35, 45, 50, 60, 70, 75, 80], city: 'Hyderabad' },
  { name: 'Wipro Hyderabad', points: 4200, badge: '🌐', zones: 5, trend: [30, 40, 45, 55, 65, 70, 75], city: 'Hyderabad' },
  { name: 'Tech Mahindra', points: 3900, badge: '🛠️', zones: 4, trend: [25, 35, 40, 50, 60, 65, 70], city: 'Hyderabad' },
];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((d, i) => `${i * 10},${30 - ((d - min) / (max - min || 1)) * 30}`).join(' ');
  
  return (
    <svg width="60" height="30" className="overflow-visible">
      <polyline fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

function getAvatarColor(name: string) {
  const colors = ['bg-slate-100', 'bg-emerald-50', 'bg-sky-50', 'bg-indigo-50', 'bg-amber-50'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default function Leaderboard() {
  const [tab, setTab] = useState('Citizens');
  const [timeframe, setTimeframe] = useState('All Time');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [animating, setAnimating] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    getUserProfile().then(profile => {
      setUserProfile(profile);
      
      let baseData: any[] = [];
      if (tab === 'Citizens') baseData = [...mockCitizensBase];
      else if (tab === 'Colleges') baseData = [...mockColleges];
      else if (tab === 'Companies') baseData = [...mockCompanies];

      if (tab === 'Citizens') {
         const pts = profile ? profile.totalPoints : 0;
         // Insert 'You' into the array
         baseData.push({ 
           name: 'You', 
           points: pts, 
           badge: profile ? profile.currentBadge.icon : '🌱', 
           zones: profile ? profile.actionsCount : 0, 
           trend: [0, 10, pts > 10 ? pts/2 : 0, pts], 
           isUser: true,
           city: 'Hyderabad'
         });
      }

      // Apply City Filter
      if (cityFilter !== 'All Cities') {
        baseData = baseData.filter(i => i.city === cityFilter);
      }

      // Apply Search
      if (searchQuery) {
        baseData = baseData.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // Sort
      baseData.sort((a, b) => b.points - a.points);
      
      setData(baseData);
    });

    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [tab, cityFilter, timeframe, searchQuery]);

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-premium max-w-5xl mx-auto my-8 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight flex items-center gap-4">
              World Rankings <Trophy className="w-8 h-8 text-amber-400" />
            </h2>
            <p className="text-slate-500 font-medium mt-2">The most active urban cooling contributors globally.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Find players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-5 text-sm font-bold outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all w-full md:w-64"
                />
             </div>
             <select 
               value={cityFilter}
               onChange={(e) => setCityFilter(e.target.value)}
               className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-widest outline-none hover:bg-slate-50 transition-colors cursor-pointer"
             >
                <option>All Cities</option>
                <option>Hyderabad</option>
                <option>Bangalore</option>
                <option>Chennai</option>
             </select>
          </div>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
           <div className="flex bg-slate-50 p-1.5 rounded-[22px] border border-slate-100 shadow-inner w-full md:w-auto">
              {[
                { id: 'Citizens', icon: <Users className="w-4 h-4" /> },
                { id: 'Colleges', icon: <GraduationCap className="w-4 h-4" /> },
                { id: 'Companies', icon: <Briefcase className="w-4 h-4" /> }
              ].map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${tab === t.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t.icon} {t.id}
                </button>
              ))}
           </div>
           
           <div className="flex gap-2">
              {['This Week', 'This Month', 'All Time'].map(time => (
                 <button 
                  key={time}
                  onClick={() => setTimeframe(time)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${timeframe === time ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                 >
                    {time}
                 </button>
              ))}
           </div>
        </div>

        {/* User Status Hero Card */}
        {userProfile && tab === 'Citizens' && (
          <div className="mb-10 bg-slate-900 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-[2000ms]" />
            
            <div className="w-24 h-24 rounded-[32px] bg-white/10 flex items-center justify-center text-5xl relative shadow-xl border border-white/10">
              {userProfile.currentBadge.icon}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-900 text-sm font-black shadow-lg">
                #{data.findIndex(u => u.isUser) + 1}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left transition-all group-hover:translate-x-2">
              <h3 className="text-white text-2xl font-black tracking-tight mb-1">Your Standing</h3>
              <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <TrendingUp className="w-4 h-4" /> Top 5% Globally
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-[24px] text-center backdrop-blur-md">
                  <p className="text-emerald-400 text-3xl font-black mb-1">{userProfile.totalPoints}</p>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Total XP</p>
               </div>
               <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-[24px] text-center backdrop-blur-md">
                  <p className="text-white text-3xl font-black mb-1">{userProfile.streakDays}</p>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Day Streak</p>
               </div>
            </div>
          </div>
        )}

        <div className={`space-y-3 transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {data.length === 0 ? (
            <div className="py-20 text-center">
               <p className="text-slate-400 font-bold italic">No data found matching your filters.</p>
            </div>
          ) : (
            data.map((item: any, idx) => (
              <div 
                key={item.name + idx} 
                className={`flex items-center gap-6 p-5 rounded-[28px] border transition-all duration-500 group relative ${item.isUser ? 'bg-emerald-50 border-emerald-200 shadow-xl z-20 scale-[1.02]' : 'bg-white border-slate-50 hover:border-slate-200 hover:shadow-xl hover:-translate-y-0.5'}`}
              >
                <div className="w-12 text-center font-black text-slate-300 text-lg flex flex-col items-center">
                  {idx === 0 ? <Medal className="w-8 h-8 text-amber-400 animate-bounce" /> : 
                   idx === 1 ? <Medal className="w-8 h-8 text-slate-300" /> : 
                   idx === 2 ? <Medal className="w-8 h-8 text-amber-700" /> : 
                   <span className="text-sm">#{idx + 1}</span>}
                </div>
                
                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center font-black text-slate-700 text-xl shadow-inner border-2 border-white ${getAvatarColor(item.name)} group-hover:rotate-6 transition-transform`}>
                  {item.badge || item.name.substring(0, 1)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className={`font-black text-lg tracking-tight ${item.isUser ? 'text-emerald-900' : 'text-slate-900'}`}>{item.name}</p>
                    {item.isUser && <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg">YOU</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                     <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {item.city}</p>
                     <div className="w-1 h-1 bg-slate-200 rounded-full" />
                     <p className="text-xs font-bold text-slate-400">{item.zones} Missions</p>
                  </div>
                </div>

                <div className="hidden sm:block px-8">
                  <Sparkline data={item.trend} />
                </div>

                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className={`font-black text-3xl tracking-tighter ${item.isUser ? 'text-emerald-700' : 'text-slate-900'}`}>{item.points.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Net Points</p>
                  </div>
                  <button className="p-3 bg-slate-50 text-slate-300 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group-hover:bg-slate-100 group-hover:text-slate-400">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

