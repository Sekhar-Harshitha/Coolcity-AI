'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type FloatXP = { id: string, amount: number, label: string, x: number, y: number, color: string };
type Toast = { id: string, type: 'success'|'warning'|'error'|'info'|'achievement', message: string, icon: string };

const GamificationContext = createContext<any>(null);

export function useGamification() { return useContext(GamificationContext); }

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [xps, setXps] = useState<FloatXP[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addXP = useCallback((amount: number, label: string, element: HTMLElement | null, color: string = 'var(--mint-500)') => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const id = Date.now().toString() + Math.random();
    
    // Check queue offset logic implicitly added via render mapping
    const newXP = { id, amount, label, x: rect.left + rect.width / 2, y: rect.top, color };
    setXps(prev => [...prev, newXP]);
    
    if (navigator.vibrate) navigator.vibrate(30);

    setTimeout(() => {
      setXps(prev => prev.filter(x => x.id !== id));
    }, 1200);
  }, []);

  const addToast = useCallback((type: Toast['type'], message: string, icon: string) => {
    const id = Date.now().toString();
    setToasts(prev => {
      const active = [...prev, { id, type, message, icon }];
      if (active.length > 3) return active.slice(-3);
      return active;
    });
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <GamificationContext.Provider value={{ addXP, addToast }}>
      {children}
      
      {/* Portals */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {xps.map((xp, i) => (
          <div key={xp.id} 
               className="absolute floating-xp-anim font-display font-bold px-3 py-1 rounded-full shadow-lg bg-white flex items-center gap-1"
               style={{ left: xp.x - 40 + (i*10), top: xp.y, color: xp.color }}>
            +{xp.amount} {xp.label}
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t, i) => (
          <div key={t.id} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-4 transform transition-all duration-300 ease-out flex items-center gap-3 w-80">
            <div className={`p-2 rounded-full ${t.type==='success'?'bg-mint-100':t.type==='warning'?'bg-peach-100':'bg-lavender-100'} text-2xl`}>
              {t.icon}
            </div>
            <div className="flex-1 font-bold text-gray-800 text-sm">
              {t.message}
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-xl" style={{ animation: 'shrink 4s linear forwards', width: '100%', color: 'inherit' }} />
          </div>
        ))}
      </div>
    </GamificationContext.Provider>
  );
}
