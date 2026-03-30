'use client'

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end md:items-center md:justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full md:w-[480px] max-h-[85dvh] bg-[var(--bg-card)] backdrop-blur-2xl border border-[var(--border-soft)] shadow-2xl rounded-t-[40px] md:rounded-[40px] flex flex-col animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-300 overflow-hidden"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-4 pb-2 md:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[var(--border-medium)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <h2 className="text-xl font-serif font-black text-[var(--text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--lavender-100)] text-[var(--text-muted)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 pb-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
