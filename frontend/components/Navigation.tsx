'use client'

import React from 'react';
import { Compass, Zap, History, LayoutDashboard, BrainCircuit } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'map' | 'history' | 'about';
  setActiveTab: (tab: 'dashboard' | 'map' | 'history' | 'about') => void;
  onOpenRecent: () => void;
  onOpenAI: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onOpenRecent, onOpenAI }) => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-md bg-white/70 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:hidden safe-area-pb p-2">
      <div className="flex justify-between items-center h-16 px-2 relative">
        {/* Active Highlight Glow - Dynamic Position */}
        <div 
          className="absolute h-12 w-1/4 bg-slate-950 rounded-[24px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 shadow-xl shadow-slate-900/40"
          style={{ 
            left: activeTab === 'dashboard' ? '4px' : 
                  activeTab === 'history' ? 'calc(25% + 4px)' : 
                  activeTab === 'map' ? 'calc(50% + 4px)' : 
                  'calc(75% + 4px)',
            width: 'calc(25% - 8px)'
          }}
        />

        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`relative z-10 flex flex-col items-center justify-center flex-1 transition-all duration-500 ${activeTab === 'dashboard' ? 'text-white scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 leading-none">Feed</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('history')}
          className={`relative z-10 flex flex-col items-center justify-center flex-1 transition-all duration-500 ${activeTab === 'history' ? 'text-white scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <History className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 leading-none">Logs</span>
        </button>

        <button 
          onClick={() => setActiveTab('map')}
          className={`relative z-10 flex flex-col items-center justify-center flex-1 transition-all duration-500 ${activeTab === 'map' ? 'text-white scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 leading-none">Strategy</span>
        </button>

        <button 
          onClick={() => setActiveTab('about')}
          className={`relative z-10 flex flex-col items-center justify-center flex-1 transition-all duration-500 ${activeTab === 'about' ? 'text-white scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BrainCircuit className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 leading-none">Core</span>
        </button>
      </div>
    </nav>
  );
};
