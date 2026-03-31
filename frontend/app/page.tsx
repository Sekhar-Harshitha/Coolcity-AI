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
import { useGamification } from '@/components/gamification/GamificationProvider';
import AIInsights from '@/components/intelligence/AIInsights'
import CoolingSimulator from '@/components/intelligence/CoolingSimulator'
import CityLeaderboard from '@/components/intelligence/CityLeaderboard'
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  History, 
  ThermometerSun, 
  Wind, 
  IndianRupee, 
  Layers, 
  Leaf,
  Activity,
  Zap,
  ChevronRight,
  Clock,
  ShieldAlert,
  BrainCircuit,
  Box,
  Compass,
  Trophy,
  ActivitySquare
} from 'lucide-react'

const MapViewer = dynamic(() => import('@/components/MapViewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50/50 backdrop-blur-xl animate-pulse flex flex-col items-center justify-center rounded-[40px] border border-slate-200/50">
      <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-6 shadow-xl shadow-emerald-500/10" />
      <div className="text-slate-900 font-display font-black text-2xl tracking-tighter">Initializing Intelligence Kernel...</div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em] mt-2">Connecting to Spatial API</p>
    </div>
  )
})

export default function Home() {
  const isOffline = useOfflineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'history' | 'about'>('dashboard');
  const [recentCount, setRecentCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { addToast } = useGamification();

  useEffect(() => {
    getRecentAnalyses(10).then(results => {
      setRecentCount(results.length);
    }).catch(e => console.error(e));
    
    setTimeout(() => setLoaded(true), 100);
  }, [isSyncing]);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      alert("✅ Professional Intelligence Dossier compiled! Redirecting to Municipal Command Dashboard.");
    }, 2500);
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] relative font-sans selection:bg-emerald-200">
      
      {/* Cinematic Environmental Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-50">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-gradient-to-br from-emerald-50 to-sky-100 rounded-full blur-[160px] opacity-20 animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[1200px] h-[1200px] bg-gradient-to-tr from-sky-50 to-indigo-50 rounded-full blur-[180px] opacity-15 animate-pulse-slow mix-blend-screen" style={{ animationDelay: '3s' }} />
      </div>

      {/* Decision Sidebar (SaaS Enterprise Architecture) */}
      <aside className={`hidden md:flex flex-col w-72 bg-white/70 backdrop-blur-3xl border-r border-slate-200/40 z-50 shadow-sm transition-all duration-1000 transform ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="p-10 pb-6">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-14 h-14 rounded-[20px] bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl shadow-slate-200 transition-all duration-500 group-hover:scale-105 group-hover:rotate-6">
              <BrainCircuit className="w-7 h-7 text-emerald-400 group-hover:animate-pulse shadow-glow-emerald" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-950 leading-none font-display">
                CoolCity
              </h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">AI Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-5 mt-10 space-y-2">
          <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 opacity-50">Decision Suite</p>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`group relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 focus:outline-none ${activeTab === 'dashboard' ? 'bg-slate-950 text-white shadow-2xl shadow-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-emerald-400 shadow-glow-emerald' : 'text-slate-300 group-hover:text-slate-950 transition-colors'}`} />
            <span className="font-bold text-sm tracking-tight font-display">Intelligence Feed</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('map')}
            className={`group relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 focus:outline-none ${activeTab === 'map' ? 'bg-slate-950 text-white shadow-2xl shadow-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'map' ? 'text-sky-400 shadow-glow' : 'text-slate-300 group-hover:text-slate-950 transition-colors'}`} />
            <span className="font-bold text-sm tracking-tight font-display">Strategy Explorer</span>
          </button>
 
          <button 
            onClick={() => setActiveTab('history')}
            className={`group relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 focus:outline-none ${activeTab === 'history' ? 'bg-slate-950 text-white shadow-2xl shadow-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <History className={`w-5 h-5 ${activeTab === 'history' ? 'text-amber-400 shadow-glow' : 'text-slate-300 group-hover:text-slate-950 transition-colors'}`} />
            <span className="font-bold text-sm tracking-tight font-display">Archival Logs</span>
          </button>
  
          <div className="pt-6 mt-6 border-t border-slate-100">
            <a href="/citizen" className="w-full h-16 flex items-center justify-between gap-4 px-5 group bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 rounded-2xl border border-emerald-100/50 transition-all duration-500 active:scale-95">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight font-display italic">Citizen Core</span>
              </div>
              <div className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-sm uppercase tracking-widest animate-pulse">Live</div>
            </a>
          </div>
        </nav>

        <div className="p-5 mt-auto mb-10">
          <div className="relative overflow-hidden p-6 bg-slate-950 border border-slate-800 rounded-[32px] group transition-all duration-500 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full translate-x-10 -translate-y-10" />
            <h4 className="text-[9px] font-black text-emerald-400/60 uppercase tracking-[0.4em] flex items-center gap-2 mb-4">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Core Status
            </h4>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                <div className={`absolute inset-0 rounded-2xl ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'} opacity-10 animate-ping`} />
                <div className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-500 shadow-glow-rose' : 'bg-emerald-400 shadow-glow-emerald'}`} />
              </div>
              <p className="text-sm font-black text-white tracking-tight uppercase italic scale-95 origin-left">
                {isOffline ? 'Offline Kernel' : 'Decision Active'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Analysis Architecture */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-y-auto custom-scrollbar relative z-10 pt-safe bg-slate-50/5">
        {/* Cinematic Decision Ticker - Architectural Brand Element */}
        <div className="w-full bg-slate-950 text-white/30 py-4 border-b border-white/5 flex items-center overflow-hidden h-12 select-none pointer-events-none">
           <div className="flex whitespace-nowrap animate-marquee-slowest text-[8px] md:text-[9px] font-black uppercase tracking-[0.6em] gap-32 px-12 italic">
              <span className="flex items-center gap-4 flex-shrink-0">● Urban Heat Index: <span className="text-rose-500 tracking-normal font-mono">Critical +2.47°C</span> (Threshold Breach)</span>
              <span className="flex items-center gap-4 flex-shrink-0">● Strategy Nodes: <span className="text-emerald-400 tracking-normal font-mono">1,942 Sync</span> (High Fidelity)</span>
              <span className="flex items-center gap-4 flex-shrink-0">● Predictive Core: <span className="text-sky-400 tracking-normal font-mono">Neural Phase II</span> (Modeling Meta)</span>
              <span className="flex items-center gap-4 flex-shrink-0">● Policy Alpha: <span className="text-amber-400 tracking-normal font-mono">Zone-4 Albedo</span> (Deploying)</span>
           </div>
        </div>
        
        <HeatAlertBanner />
        <SyncStatusBar isSyncing={isSyncing} />
        
        <div className="p-8 md:p-14 lg:p-20 flex-1 flex flex-col max-w-full w-full mx-auto pb-44 md:pb-20 gap-20 relative">
          
          {/* View Engine Dispatcher */}
          {activeTab === 'dashboard' ? (
            <div className="space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
                 <div className="space-y-6">
                    <CityHeatGoal />
                    <h2 className="text-6xl md:text-[6.5rem] font-display font-black text-slate-950 tracking-tight leading-[0.75] text-balance">
                       Urban Heat <span className="italic font-normal text-slate-300">Intelligence</span>
                    </h2>
                    <p className="text-xl md:text-3xl text-slate-500 font-medium max-w-3xl leading-snug tracking-tighter">
                       Architecting metropolitan cooling strategies via neural-spatial thermodynamic analysis.
                    </p>
                 </div>
                 <div className="flex flex-wrap items-center gap-5 xl:pb-6">
                    <div className="flex items-center gap-4 px-7 py-5 bg-white/70 backdrop-blur-3xl border border-slate-200 rounded-[32px] shadow-premium hover:shadow-2xl transition-all cursor-default group border-b-8 border-r-2 border-emerald-500/10">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse-slow shadow-glow-emerald" />
                      <span className="text-sm font-black text-slate-950 font-mono italic tracking-tighter uppercase">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </div>
                     <button 
                       onClick={handleGenerateReport}
                       className="px-12 py-5 bg-slate-950 text-white rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-[0_30px_70px_rgba(0,0,0,0.3)] active:scale-95 flex items-center gap-5 border-t border-white/10"
                       disabled={isGeneratingReport}
                     >
                       <Zap className={`w-5 h-5 ${isGeneratingReport ? 'animate-spin' : 'text-emerald-400 shadow-glow-emerald'}`} />
                       {isGeneratingReport ? 'Compiling Dossier...' : 'Strategic Decision Report'}
                     </button>
                 </div>
               </div>

               {/* AI Intelligence Suite */}
               <AIInsights />

               {/* High-Fidelity Performance Tier */}
               <CityLeaderboard />

               {/* Thermodynamic Intervention Sandbox */}
               <CoolingSimulator />

               {/* Archival Case Transforms */}
               <ImpactCaseStudies />
            </div>
          ) : activeTab === 'map' ? (
              <div className="absolute inset-0 z-10 animate-in fade-in duration-1200 scale-95 scale-in-100">
                <MapViewer setIsSyncing={setIsSyncing} />
              </div>
            ) : activeTab === 'history' ? (
              <HistoryTab onSwitch={() => setActiveTab('map')} />
            ) : (
                <div className="p-16 h-full overflow-y-auto custom-scrollbar bg-white/50 backdrop-blur-3xl rounded-[80px] border border-white/80 shadow-premium relative z-10 animate-in slide-in-from-bottom-16 duration-1200">
                  <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-xl shadow-slate-900/10">
                       <Box className="w-4.5 h-4.5 text-emerald-400" /> Platform Core v2.4
                    </div>
                    <h3 className="text-6xl md:text-8xl font-display font-black text-slate-950 mb-10 tracking-tight leading-[0.8]">Strategic Operating System</h3>
                    <p className="text-slate-500 text-2xl font-medium leading-relaxed mb-16 tracking-tight">
                      CoolCity AI is a mission-critical Urban Intelligence Engine designed to correct thermodynamic imbalances in metropolitan centers. By layering high-resolution spatial modeling over real-time sensor loops, we allow governance units to architect sustainable planetary interventions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                      <div className="p-12 bg-white shadow-premium rounded-[56px] border border-slate-50 group hover:-translate-y-4 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                        <div className="w-16 h-16 rounded-[22px] bg-rose-50 flex items-center justify-center mb-8 shadow-sm border border-rose-100 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                           <Zap className="w-8 h-8 text-rose-500 group-hover:text-white" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-950 mb-4 uppercase tracking-tighter font-display italic">Neural Analysis</h4>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-widest text-[10px]">Real-time pixel-level heat flux detection via deep atmospheric mesh syncing.</p>
                      </div>
                      <div className="p-12 bg-white shadow-premium rounded-[56px] border border-slate-50 group hover:-translate-y-4 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                        <div className="w-16 h-16 rounded-[22px] bg-emerald-50 flex items-center justify-center mb-8 shadow-sm border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                           <Leaf className="w-8 h-8 text-emerald-500 group-hover:text-white" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-950 mb-4 uppercase tracking-tighter font-display italic">Tactical Mitigation</h4>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-widest text-[10px]">Automated decision protocols for albedo correction and strategic afforestation.</p>
                      </div>
                    </div>
                    <div className="p-12 md:p-16 bg-slate-950 text-white rounded-[72px] relative overflow-hidden group border-b-[20px] border-emerald-500 shadow-3xl">
                       <div className="relative z-10">
                         <div className="flex items-center gap-6 mb-8">
                           <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center backdrop-blur-xl">
                             <BrainCircuit className="w-9 h-9 text-emerald-400 shadow-glow-emerald" />
                           </div>
                           <h4 className="text-3xl font-black tracking-tighter leading-none font-display">Decision Terminal <span className="text-emerald-400 italic">4.0</span></h4>
                         </div>
                         <p className="text-white/50 text-xl font-medium leading-snug tracking-tight">Architected for elite competition in the <span className="text-white font-black underline decoration-emerald-500 underline-offset-8 decoration-4">Smart City National Challenge 2024</span>. Intelligence for the modern, resilient metropolis.</p>
                       </div>
                       <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-1000" />
                    </div>
                  </div>
                </div>
            )}
        </div>
      </main>

      {/* Floating AI Strategist (Collision-Safe & High Polish) */}
      <div className="fixed bottom-40 md:bottom-12 right-6 md:right-12 z-[9999] pointer-events-auto group animate-in slide-in-from-right-16 duration-1200 delay-700">
         <div className="absolute bottom-28 right-0 w-80 md:w-[400px] bg-white/90 backdrop-blur-3xl p-10 rounded-[64px] rounded-br-[12px] shadow-[0_60px_120px_rgba(0,0,0,0.3)] border border-white/50 opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none group-hover:pointer-events-auto scale-90 origin-bottom-right group-hover:scale-100">
            <div className="flex items-center gap-5 mb-8 border-b border-slate-100 pb-8">
               <div className="w-14 h-14 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-glow-emerald animate-pulse">
                  <BrainCircuit className="w-8 h-8 shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
               </div>
               <div>
                 <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.5em] mb-1">Strategist Neural</h4>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none italic opacity-60">Engine Sync: 100%</p>
               </div>
            </div>
            <p className="text-xl font-bold text-slate-900 leading-snug tracking-tighter italic">
              "Strategic thermal surge detected in Sector 4. Recommend immediate <span className="text-emerald-600 underline underline-offset-8 decoration-emerald-500/30 decoration-4">Albedo Correction Phase I</span> to stabilize metropolitan flux index."
            </p>
            <div className="mt-10 flex gap-4">
               <button className="flex-1 py-4.5 bg-slate-950 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl active:scale-95 transition-all hover:bg-slate-800">Review Data</button>
               <button className="flex-1 py-4.5 bg-emerald-50 text-emerald-600 rounded-[24px] text-[10px] font-black uppercase tracking-[0.25em] border border-emerald-100 active:scale-95 transition-all hover:bg-emerald-100">Commit Loop</button>
            </div>
         </div>
         <button 
           onClick={() => setIsAIAdvisorOpen(true)}
           className="w-20 h-20 md:w-24 md:h-24 bg-slate-950 rounded-[32px] md:rounded-[40px] flex items-center justify-center shadow-[0_40px_80px_rgba(0,0,0,0.5)] hover:scale-110 hover:rotate-6 active:scale-90 transition-all duration-700 border-2 border-white/20 group relative overflow-hidden"
         >
             <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full scale-150" />
             <Zap className="w-9 h-9 md:w-11 md:h-11 text-emerald-400 group-hover:fill-emerald-400 transition-all relative z-10 drop-shadow-[0_0_20px_rgba(52,211,153,1)]" />
         </button>
      </div>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} onOpenRecent={() => setActiveTab('history')} onOpenAI={() => setIsAIAdvisorOpen(true)} />
      <AIAdvisorPanel isOpen={isAIAdvisorOpen} onClose={() => setIsAIAdvisorOpen(false)} />
      <InstallPWABanner />
    </div>
  )
}

function ImpactCaseStudies() {
  return (
    <div className="mt-24 space-y-16 animate-in slide-in-from-bottom-16 duration-1200">
       <div className="flex flex-col md:flex-row items-baseline justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-display font-black text-slate-950 tracking-tight leading-none text-balance">
               Impact <span className="text-slate-300 italic font-normal">Success Transforms</span> 
            </h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-1">Historical Archive of Thermodynamic Outcomes</p>
          </div>
          <div className="flex bg-slate-950 p-2.5 rounded-[32px] border border-white/5 shadow-3xl">
             <button className="px-10 py-4 bg-white text-[11px] font-black rounded-[24px] shadow-premium text-slate-950 uppercase tracking-widest transition-all">Municipal</button>
             <button className="px-10 py-4 text-white/40 text-[11px] font-black hover:text-white transition-colors uppercase tracking-widest">Global</button>
          </div>
       </div>

       <TransformationSlider 
         location="Jubilee Hills Hotspot Analysis"
         beforeImg="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200"
         afterImg="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200&sat=-50&hue=150"
         beforeTemp="42.8°C"
         afterTemp="39.2°C"
       />

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {[
            { tag: '-4.2°C Gain', title: 'Gachibowli Green Zone', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=400', color: 'text-emerald-600', icon: <Leaf className="w-7 h-7" /> },
            { tag: '+22% Albedo', title: 'Banjara Hills Roof-Scan', img: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=400', color: 'text-sky-600', icon: <Layers className="w-7 h-7" /> }
          ].map((item, i) => (
            <div key={i} className="group bg-white/60 backdrop-blur-3xl border border-white p-12 rounded-[72px] flex flex-col sm:flex-row items-center gap-12 hover:bg-slate-950 hover:text-white transition-all cursor-pointer shadow-premium hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] active:scale-[0.98] duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
               <div className="w-36 h-36 rounded-[48px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-all duration-1000 border-8 border-white/80 ring-1 ring-slate-100 flex-shrink-0">
                  <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Case" />
               </div>
               <div className="flex-1 space-y-5">
                  <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white/10 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-700">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-black text-4xl tracking-tighter mb-1 select-none leading-none">{item.title}</h4>
                    <p className={`text-[11px] font-black uppercase tracking-[0.5em] ${item.color} group-hover:text-emerald-400 transition-colors`}>{item.tag}</p>
                  </div>
               </div>
               <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white/10 group-hover:text-white transition-all duration-700">
                  <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
               </div>
            </div>
          ))}
       </div>
    </div>
  )
}

function HistoryTab({ onSwitch }: { onSwitch: () => void }) {
  const [history, setHistory] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getRecentAnalyses(20).then(setHistory);
  }, []);

  return (
    <div className="p-10 md:p-20 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-12 duration-1200 h-full bg-white/70 backdrop-blur-3xl rounded-[80px] border border-white/80 shadow-premium relative z-10">
      <div className="flex flex-col xl:flex-row items-center xl:items-end justify-between mb-24 gap-16">
        <div className="text-center xl:text-left max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-950 text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl">
             <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse shadow-glow-rose" /> Decentralized Intelligence Vault
          </div>
          <h3 className="text-7xl md:text-[6.5rem] font-display font-black text-slate-950 tracking-tight leading-[0.8] mb-4">Strategic Archival Logs</h3>
          <p className="text-slate-500 font-medium text-2xl leading-relaxed max-w-2xl mx-auto xl:mx-0 tracking-tight italic opacity-80">Secure immutable repository of metropolitan thermodynamic sequences compiled for governance.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
          <div className="flex bg-slate-950 p-2.5 rounded-[40px] border border-white/5 shadow-3xl overflow-x-auto no-scrollbar">
             {['All', 'Critical', 'Solved', 'Pending'].map(f => (
               <button key={f} onClick={() => setFilter(f)} className={`px-10 py-4 rounded-[30px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${filter === f ? 'bg-white text-slate-950 shadow-premium scale-105' : 'text-white/30 hover:text-white'}`}>{f}</button>
             ))}
          </div>
          <button onClick={onSwitch} className="text-[11px] font-black uppercase tracking-[0.3em] text-white bg-slate-950 px-14 py-6 rounded-[40px] hover:bg-slate-800 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.3)] active:scale-95 border-b-[8px] border-b-emerald-600/50">Initiate Strategy</button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="h-[600px] flex flex-col items-center justify-center text-center gap-12 opacity-30 grayscale p-24 bg-slate-50/50 rounded-[80px] border-6 border-dashed border-slate-100">
           <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-premium ring-8 ring-slate-50/50">
              <History className="w-14 h-14 text-slate-300" />
           </div>
           <div className="space-y-4">
              <p className="text-4xl font-black text-slate-950 uppercase tracking-[0.5em]">Vault is Cold</p>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Awaiting primary tactical sensor synchronization...</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {history.map((item, i) => (
            <div key={item.id || i} className="group bg-white p-14 rounded-[80px] border border-slate-100 shadow-premium hover:shadow-[0_80px_150px_rgba(0,0,0,0.15)] hover:-translate-y-6 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden box-border">
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-bl-[140px] -mr-14 -mt-14 group-hover:scale-150 group-hover:bg-rose-50 transition-all duration-1000" />
              <div className="flex justify-between items-start mb-16 relative z-10">
                <div className="w-24 h-24 rounded-[36px] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-950 group-hover:text-emerald-400 transition-all duration-1000 box-content border-[10px] border-white shadow-2xl">
                  <BrainCircuit className="w-10 h-10" />
                </div>
                <div className="text-right space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Sector Sync</span>
                  <p className="text-sm font-black text-slate-950 font-mono italic tracking-tighter">0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</p>
                </div>
              </div>
              <h4 className="font-display font-black text-5xl text-slate-950 mb-4 leading-[0.8] tracking-tighter select-none">Phase {i+1}<br /><span className="text-2xl text-slate-300 uppercase tracking-[0.3em] font-sans font-black italic">Thermal Scan</span></h4>
              <p className="text-[10px] font-black text-slate-400 mb-16 flex items-center gap-4 uppercase tracking-[0.3em]"><Clock className="w-5 h-5 text-slate-200" /> Archival Log Ind: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              
              <div className="grid grid-cols-2 gap-10 pt-14 border-t-2 border-slate-50 relative z-10">
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Flux Gain</p>
                  <p className="font-black text-emerald-600 text-[3.5rem] tracking-tighter leading-none">−{(1.2 + i * 0.4).toFixed(1)}°</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Conf Index</p>
                  <p className="font-black text-slate-950 text-[3.5rem] tracking-tighter leading-none">{94 + i}.<span className="text-slate-200">9</span></p>
                </div>
              </div>
              
              <div className="mt-10 flex items-center justify-between bg-slate-50 p-6 rounded-[40px] border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all duration-700">
                <div className="flex items-center gap-5">
                   <div className="w-3.5 h-3.5 rounded-full bg-slate-300 group-hover:bg-emerald-500 animate-pulse-slow shadow-glow-emerald" />
                   <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-slate-600 transition-colors">Digital Twin Sync</span>
                </div>
                <span className="text-xs font-black text-slate-950 font-mono tracking-tighter opacity-30 italic">Z4-OS-0{i}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

