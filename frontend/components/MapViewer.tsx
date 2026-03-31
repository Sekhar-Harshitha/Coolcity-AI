'use client'

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Rectangle, CircleMarker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { saveAnalysis, getAnalysis } from '@/lib/offlineStore';
import { analyzeRegion } from '@/lib/api';
import SimulationPanel from './SimulationPanel';
import { Button } from './ui/button';
import { 
  Search, 
  MapPin, 
  Layers, 
  Flame, 
  Box, 
  Zap, 
  BarChart3, 
  Leaf, 
  Compass, 
  Satellite, 
  Wind, 
  Droplets,
  Radio,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { HEAT_ALERTS, getAlertStyle } from '@/components/heatAlerts/HeatAlertEngine';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet icons
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const HEAT_COLORS: Record<string, string> = {
  high: '#ef4444', 
  medium: '#f59e0b', 
  low: '#10b981', 
};

interface MapViewerProps {
  setIsSyncing: (val: boolean) => void;
}

const SelectionHandler = ({ selectionMode, onSelectionEnd }: { selectionMode: boolean, onSelectionEnd: (bbox: L.LatLngBounds) => void }) => {
  const [start, setStart] = useState<L.LatLng | null>(null);
  const [current, setCurrent] = useState<L.LatLng | null>(null);
  const map = useMap();

  const startSelection = (latlng: L.LatLng) => {
    setStart(latlng);
    setCurrent(latlng);
    map.dragging.disable();
    if (window.navigator?.vibrate) window.navigator.vibrate(50);
  };

  useMapEvents({
    contextmenu: (e) => {
      L.DomEvent.preventDefault(e.originalEvent);
      if (!start) startSelection(e.latlng);
    },
    click: (e) => {
      if (selectionMode) {
        if (!start) startSelection(e.latlng);
        else {
          const bounds = L.latLngBounds(start, e.latlng);
          onSelectionEnd(bounds);
          setStart(null);
          setCurrent(null);
          map.dragging.enable();
        }
      }
    },
    mousemove: (e) => {
      if (start) {
        setCurrent(e.latlng);
        map.dragging.disable();
      }
    },
    mouseup: (e) => {
      if (start && !selectionMode) {
        const bounds = L.latLngBounds(start, current || e.latlng);
        onSelectionEnd(bounds);
        setStart(null);
        setCurrent(null);
        map.dragging.enable();
      }
    }
  });

  if (!start || !current) return null;

  return (
    <Rectangle 
      bounds={L.latLngBounds(start, current)} 
      pathOptions={{ 
        color: '#10b981', 
        weight: 3, 
        dashArray: '10, 10', 
        fillColor: '#10b981',
        fillOpacity: 0.1,
        className: 'animate-pulse'
      }} 
    />
  );
};

// Sensor Node Component
const SensorNode = ({ pos, temp, risk }: { pos: [number, number], temp: string, risk: string }) => {
  return (
    <CircleMarker
      center={pos}
      radius={6}
      pathOptions={{
        fillColor: risk === 'High' ? '#ef4444' : risk === 'Medium' ? '#f59e0b' : '#10b981',
        fillOpacity: 0.8,
        stroke: true,
        color: 'white',
        weight: 2,
        className: 'animate-pulse'
      }}
    >
      <Popup closeButton={false} className="custom-popup">
        <div className="p-5 bg-slate-950 text-white rounded-[32px] border border-white/10 shadow-2xl min-w-[180px]">
           <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${risk === 'High' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                 <Radio className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Sensor N-42</p>
           </div>
           <p className="text-4xl font-black tracking-tighter mb-2">{temp}<span className="text-xl text-white/20 ml-1">°C</span></p>
           <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
              <div className="space-y-0.5">
                 <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Risk Index</p>
                 <p className={`text-xs font-black uppercase ${risk === 'High' ? 'text-rose-500' : 'text-emerald-500'}`}>{risk}</p>
              </div>
              <Activity className="w-4 h-4 text-white/20" />
           </div>
        </div>
      </Popup>
    </CircleMarker>
  );
};

export default function MapViewer({ setIsSyncing }: MapViewerProps) {
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [activeLayer, setActiveLayer] = useState<'heat' | 'sensors' | 'solutions'>('heat');
  const [isDigitalTwin, setIsDigitalTwin] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);

  const analyzeZone = async () => {
    if (!bounds) return;
    setIsAnalyzing(true);
    setIsSyncing(true);
    
    const bboxStr = bounds.toBBoxString();
    
    try {
      const cached = await getAnalysis(bboxStr);
      if (cached) {
        setAnalysisData(cached);
        startReveal(cached.cells.length);
      } else {
        const liveData = await analyzeRegion(bounds);
        if (liveData) {
          setAnalysisData(liveData);
          await saveAnalysis(bboxStr, liveData);
          startReveal(liveData.cells.length);
        } else {
          await new Promise(r => setTimeout(r, 2000));
          const mockData = generateMockHeatData(bounds);
          setAnalysisData(mockData);
          await saveAnalysis(bboxStr, mockData);
          startReveal(mockData.cells.length);
        }
      }
    } finally {
      setIsAnalyzing(false);
      setIsSyncing(false);
    }
  };

  const startReveal = (count: number) => {
    setRevealIndex(-1);
    let i = 0;
    const interval = setInterval(() => {
      setRevealIndex(i);
      i++;
      if (i >= count) clearInterval(interval);
    }, 20);
  };

  const generateMockHeatData = (b: L.LatLngBounds) => {
    const cells = [];
    const nw = b.getNorthWest();
    const se = b.getSouthEast();
    const latStep = (nw.lat - se.lat) / 12;
    const lngStep = (se.lng - nw.lng) / 12;

    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
            const lat = nw.lat - (i * latStep) - (latStep / 2);
            const lng = nw.lng + (j * lngStep) + (lngStep / 2);
            const distCenter = Math.sqrt(Math.pow(i-6, 2) + Math.pow(j-6, 2));
            const intensity = Math.max(0, 1 - (distCenter / 10)) * (0.6 + Math.random() * 0.4);
            cells.push({
                lat, lng, 
                intensity,
                level: intensity > 0.6 ? 'high' : intensity > 0.3 ? 'medium' : 'low'
            });
        }
    }
    return { cells, areaM2: 50000 }; 
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950">
      {/* City Decision Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1001] pointer-events-none p-10 md:p-14">
         <div className="flex items-center justify-between w-full">
            <div className="bg-white/80 backdrop-blur-3xl border border-white p-6 rounded-[32px] md:rounded-[40px] shadow-2xl flex items-center gap-6 animate-in slide-in-from-top-12 duration-1000 pointer-events-auto">
               <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-400">
                  <Compass className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tighter leading-none">Strategy Explorer</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Metropolitan Digital Twin</p>
               </div>
            </div>

            <div className="hidden md:flex bg-slate-950/90 backdrop-blur-2xl border border-white/5 p-2 rounded-full shadow-2xl animate-in slide-in-from-top-12 duration-1000 pointer-events-auto">
               {[
                 { id: 'heat', label: 'Heat Index', icon: <Flame className="w-4 h-4" /> },
                 { id: 'sensors', label: 'Sensors', icon: <Radio className="w-4 h-4" /> },
                 { id: 'solutions', label: 'Solutions', icon: <ShieldCheck className="w-4 h-4" /> }
               ].map(l => (
                  <button 
                    key={l.id} 
                    onClick={() => setActiveLayer(l.id as any)}
                    className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeLayer === l.id ? 'bg-white text-slate-950 shadow-xl' : 'text-white/40 hover:text-white'}`}
                  >
                     <span className="flex items-center gap-3">{l.icon} {l.label}</span>
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Internal Scanning HUD */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-[20px] pointer-events-none animate-in fade-in duration-700">
          <div className="bg-white p-14 rounded-[72px] shadow-[0_50px_150px_rgba(0,0,0,0.3)] border border-white flex flex-col items-center gap-8 group">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-50 border-t-emerald-500 rounded-full animate-spin transition-all group-hover:scale-110 shadow-emerald-500/20" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-500 fill-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Analyzing Terrain DNA</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Syncing Cross-Layer Spatial Matrices</p>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Perspective Wrapper */}
      <div className={`w-full h-full transition-all duration-1500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isDigitalTwin ? '[transform:perspective(1200px)_rotateX(52deg)_rotateZ(-8deg)_scale(1.25)] shadow-[0_100px_200px_rgba(0,0,0,0.5)]' : ''}`}>
        
        {/* Dynamic Telemetry Panel */}
        <div className="absolute top-40 left-10 z-[600] flex flex-col gap-6 pointer-events-none md:max-w-[400px] max-w-[260px]">
           <div className="bg-white/80 backdrop-blur-3xl border border-white p-10 rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex flex-col gap-10 animate-in slide-in-from-left-12 duration-1000">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-slow shadow-emerald-400" />
                       <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Satellite: Lock</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono tracking-tighter leading-none italic">12.97° N<br /><span className="text-emerald-500">77.59° E</span></h3>
                 </div>
                 <div className="hidden lg:flex w-16 h-16 rounded-[22px] bg-slate-950 items-center justify-center text-white border border-slate-800 shadow-2xl">
                    <Satellite className="w-7 h-7 text-emerald-400" />
                 </div>
              </div>
              
              <div className="space-y-5">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Thermodynamic Load</p>
                       <p className="text-sm font-black text-rose-500 uppercase">Critical Threshold</p>
                    </div>
                    <span className="text-5xl font-black text-slate-950 tracking-tighter leading-none">74<span className="text-xl text-slate-300 ml-0.5">%</span></span>
                 </div>
                 <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200/50 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: analysisData ? '74%' : '68%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-slate-950 shadow-[0_0_20px_rgba(0,0,0,0.15)] rounded-full relative overflow-hidden" 
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </motion.div>
                 </div>
              </div>
           </div>
        </div>
        
        <MapContainer center={[12.9716, 77.5946]} zoom={13} className="w-full h-full z-0" zoomControl={false} dragging={!isDigitalTwin}>
          <TileLayer 
             url={activeLayer === 'solutions' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
             attribution="&copy; OpenStreetMap &copy; CARTO" 
          />
          <SelectionHandler selectionMode={selectionMode} onSelectionEnd={(b) => {
            setBounds(b);
            setSelectionMode(false);
          }} />
          
          {/* Animated Heat Intensity Grid */}
          <AnimatePresence>
            {activeLayer === 'heat' && analysisData?.cells.map((cell: any, idx: number) => {
              const level = (showOptimized && cell.level === 'high') ? 'low' : cell.level;
              return (
                <CircleMarker
                  key={`heat-${idx}`}
                  center={[cell.lat, cell.lng]}
                  radius={isDigitalTwin ? 30 : 22}
                  pathOptions={{
                    fillColor: HEAT_COLORS[level as keyof typeof HEAT_COLORS],
                    fillOpacity: idx <= revealIndex ? (0.4 + cell.intensity * 0.4) : 0,
                    stroke: false,
                    className: 'transition-all duration-1000'
                  }}
                />
              );
            })}
          </AnimatePresence>

          {/* Sensor Matrix Layer */}
          {activeLayer === 'sensors' && (
            <>
              <SensorNode pos={[12.9716, 77.5946]} temp="41.2" risk="High" />
              <SensorNode pos={[12.9800, 77.6000]} temp="38.5" risk="Medium" />
              <SensorNode pos={[12.9650, 77.5850]} temp="34.2" risk="Low" />
              <SensorNode pos={[12.9850, 77.5750]} temp="42.8" risk="High" />
            </>
          )}

          {/* Solution Impact Overlay */}
          {activeLayer === 'solutions' && analysisData?.cells.filter((c: any) => c.level === 'high').slice(0, 8).map((cell: any, i: number) => (
             <CircleMarker 
               key={`sol-${i}`}
               center={[cell.lat, cell.lng]}
               radius={10}
               pathOptions={{ fillColor: '#10b981', fillOpacity: 0.9, stroke: true, weight: 4, color: 'white' }}
             >
                <Popup>
                   <div className="p-4 bg-emerald-950 text-white rounded-2xl min-w-[140px] text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Cooling Target</p>
                      <p className="text-lg font-black tracking-tight leading-none mb-3">Install Green Canopy</p>
                      <p className="text-[9px] font-bold text-white/50 uppercase italic tracking-widest">Potential Impact: −4.2°C</p>
                   </div>
                </Popup>
             </CircleMarker>
          ))}

          {/* Legacy Heat Alerts */}
          {HEAT_ALERTS.map((alert: any) => (
              <CircleMarker
                key={alert.id}
                center={[alert.lat, alert.lng]}
                radius={alert.type === 'critical' ? 25 : 15}
                pathOptions={{
                  fillColor: alert.type === 'critical' ? '#ef4444' : '#f59e0b',
                  fillOpacity: 0.3,
                  stroke: true,
                  color: 'white',
                  weight: 2,
                  className: alert.type === 'critical' ? 'animate-pulse' : ''
                }}
              >
                <Popup>
                  <div className="p-6 bg-white rounded-[32px] shadow-2xl border border-slate-100 min-w-[220px]">
                    <div className="flex items-center gap-3 mb-4">
                       <ShieldCheck className="w-5 h-5 text-rose-500" />
                       <h4 className="font-black text-slate-950 tracking-tight text-lg">{alert.loc}</h4>
                    </div>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 leading-none italic">Severe Thermal Load</p>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{alert.reason}</p>
                  </div>
                </Popup>
              </CircleMarker>
          ))}
          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>

      {/* Advanced Control Dock */}
      <div className="absolute bottom-40 right-10 md:top-14 md:right-14 md:bottom-auto z-[600] flex flex-col gap-6 pointer-events-auto">
         <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-3 flex flex-col gap-3 shadow-premium border border-white/50 animate-in slide-in-from-right-12 duration-1000">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveLayer('heat')}
              className={`w-14 h-14 md:w-20 md:h-20 rounded-[28px] md:rounded-[32px] transition-all group ${activeLayer === 'heat' ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Flame className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveLayer('sensors')}
              className={`w-14 h-14 md:w-20 md:h-20 rounded-[28px] md:rounded-[32px] transition-all group ${activeLayer === 'sensors' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Radio className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveLayer('solutions')}
              className={`w-14 h-14 md:w-20 md:h-20 rounded-[28px] md:rounded-[32px] transition-all group ${activeLayer === 'solutions' ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/30' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <ShieldCheck className="w-7 h-7" />
            </Button>
         </div>
         <Button 
            onClick={() => setIsDigitalTwin(!isDigitalTwin)}
            className={`w-14 h-14 md:w-auto md:h-20 rounded-[28px] md:rounded-[36px] bg-slate-950 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-3xl flex items-center justify-center gap-4 md:px-10 border border-slate-800 active:scale-95 ${isDigitalTwin ? 'bg-emerald-500 border-emerald-400 shadow-emerald-900/40' : ''}`}
          >
            <span className="hidden md:block">{isDigitalTwin ? 'Core Interface' : 'City Digital Twin'}</span>
            <Box className={`w-8 h-8 ${isDigitalTwin ? 'animate-spin-slow' : ''}`} />
          </Button>
      </div>

      {/* Spatial Dispatcher Console */}
      <div className="absolute bottom-36 left-10 right-10 md:bottom-14 md:left-1/2 md:-translate-x-1/2 md:w-[700px] z-[500] flex flex-col gap-10 pointer-events-none">
        
        {analysisData && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950 text-white p-10 rounded-[64px] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.4)] flex items-center justify-between pointer-events-auto relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-[30px] bg-rose-500 flex items-center justify-center text-white shadow-3xl border border-rose-400">
                <Flame className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Strategy Decision Matrix</p>
                <p className="text-3xl font-black tracking-tighter leading-none italic">Cluster 4: <span className="text-rose-500 uppercase not-italic">Level 5 Heat</span></p>
              </div>
            </div>
            <Button 
              onClick={() => setShowSimulator(true)}
              className="bg-white text-slate-950 rounded-[28px] px-12 h-20 font-black uppercase tracking-[0.25em] text-xs shadow-white/5 shadow-2xl transition-all active:scale-95 hover:bg-emerald-400 hover:text-white relative z-10"
            >
              Architect Solution
            </Button>
          </motion.div>
        )}

        {/* Global Strategy Guide - Safe Area Offset */}
        <div className="bg-white/80 backdrop-blur-3xl pointer-events-auto rounded-[40px] p-3 flex gap-6 shadow-premium border border-white/80 group">
           <div className="w-16 h-16 rounded-[28px] bg-slate-950 flex items-center justify-center text-white shadow-2xl transition-all group-hover:rotate-6 group-hover:scale-105 duration-500">
            <Radio className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="flex-1 flex flex-col justify-center px-2 cursor-pointer" onClick={() => setSelectionMode(!selectionMode)}>
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] mb-1">Decision Protocol Guide</p>
            <span className="text-lg font-black text-slate-950 whitespace-nowrap truncate tracking-tighter italic">
              {selectionMode ? 'Defining Sector Parameters...' : (
                typeof window !== 'undefined' && ('ontouchstart' in window) 
                ? 'Long press & drag to select sector' 
                : 'Shift + Drag to select sector scan'
              )}
            </span>
          </div>
          <Button 
            onClick={() => setSelectionMode(!selectionMode)}
            variant="ghost" 
            size="icon" 
            className={`rounded-[28px] w-16 h-16 transition-all duration-700 ${selectionMode ? 'bg-emerald-500 text-white shadow-2xl scale-110 rotate-180' : 'text-slate-400 bg-slate-50'}`}
          >
            <Layers className="w-8 h-8" />
          </Button>
        </div>
      </div>

      <SimulationPanel 
        isOpen={showSimulator} 
        onClose={() => { setShowSimulator(false); setShowOptimized(false); }} 
        zoneAreaM2={analysisData?.areaM2 || 50000}
        onOptimizeChange={setShowOptimized}
      />
    </div>
  );
}
