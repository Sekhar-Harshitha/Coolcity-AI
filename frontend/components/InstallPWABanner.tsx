'use client'

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export const InstallPWABanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show only after a slight delay
      setTimeout(() => setIsVisible(true), 100); // For demo, making it visible 
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Initial development visibility hack
    const timer = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
       // Just a fallback close for the demo
       setIsVisible(false);
       return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-6 right-6 z-[2000] md:bottom-10 md:left-auto md:right-10 md:w-[420px] animate-in slide-in-from-bottom-12 duration-700">
      <div className="bg-slate-900 shadow-2xl rounded-[32px] p-8 flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-6 right-6 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all hover:scale-110 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex gap-6 items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 shadow-xl border border-white/10">
            <Smartphone className="w-7 h-7" />
          </div>
          <div className="flex-1 space-y-1">
             <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-lg tracking-tight">Offline Intelligence</h4>
                <Sparkles className="w-4 h-4 text-emerald-400" />
             </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Install the CoolCity-AI native app for field reports and real-time offline syncing.</p>
          </div>
        </div>
        
        <Button 
          onClick={handleInstall}
          className="w-full bg-white hover:bg-slate-50 text-slate-900 rounded-2xl h-14 font-bold text-base transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-950/20 flex gap-3"
        >
          Add to Home Screen <Download className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

