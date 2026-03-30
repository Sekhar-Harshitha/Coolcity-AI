'use client'

import React from 'react';
import { Map, Zap, History, LayoutDashboard } from 'lucide-react';

interface NavigationProps {
  activeTab: 'map' | 'history' | 'about';
  setActiveTab: (tab: 'map' | 'history' | 'about') => void;
  onOpenRecent: () => void;
  onOpenAI: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onOpenRecent, onOpenAI }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-xl border-t border-slate-200/80 md:hidden safe-area-pb">
      <div className="flex justify-around items-center h-20 px-6">
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'map' ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LayoutDashboard className={`w-6 h-6 ${activeTab === 'map' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
        </button>
        
        <button 
          onClick={onOpenRecent}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'history' ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <History className={`w-6 h-6 ${activeTab === 'history' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
        </button>

        <div className="relative -top-10">
          <div className="absolute inset-0 bg-slate-900 blur-2xl opacity-20 rounded-full animate-pulse" />
          <button 
            onClick={onOpenAI}
            className="relative p-5 rounded-[22px] bg-slate-900 text-white shadow-xl shadow-slate-200 active:scale-90 transition-all border-[6px] border-white"
          >
            <Zap className="w-7 h-7" />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1.5 transition-all text-slate-400 hover:text-slate-600`}
        >
          <Map className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Explorer</span>
        </button>
      </div>
    </nav>
  );
};

