'use client'

import { useState } from 'react'
import { Trophy, ArrowLeft, Camera, Users, Award, Sparkles } from 'lucide-react'
import Link from 'next/link'
import CitizenMode from '@/components/gamification/CitizenMode'
import Leaderboard from '@/components/gamification/Leaderboard'
import CitizenProfile from '@/components/gamification/CitizenProfile'
import CommunityFeed from '@/components/gamification/CommunityFeed'

export default function CitizenGamificationPage() {
  const [activeTab, setActiveTab] = useState<'scan' | 'leaderboard' | 'profile'>('scan')

  return (
    <div className="h-[100dvh] w-full bg-[#f8f7fb] text-gray-800 flex flex-col relative overflow-hidden font-body font-medium">
      
      {/* Ultra-Premium Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-80">
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
          <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[var(--mint-200)] to-[var(--sky-200)] rounded-full blur-[120px] opacity-60 animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[800px] h-[800px] bg-gradient-to-tr from-[var(--lavender-200)] to-[#fdf2f8] rounded-full blur-[140px] opacity-50 mix-blend-multiply" />
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-gradient-to-r from-[var(--peach-100)] to-transparent rounded-full blur-[100px] opacity-40 mix-blend-screen" />
      </div>

      <main className="flex-1 overflow-y-auto z-10 px-4 md:px-10 pt-8 pb-24 md:pb-12 custom-scrollbar relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
          
          <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 relative">
            <div className="absolute -left-10 top-0 w-32 h-32 bg-[var(--lavender-200)] rounded-full blur-3xl opacity-30 pointer-events-none" />
            
            <div className="flex items-center gap-6 relative z-10">
              <Link href="/" className="p-4 bg-white/70 backdrop-blur-xl border border-white rounded-[24px] hover:bg-white hover:scale-105 transition-all shadow-[0_8px_32px_rgba(167,139,250,0.15)] flex items-center justify-center text-[var(--lavender-700)]">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight flex items-center gap-3 text-slate-900 drop-shadow-sm">
                  Citizen Mode 
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-yellow-200 blur-xl opacity-50 rounded-full" />
                    <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-500 relative z-10 drop-shadow-md" />
                  </div>
                </h1>
                <p className="text-base font-bold text-gray-400 mt-2 tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--lavender-500)]" />
                  Play your part. Earn rewards. Cool the city.
                </p>
              </div>
            </div>

            <div className="flex bg-white/60 backdrop-blur-3xl p-2 rounded-[32px] border border-white shadow-xl relative z-10 w-full xl:w-auto overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('scan')} 
                className={`flex-1 md:flex-none px-8 py-4 rounded-[24px] text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 ${activeTab === 'scan' ? 'bg-slate-900 text-white shadow-2xl scale-100' : 'text-slate-400 hover:text-slate-900 hover:bg-white/50 scale-95'}`}
              >
                <Camera className="w-4 h-4" /> Scan Anomaly
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')} 
                className={`flex-1 md:flex-none px-8 py-4 rounded-[24px] text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 ${activeTab === 'leaderboard' ? 'bg-slate-900 text-white shadow-2xl scale-100' : 'text-slate-400 hover:text-slate-900 hover:bg-white/50 scale-95'}`}
              >
                <Users className="w-4 h-4" /> Global Leaders
              </button>
              <button 
                onClick={() => setActiveTab('profile')} 
                className={`flex-1 md:flex-none px-8 py-4 rounded-[24px] text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-2xl scale-100' : 'text-slate-400 hover:text-slate-900 hover:bg-white/50 scale-95'}`}
              >
                <Award className="w-4 h-4" /> My Progress
              </button>
            </div>
          </header>

          <div className="w-full relative z-10 transition-all duration-500 ease-out min-h-0">
            {activeTab === 'scan' && (
              <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-10 xl:gap-12 items-start w-full animate-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                <div className="w-full flex flex-col gap-6">
                   <div className="flex items-center gap-3 ml-2">
                     <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg">01</div>
                     <h2 className="text-2xl font-display font-black tracking-tight text-slate-800 uppercase italic">Intelligence Report</h2>
                   </div>
                   <CitizenMode />
                </div>
                <div className="hidden lg:flex flex-col gap-6 h-[800px] w-full sticky top-8">
                   <div className="flex items-center gap-3 ml-2">
                     <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-lg">02</div>
                     <h2 className="text-2xl font-display font-black tracking-tight text-slate-800 uppercase italic">Live Network</h2>
                   </div>
                   <CommunityFeed />
                </div>
              </div>
            )}
            
            {activeTab === 'leaderboard' && (
              <div className="w-full animate-in zoom-in-95 duration-700 fill-mode-both">
                 <Leaderboard />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="w-full animate-in slide-in-from-right-12 duration-700 fill-mode-both">
                <CitizenProfile />
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
