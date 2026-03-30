'use client';
import { useState, useRef } from 'react';
import { ArrowLeftRight, Thermometer, Wind, ThermometerSnowflake } from 'lucide-react';

interface TransformationSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeTemp: string;
  afterTemp: string;
  location: string;
}

export default function TransformationSlider({ beforeImg, afterImg, beforeTemp, afterTemp, location }: TransformationSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (item: any) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = (item.clientX || item.touches[0].clientX) - left;
    const p = Math.max(0, Math.min(100, (x / width) * 100));
    setPosition(p);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-white group select-none">
       <div 
         ref={containerRef}
         onMouseMove={handleMove}
         onTouchMove={handleMove}
         className="relative aspect-video w-full overflow-hidden cursor-ew-resize"
       >
         {/* After Image (Background) */}
         <div className="absolute inset-0">
            <img src={afterImg} alt="After" className="w-full h-full object-cover filter saturate-[1.3] brightness-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--mint-500)]/20 to-transparent" />
            
            {/* After Label */}
            <div className={`absolute bottom-8 right-8 transition-all duration-500 ${position < 20 ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
               <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[24px] border border-white shadow-xl flex flex-col items-end">
                  <span className="text-[10px] font-black text-[var(--mint-600)] uppercase tracking-[0.2em] mb-1">Optimized Thermal Map</span>
                  <div className="flex items-center gap-3">
                     <ThermometerSnowflake className="w-6 h-6 text-[var(--mint-500)]" />
                     <span className="text-4xl font-display font-black text-gray-800">{afterTemp}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Before Image (Foreground + Clip) */}
         <div 
           className="absolute inset-0 z-10 pointer-events-none"
           style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
         >
            <img src={beforeImg} alt="Before" className="w-full h-full object-cover filter contrast-[1.1] brightness-90 grayscale-[0.2]" />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/30 to-transparent" />
            
            {/* Before Label */}
            <div className={`absolute bottom-8 left-8 transition-all duration-500 ${position > 80 ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
               <div className="bg-black/80 backdrop-blur-xl p-6 rounded-[24px] border border-white/20 shadow-xl flex flex-col items-start text-white">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Legacy Urban Heat Island</span>
                  <div className="flex items-center gap-3">
                     <Thermometer className="w-6 h-6 text-[var(--blush-500)]" />
                     <span className="text-4xl font-display font-black">{beforeTemp}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Slider Handle */}
         <div 
           className="absolute inset-y-0 z-20 w-1 bg-white cursor-ew-resize group-hover:w-1.5 transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]"
           style={{ left: `${position}%` }}
         >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-gray-100">
               <ArrowLeftRight className="w-6 h-6 text-gray-900" />
            </div>
         </div>
       </div>

       {/* Footer Info */}
       <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[16px] bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <Wind className="w-6 h-6 text-[var(--mint-500)]" />
             </div>
             <div>
                <p className="font-display font-black text-xl text-gray-800">{location}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Successful Intervention Study</p>
             </div>
          </div>
          <div className="flex gap-10">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cooling Score</span>
                <span className="text-2xl font-display font-black text-[var(--mint-600)]">+84%</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Energy Saved</span>
                <span className="text-2xl font-display font-black text-[var(--sky-600)]">18.4%</span>
             </div>
          </div>
       </div>
    </div>
  );
}
