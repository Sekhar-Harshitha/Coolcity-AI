'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { SyncStatusBar } from '@/components/SyncStatusBar'
import { InstallPWABanner } from '@/components/InstallPWABanner'
import { Navigation } from '@/components/Navigation'
import { useOfflineStatus } from '@/hooks/useOfflineStatus'
import { getRecentAnalyses } from '@/lib/offlineStore'
import { HeatAlertBanner } from '@/components/heatAlerts/HeatAlertEngine'
import TransformationSlider from '@/components/TransformationSlider'
import { AIAdvisorPanel } from '@/components/AIAdvisorPanel'
import { CityHeatGoal } from '@/components/CityHeatGoal'
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  History, 
  Settings, 
  ThermometerSun, 
  Wind, 
  IndianRupee, 
  Layers, 
  Leaf,
  Activity,
  Zap
} from 'lucide-react'

const MapViewer = dynamic(() => import('@/components/MapViewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50/50 backdrop-blur-xl animate-pulse flex flex-col items-center justify-center rounded-[40px] border border-slate-200/50">
      <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-6 shadow-xl" />
      <div className="text-slate-900 font-bold text-xl tracking-tight">Initializing Intelligence Engine...</div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Connecting to Spatial API</p>
    </div>
  )
})

export default function Home() {
  const isOffline = useOfflineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'history' | 'about'>('map');
  const [recentCount, setRecentCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);

  useEffect(() => {
    // Load summary stats on mount
    getRecentAnalyses(10).then(results => {
      setRecentCount(results.length);
    }).catch(e => console.error(e));
    
    // Entrance animation delay
    setTimeout(() => setLoaded(true), 100);
  }, [isSyncing]);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      
      {/* Dynamic Background Noise & Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-50">
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-slate-200 to-emerald-100 rounded-full blur-[120px] opacity-20 animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[900px] h-[900px] bg-gradient-to-tr from-sky-100 to-indigo-50 rounded-full blur-[140px] opacity-15 animate-pulse-slow mix-blend-screen" style={{ animationDelay: '3s' }} />
      </div>

      {/* Desktop Sidebar (Modern Enterprise SaaS) */}
      <aside className={`hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 z-50 shadow-sm transition-all duration-1000 transform ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="p-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl shadow-slate-200 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-emerald-400 fill-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                CoolCity
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">Urban Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-1.5">
          <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Navigation</p>
          
          <button 
            onClick={() => setActiveTab('map')}
            className={`group relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none ${activeTab === 'map' ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'map' ? 'text-white' : 'text-slate-400'}`} />
            <span className="font-semibold text-sm">Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${activeTab === 'map' ? 'text-slate-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <MapIcon className="w-5 h-5 text-slate-400" />
            Explorer
          </button>
  
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <History className={`w-5 h-5 ${activeTab === 'history' ? 'text-white' : 'text-slate-400'}`} />
            Historical Data
          </button>
 
          <a href="/citizen" className="w-full flex items-center justify-between gap-4 px-4 py-3.5 mt-4 group bg-gradient-to-r from-[var(--mint-500)]/10 to-transparent hover:from-[var(--mint-500)]/20 text-[var(--mint-700)] rounded-2xl border border-[var(--mint-200)] transition-all duration-500 hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="w-7 h-7 rounded-full bg-[var(--mint-100)] flex items-center justify-center text-[var(--mint-600)] group-hover:scale-110 transition-transform">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-wide">Citizen Mode</span>
            </div>
            <span className="px-2 py-0.5 bg-[var(--mint-500)] text-white text-[9px] font-black rounded-sm uppercase tracking-wider animate-pulse">New</span>
          </a>
        </nav>

        <div className="p-4 mt-auto mb-6">
          <div className="relative overflow-hidden p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:shadow-md transition-all duration-300">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Engine Status
            </h4>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100">
                <div className={`absolute inset-0 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'} opacity-20 animate-ping`} />
                <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500 shadow-amber-200' : 'bg-emerald-500 shadow-emerald-200'} shadow-lg`} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {isOffline ? 'Local Sync' : 'Real-time'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-y-auto custom-scrollbar relative z-10 pt-safe">
        {/* Global Impact Ticker - Professional Unique Feature */}
        <div className="w-full bg-slate-900 text-white/50 py-2.5 border-b border-white/5 flex items-center overflow-hidden">
           <div className="flex whitespace-nowrap animate-marquee-slower text-[11px] font-medium uppercase tracking-[0.15em] gap-12 px-6 italic">
              <span>● Global Heat Flux Index: <span className="text-emerald-400">−0.12°C</span> Trend</span>
              <span>● Citizen Reports Verified: <span className="text-sky-400">1,429</span></span>
              <span>● Mitigation Capacity: <span className="text-amber-400">12.4 MWh</span> Efficiency</span>
              <span>● Region Alert: <span className="text-rose-400">Bangalore CBD</span> Hotspot</span>
              <span>● Target Optimized: <span className="text-emerald-400">Hyderabad IT Hub</span></span>
           </div>
        </div>
        <HeatAlertBanner />
        <SyncStatusBar isSyncing={isSyncing} />
        
        <div className="p-8 md:px-12 md:py-10 flex-1 flex flex-col max-w-full w-full mx-auto pb-24 md:pb-10 gap-8">
          
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-700 delay-100 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <CityHeatGoal />
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-default group">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-semibold text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})}</span>
               </div>
               <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]">
                 Generate Report
               </button>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-150 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h2>
            <p className="text-base text-slate-500 mt-3 font-medium max-w-2xl">Monitor real-time urban heat indices and simulate mitigation strategies with high-precision AI models.</p>
          </div>


          {/* Bento Box Stats Row - Modern Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 mb-10 transition-all duration-700 delay-200 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="group min-h-[160px] bg-white border border-slate-200 shadow-sm rounded-2xl p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:bg-rose-100 transition-colors">
                    <ThermometerSun className="w-6 h-6 text-rose-500" />
                  </div>
                  <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase rounded-full border border-rose-100">+1.2° Surge</span>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Mean Temperature</h3>
                  <p className="text-4xl font-bold text-slate-900">34.2<span className="text-lg font-medium text-slate-400 ml-1">°C</span></p>
                </div>
              </div>
            </div>

            <div className="group min-h-[160px] bg-white border border-slate-200 shadow-sm rounded-2xl p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                    <Wind className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full border border-emerald-100">Optimal Range</span>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Potential Cooling</h3>
                  <p className="text-4xl font-bold text-slate-900">-2.8<span className="text-lg font-medium text-slate-400 ml-1">°C</span></p>
                </div>
              </div>
            </div>

            <div className="group min-h-[160px] bg-white border border-slate-200 shadow-sm rounded-2xl p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100 group-hover:bg-sky-100 transition-colors">
                    <IndianRupee className="w-6 h-6 text-sky-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Available Budget</h3>
                  <p className="text-4xl font-bold text-slate-900">1.2<span className="text-lg font-medium text-slate-400 ml-1">Cr</span></p>
                </div>
              </div>
            </div>

            <div className="group min-h-[160px] bg-slate-900 shadow-lg shadow-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer" onClick={() => setIsAIAdvisorOpen(true)}>
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[9px] font-bold uppercase text-emerald-400 animate-pulse tracking-widest">Active Scan</span>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Sensor Network</h3>
                  <p className="text-4xl font-bold text-white">{recentCount || 14}<span className="text-lg font-medium text-white/40 ml-2">Units</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Toggleable Map / History Section */}
          <div className={`flex-1 min-h-[500px] w-full relative flex flex-col bg-slate-50 rounded-[32px] overflow-hidden shadow-premium border border-slate-200 transition-all duration-1000 delay-300 ${loaded ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'}`}>
            {activeTab === 'map' ? (
              <div className="absolute inset-0 z-10">
                <MapViewer setIsSyncing={setIsSyncing} />
              </div>
            ) : (
              <div className="p-10 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500 h-full bg-white">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Historical Simulations</h3>
                    <p className="text-sm text-slate-500 mt-1">Review and compare past urban transformation models.</p>
                  </div>
                  <button onClick={() => setActiveTab('map')} className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-colors">Explorer View</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-lavender-50 group-hover:text-lavender-500 transition-colors">
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500 uppercase tracking-widest">ID: #ZC-{i * 124}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">Central Business District</h4>
                      <p className="text-sm text-slate-500 mb-6">Simulation completed on Jan {i+10}, 2024</p>
                      <div className="flex items-center gap-6 pt-5 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Efficiency</p>
                          <p className="font-bold text-emerald-600 text-lg">−{(1.2 + i * 0.3).toFixed(1)}°C</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Investment</p>
                          <p className="font-bold text-slate-700 text-lg">₹{i}.L</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Impact Gallery Section */}
          <div className="mt-16 space-y-10 animate-in slide-in-from-bottom-12 duration-1000 delay-300">
             <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-4xl font-display font-black text-gray-900 tracking-tight flex items-center gap-4 group">
                     Impact Case Studies 
                     <div className="w-8 h-8 rounded-full bg-[var(--mint-100)] flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
                        <Wind className="w-4 h-4 text-[var(--mint-500)]" />
                     </div>
                  </h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Live Thermal Transformations</p>
                </div>
                <div className="flex bg-white/20 p-1 rounded-full border border-white">
                   <button className="px-4 py-1.5 bg-white text-xs font-black rounded-full shadow-sm">Hills District</button>
                   <button className="px-4 py-1.5 text-gray-500 text-xs font-bold hover:text-gray-800 transition-colors">IT Corridor</button>
                </div>
             </div>

             <TransformationSlider 
               location="Jubilee Hills Hotspot Analysis"
               beforeImg="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200"
               afterImg="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200&sat=-50&hue=150"
               beforeTemp="42.8°C"
               afterTemp="39.2°C"
             />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/40 border border-white p-6 rounded-[32px] flex items-center gap-6 group hover:bg-white/80 transition-all cursor-pointer">
                   <div className="w-20 h-20 rounded-[24px] overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                      <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Case" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-display font-black text-lg text-gray-800">Gachibowli Green Zone</h4>
                      <p className="text-xs font-bold text-[var(--mint-600)]">−4.2°C Thermal Reduction</p>
                   </div>
                </div>
                <div className="bg-white/40 border border-white p-6 rounded-[32px] flex items-center gap-6 group hover:bg-white/80 transition-all cursor-pointer">
                   <div className="w-20 h-20 rounded-[24px] overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                      <img src="https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Case" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-display font-black text-lg text-gray-800">Banjara Hills Roof-Scan</h4>
                      <p className="text-xs font-bold text-[var(--sky-600)]">+22% Albedo Improvement</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-24 right-4 z-[9999] pointer-events-auto group">
         <div className="absolute bottom-16 right-0 w-64 bg-white/90 backdrop-blur-xl p-4 rounded-[24px] rounded-br-[4px] shadow-[0_12px_30px_rgba(0,0,0,0.1)] border border-[var(--mint-200)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
            <h4 className="text-[10px] font-black uppercase text-[var(--mint-600)] tracking-widest mb-1">AI Assistant</h4>
            <p className="text-sm font-bold text-gray-800">"Try adding trees in this critical heat zone to drop temps by 1.2°C."</p>
         </div>
         <button className="w-14 h-14 bg-gradient-to-br from-[var(--mint-400)] to-[var(--sky-500)] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(56,189,248,0.4)] hover:scale-110 active:scale-95 transition-transform border-2 border-white">
             <Activity className="w-6 h-6 text-white" />
         </button>
      </div>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} onOpenRecent={() => setActiveTab('history')} onOpenAI={() => setIsAIAdvisorOpen(true)} />
      <AIAdvisorPanel isOpen={isAIAdvisorOpen} onClose={() => setIsAIAdvisorOpen(false)} />
      <InstallPWABanner />
    </div>
  )
}
