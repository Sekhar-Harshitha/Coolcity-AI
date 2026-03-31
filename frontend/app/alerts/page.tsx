'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Thermometer, Activity, CloudFog, MapPin, BellRing } from 'lucide-react';
import { HEAT_ALERTS, getAlertStyle, HeatAlertBanner } from '@/components/heatAlerts/HeatAlertEngine';
import { Navigation } from '@/components/Navigation';
import { useGamification } from '@/components/gamification/GamificationProvider';

export default function AlertDashboard() {
  const activeCount = HEAT_ALERTS.length;
  const { addToast } = useGamification();
  const [notified, setNotified] = useState(false);
  
  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--bg-primary)] text-gray-800 font-body pb-20 md:pb-0 overflow-y-auto w-full">
      <HeatAlertBanner />

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8 pt-safe">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
           <div className="flex items-center gap-6">
             <Link href="/" className="p-4 bg-white border border-gray-100 rounded-[20px] hover:bg-gray-50 transition-all flex items-center justify-center text-[var(--lavender-600)]">
               <ArrowLeft className="w-5 h-5" />
             </Link>
             <div>
               <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight flex items-center gap-3 text-gray-900">
                 Alert Dashboard
               </h1>
               <p className="text-sm font-bold text-gray-500 mt-2 flex items-center gap-2">
                 <BellRing className="w-4 h-4 text-[var(--blush-500)]" /> Active city-wide thermal warnings
               </p>
             </div>
           </div>
           
           <div className="bg-white p-3 rounded-full border border-gray-100 flex gap-2">
             <span className="px-4 py-2 bg-[var(--lavender-50)] text-[var(--lavender-700)] font-bold text-sm rounded-full">Live Monitor</span>
             <span className="px-4 py-2 text-gray-500 font-bold text-sm rounded-full cursor-pointer hover:bg-gray-50">History</span>
           </div>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[var(--blush-200)] p-5 rounded-[20px]">
            <h4 className="text-[10px] font-black uppercase text-[var(--blush-500)] tracking-widest mb-2">Critical Zones</h4>
            <p className="text-4xl font-display font-black text-gray-900">1</p>
          </div>
          <div className="bg-white border border-[var(--peach-200)] p-5 rounded-[20px]">
            <h4 className="text-[10px] font-black uppercase text-[var(--peach-500)] tracking-widest mb-2">High Risk</h4>
            <p className="text-4xl font-display font-black text-gray-900">2</p>
          </div>
          <div className="bg-white border border-yellow-200 p-5 rounded-[20px]">
             <h4 className="text-[10px] font-black uppercase text-yellow-500 tracking-widest mb-2">Moderate</h4>
            <p className="text-4xl font-display font-black text-gray-900">1</p>
          </div>
          <div className="bg-white border border-[var(--mint-200)] p-5 rounded-[20px]">
             <h4 className="text-[10px] font-black uppercase text-[var(--mint-500)] tracking-widest mb-2">Safe Zones</h4>
            <p className="text-4xl font-display font-black text-gray-900">14</p>
          </div>
        </div>

        {/* Heat Alerts List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800">Active Alerts</h2>
          {HEAT_ALERTS.map((alert) => {
            const s = getAlertStyle(alert.type);
            return (
              <div key={alert.id} className={`${s.bg} border ${s.border} rounded-[20px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors`}>
                <div className="flex items-start md:items-center gap-4">
                   <div className="text-3xl">{s.icon}</div>
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest ${s.soft}`}>
                         {s.label}
                       </span>
                       <span className={`font-bold ${s.text} font-display text-lg`}>{alert.temp}°C</span>
                     </div>
                     <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {alert.loc}</h3>
                     <p className="text-sm font-medium text-gray-600 mt-1">{alert.reason}</p>
                   </div>
                </div>
                
                <div className="bg-white/50 px-4 py-3 rounded-[16px] border border-white max-w-sm">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Suggested Action</p>
                  <p className="text-sm font-bold text-gray-800">{alert.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <Navigation 
        activeTab={"about" as any} 
        setActiveTab={() => {}} 
        onOpenRecent={() => {}} 
        onOpenAI={() => {}}
      />
    </div>
  )
}
