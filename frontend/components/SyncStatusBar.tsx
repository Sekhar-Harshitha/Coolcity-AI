'use client'

import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

interface SyncStatusBarProps {
  isSyncing: boolean;
}

export const SyncStatusBar: React.FC<SyncStatusBarProps> = ({ isSyncing }) => {
  const isOffline = useOfflineStatus();

  return (
    <div className="fixed top-6 right-6 z-[1100] flex items-center gap-3">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-sm border transition-all duration-500 ${
        isOffline 
        ? 'bg-[var(--peach-50)] border-[var(--peach-200)] text-[var(--peach-600)]' 
        : isSyncing 
          ? 'bg-[var(--lavender-50)] border-[var(--lavender-200)] text-[var(--lavender-600)]' 
          : 'bg-[var(--mint-50)] border-[var(--mint-200)] text-[var(--mint-600)]'
      }`}>
        {isSyncing ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : isOffline ? (
          <WifiOff className="w-4 h-4" />
        ) : (
          <Wifi className="w-4 h-4" />
        )}
        
        <span className="text-xs font-bold uppercase tracking-wider">
          {isSyncing ? 'Syncing...' : isOffline ? 'Offline Mode' : 'Connected'}
        </span>
        
        <div className={`w-2 h-2 rounded-full ${
          isSyncing 
          ? 'bg-[var(--lavender-400)] animate-pulse' 
          : isOffline 
            ? 'bg-[var(--peach-400)]' 
            : 'bg-[var(--mint-400)]'
        }`} />
      </div>
    </div>
  );
};
