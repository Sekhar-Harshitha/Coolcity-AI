'use client';
import { useState, useEffect, useMemo } from 'react';
import { Leaf, AlertTriangle, MapPin, Trophy, CloudSnow, Flame, TreePine, Bell, Clock, Search, Filter, Heart, ShieldCheck } from 'lucide-react';
import { useGamification } from './GamificationProvider';

const mockFeedBase = [
  { id: 1, type: 'tree_present', name: 'Aditya Sharma', loc: 'Jubilee Hills', points: 20, time: '2 mins ago', badge: '🏆', category: 'Trees' },
  { id: 2, type: 'bare_ground', name: 'Priya Nair', loc: 'HITEC City', points: 15, time: '14 mins ago', badge: '⚡', category: 'Heat Zones' },
  { id: 3, type: 'tree_degraded', name: 'Rohan Mehta', loc: 'Banjara Hills', points: 15, time: '1 hour ago', badge: '⚡', category: 'Trees' },
  { id: 4, type: 'green_roof', name: 'Sneha Reddy', loc: 'Gachibowli', points: 25, time: '3 hours ago', badge: '🏆', category: 'Cooling' },
  { id: 5, type: 'tree_present', name: 'Arjun Iyer', loc: 'Kondapur', points: 20, time: '5 hours ago', badge: '🛡️', category: 'Trees' },
  { id: 6, type: 'tree_absent', name: 'Meera Patel', loc: 'Madhapur', points: 10, time: '8 hours ago', badge: '🌿', category: 'Alerts' },
  { id: 7, type: 'tree_present', name: 'Vikram Rao', loc: 'Kukatpally', points: 20, time: '12 hours ago', badge: '🔬', category: 'Trees' },
  { id: 8, type: 'tree_degraded', name: 'Kavitha Singh', loc: 'Ameerpet', points: 15, time: '1 day ago', badge: '🌱', category: 'Trees' },
];

export default function CommunityFeed() {
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState(mockFeedBase);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addXP, addToast } = useGamification();
  const [likedItems, setLikedItems] = useState<number[]>([]);

  useEffect(() => {
    const fetchFeed = async () => {
      setIsRefreshing(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/citizen/feed`);
        if (!response.ok) throw new Error();
        const liveData = await response.json();
        
        const formattedLive = liveData.map((r: any) => ({
          id: r.id,
          type: r.status === 'healthy' ? 'tree_present' : r.status === 'critical' ? 'tree_absent' : 'tree_degraded',
          name: r.username,
          loc: `Lat: ${r.lat.toFixed(2)}`,
          points: r.awarded_points,
          time: 'Just now',
          badge: '🌿',
          category: r.status === 'critical' ? 'Alerts' : 'Trees'
        }));

        setItems([...formattedLive, ...mockFeedBase]);
      } catch (err) {
        setItems(mockFeedBase);
      } finally {
        setTimeout(() => setIsRefreshing(false), 800);
      }
    };

    fetchFeed();
  }, [filter]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchFilter = filter === 'All' || item.category === filter;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.loc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [items, filter, searchQuery]);

  const getStyle = (type: string) => {
    switch(type) {
      case 'tree_present': return { pill: 'bg-emerald-100 text-emerald-700', b: 'border-emerald-100', label: 'Healthy Tree', icon: <TreePine className="w-3 h-3" /> };
      case 'tree_absent': return { pill: 'bg-rose-100 text-rose-700', b: 'border-rose-100', label: 'Concrete Heat', icon: <Flame className="w-3 h-3" /> };
      case 'tree_degraded': return { pill: 'bg-amber-100 text-amber-700', b: 'border-amber-100', label: 'Degraded Tree', icon: <AlertTriangle className="w-3 h-3" /> };
      case 'green_roof': return { pill: 'bg-sky-100 text-sky-700', b: 'border-sky-100', label: 'Green Roof', icon: <CloudSnow className="w-3 h-3" /> };
      default: return { pill: 'bg-slate-100 text-slate-700', b: 'border-slate-100', label: 'Bare Ground', icon: <MapPin className="w-3 h-3" /> };
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-premium">
       {/* Feed Header */}
       <div className="p-8 pb-4 border-b border-slate-50">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Citizen Feed</h2>
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Bell className="w-3 h-3" /> Live
             </div>
          </div>

          <div className="flex flex-col gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search locations or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-100 focus:bg-white transition-all transition-all"
                />
             </div>

             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['All', 'Trees', 'Heat Zones', 'Alerts', 'Cooling'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)} 
                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${filter === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
                  >
                    {f}
                  </button>
                ))}
             </div>
          </div>
       </div>

       {/* Feed Content */}
       <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar transition-all duration-500 ${isRefreshing ? 'opacity-40 grayscale blur-[2px]' : 'opacity-100'}`}>
          {filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-6 h-6 text-slate-300" />
               </div>
               <p className="font-bold text-slate-400">No reports found for this filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 pb-20">
              {filteredItems.map((item, idx) => {
                const s = getStyle(item.type);
                return (
                  <div key={`${item.id}-${idx}`} className="group bg-white border border-slate-50 rounded-[28px] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}>
                     <div className="relative w-full aspect-[2/1] overflow-hidden bg-slate-100">
                        <img 
                          src={`https://picsum.photos/seed/${item.loc.replace(' ','') + item.category}/600/300`} 
                          alt="Citizen Scan" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/20 flex items-center gap-1.5 ${s.pill}`}>
                          {s.icon} {s.label}
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                           <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center font-black text-white text-xs">
                              {item.name.substring(0,2).toUpperCase()}
                           </div>
                           <div className="text-white">
                              <p className="text-xs font-black drop-shadow-md">{item.name} {item.badge}</p>
                              <div className="flex items-center gap-1 text-[10px] font-bold opacity-80">
                                 <Clock className="w-3 h-3" /> {item.time}
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="p-5 flex items-center justify-between border-t border-slate-50">
                        <div className="flex items-center gap-6">
                           <button 
                             onClick={() => {
                                if (!likedItems.includes(item.id)) {
                                    setLikedItems([...likedItems, item.id]);
                                    addXP(1, 'Social', null);
                                    addToast('success', 'You applauded an environmental report! 🌿', '👏');
                                }
                             }}
                             className={`flex items-center gap-1.5 transition-all ${likedItems.includes(item.id) ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-500'}`}
                           >
                              <Heart className={`w-4 h-4 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{likedItems.includes(item.id) ? 'Loved' : 'Applaud'}</span>
                           </button>
                           <button 
                             onClick={() => addToast('info', 'Report verification protocol initiated...', '🛡️')}
                             className="flex items-center gap-1.5 text-slate-400 hover:text-sky-500 transition-all"
                           >
                              <ShieldCheck className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Verify</span>
                           </button>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                              <span className="text-[11px] font-black text-emerald-600">+{item.points} XP</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )
              })}
            </div>
          )}
       </div>
    </div>
  )
}

