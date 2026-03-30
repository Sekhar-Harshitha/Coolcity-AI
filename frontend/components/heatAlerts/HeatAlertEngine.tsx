'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Thermometer, MapPin, Wind, Leaf, Droplets, Droplet } from 'lucide-react';
import { useGamification } from '@/components/gamification/GamificationProvider';

export const HEAT_ALERTS = [
  { id: 1, type: 'critical', temp: 42.5, loc: 'Downtown Concrete Plaza', suggestion: 'Install emergency shade structures and water misters immediately.', reason: 'High concrete density, zero tree cover', lat: 12.9726, lng: 77.5956 },
  { id: 2, type: 'high', temp: 39.8, loc: 'Industrial Park South', suggestion: 'Add cool roofs to factory buildings.', reason: 'Dark rooftops absorbing radiation', lat: 12.9650, lng: 77.6000 },
  { id: 3, type: 'moderate', temp: 36.5, loc: 'Suburban Parking Lot B', suggestion: 'Plant trees around perimeter.', reason: 'Large unshaded asphalt area', lat: 12.9750, lng: 77.5850 },
  { id: 4, type: 'low', temp: 32.1, loc: 'Riverside Park Edge', suggestion: 'Monitor soil moisture levels.', reason: 'Slightly elevated temp near path', lat: 12.9800, lng: 77.5900 }
];

export const getAlertStyle = (type: string) => {
  if (type === 'critical') return { bg: 'bg-[var(--blush-50)]', border: 'border-[var(--blush-300)]', text: 'text-[var(--blush-700)]', icon: '🚨', label: 'Emergency', soft: 'bg-[var(--blush-100)] text-[var(--blush-700)]' };
  if (type === 'high') return { bg: 'bg-[var(--peach-50)]', border: 'border-[var(--peach-300)]', text: 'text-[var(--peach-700)]', icon: '🔥', label: 'High Risk', soft: 'bg-[var(--peach-100)] text-[var(--peach-700)]' };
  if (type === 'moderate') return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', icon: '⚠️', label: 'Warning', soft: 'bg-yellow-100 text-yellow-700' };
  return { bg: 'bg-[var(--mint-50)]', border: 'border-[var(--mint-300)]', text: 'text-[var(--mint-700)]', icon: 'ℹ️', label: 'Info', soft: 'bg-[var(--mint-100)] text-[var(--mint-700)]' };
};

export function HeatAlertBanner() {
  const [index, setIndex] = useState(0);
  const activeAlert = HEAT_ALERTS[index];
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useGamification();

  useEffect(() => {
    // Cycle alerts every 10 seconds if not open
    if (isOpen) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HEAT_ALERTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    // Fire toast natively on mount for critical ones
    if (activeAlert.type === 'critical') {
      addToast('error', `Extreme heat at ${activeAlert.loc}`, '🚨');
    }
  }, [index]);

  if (!activeAlert) return null;
  const s = getAlertStyle(activeAlert.type);

  return (
    <div className={`w-full ${s.bg} border-b ${s.border} px-4 py-3 cursor-pointer transition-all duration-300 relative group overflow-hidden`} onClick={() => setIsOpen(!isOpen)}>
      {activeAlert.type === 'critical' && (
        <div className="absolute inset-0 bg-[var(--blush-400)]/5 animate-pulse pointer-events-none" />
      )}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-xl animate-bounce">{s.icon}</span>
          <div>
            <h4 className={`font-bold ${s.text} flex items-center gap-2`}>
              {s.label} Heat Alert
              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest ${s.soft}`}>
                {activeAlert.temp}°C
              </span>
            </h4>
            <p className="text-sm font-medium text-gray-600 mt-0.5">Critical heat detected in selected zone: {activeAlert.loc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex gap-1">
             {HEAT_ALERTS.map((_, i) => (
               <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-gray-800 w-4' : 'bg-gray-300'}`} />
             ))}
           </div>
           <button className="ml-4 text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 transition-colors">Details &rarr;</button>
        </div>
      </div>

      {isOpen && (
        <div className="max-w-7xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-300 pb-2">
           <div className="bg-white rounded-[20px] p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="bg-[var(--mint-50)] p-3 rounded-full text-[var(--mint-600)]">
               <Leaf className="w-5 h-5" />
             </div>
             <div><p className="font-bold text-gray-800 text-sm">Plant Trees</p><p className="text-[10px] text-gray-400">Impact: High</p></div>
           </div>
           <div className="bg-white rounded-[20px] p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="bg-[var(--sky-50)] p-3 rounded-full text-[var(--sky-600)]">
               <Droplets className="w-5 h-5" />
             </div>
             <div><p className="font-bold text-gray-800 text-sm">Add Water Bodies</p><p className="text-[10px] text-gray-400">Impact: High</p></div>
           </div>
           <div className="bg-white rounded-[20px] p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="bg-[var(--lavender-50)] p-3 rounded-full text-[var(--lavender-600)]">
               <Cloud className="w-5 h-5" />
             </div>
             <div><p className="font-bold text-gray-800 text-sm">Shade Structures</p><p className="text-[10px] text-gray-400">Impact: Med</p></div>
           </div>
           <div className="bg-white rounded-[20px] p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="bg-gray-50 p-3 rounded-full text-gray-600">
               <Wind className="w-5 h-5" />
             </div>
             <div><p className="font-bold text-gray-800 text-sm">Add Cool Roofs</p><p className="text-[10px] text-gray-400">Impact: Med</p></div>
           </div>
        </div>
      )}
    </div>
  )
}
// Add explicit Lucide React icon not explicitly imported
import { Cloud } from 'lucide-react';
