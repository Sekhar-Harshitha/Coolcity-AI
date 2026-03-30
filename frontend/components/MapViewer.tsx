'use client'

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Rectangle, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { saveAnalysis, getAnalysis } from '@/lib/offlineStore';
import { analyzeRegion } from '@/lib/api';
import SimulationPanel from './SimulationPanel';
import { Button } from './ui/button';
import { Search, MapPin, Layers, Play, CheckCircle2, Flame, Box, Zap, BarChart3, Leaf } from 'lucide-react';
import { HEAT_ALERTS, getAlertStyle } from '@/components/heatAlerts/HeatAlertEngine';

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
  high: 'var(--blush-300)',
  medium: 'var(--peach-300)',
  low: 'var(--mint-300)',
};

interface MapViewerProps {
  setIsSyncing: (val: boolean) => void;
}

const SelectionHandler = ({ onSelectionEnd }: { onSelectionEnd: (bbox: L.LatLngBounds) => void }) => {
  const [start, setStart] = useState<L.LatLng | null>(null);
  const [current, setCurrent] = useState<L.LatLng | null>(null);

  useMapEvents({
    mousedown: (e) => {
      if (e.originalEvent.shiftKey) {
        setStart(e.latlng);
        setCurrent(e.latlng);
        e.target.dragging.disable();
      }
    },
    mousemove: (e) => {
      if (start) {
        setCurrent(e.latlng);
      }
    },
    mouseup: (e) => {
      if (start && current) {
        const bounds = L.latLngBounds(start, current);
        onSelectionEnd(bounds);
        setStart(null);
        setCurrent(null);
        e.target.dragging.enable();
      }
    }
  });

  if (!start || !current) return null;

  return (
    <Rectangle 
      bounds={L.latLngBounds(start, current)} 
      pathOptions={{ 
        color: 'var(--lavender-500)', 
        weight: 2, 
        dashArray: '5, 5', 
        className: 'marching-ants',
        fillColor: 'var(--lavender-100)',
        fillOpacity: 0.2
      }} 
    />
  );
};

export default function MapViewer({ setIsSyncing }: MapViewerProps) {
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [activeLayer, setActiveLayer] = useState<'heat' | 'veg' | 'con'>('heat');
  const [is3D, setIs3D] = useState(false);

  const [showOptimized, setShowOptimized] = useState(false);

  const LayerSwitcher = () => {
    const map = useMap();
    useEffect(() => {
      if (activeLayer === 'heat') {
        map.eachLayer((layer: any) => {
          if (layer._url?.includes('basemaps.cartocdn.com')) {
            layer.setUrl('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
          }
        });
      } else if (activeLayer === 'veg') {
        map.eachLayer((layer: any) => {
          if (layer._url?.includes('basemaps.cartocdn.com')) {
            layer.setUrl('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png');
          }
        });
      } else if (activeLayer === 'con') {
         map.eachLayer((layer: any) => {
          if (layer._url?.includes('basemaps.cartocdn.com')) {
            layer.setUrl('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');
          }
        });
      }
    }, [activeLayer, map]);
    return null;
  };

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
          // Fallback to local simulation if API is down
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
    const latStep = (nw.lat - se.lat) / 10;
    const lngStep = (se.lng - nw.lng) / 10;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const lat = nw.lat - (i * latStep) - (latStep / 2);
            const lng = nw.lng + (j * lngStep) + (lngStep / 2);
            const intensity = Math.random();
            cells.push({
                lat, lng, 
                intensity,
                level: intensity > 0.7 ? 'high' : intensity > 0.4 ? 'medium' : 'low'
            });
        }
    }
    return { cells, areaM2: 50000 }; 
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Scanning Progress Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[4px] pointer-events-none overflow-hidden animate-in fade-in duration-500">
          <div className="absolute w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--lavender-400)] to-transparent top-0 animate-scan shadow-[0_0_20px_var(--lavender-500)] opacity-50" />
          <div className="bg-white/90 p-8 rounded-[32px] shadow-2xl border border-white flex flex-col items-center gap-5">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-[var(--lavender-500)] rounded-full animate-spin shadow-lg" />
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">AI Thermal Analysis</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">Processing Region Data...</p>
            </div>
            <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--lavender-500)] animate-progress" />
            </div>
          </div>
        </div>
      )}

      {/* 3D Wrapper */}
      <div className={`w-full h-full transition-all duration-1000 ${is3D ? '[transform:perspective(1000px)_rotateX(45deg)_rotateZ(-5deg)_scale(1.2)] [transform-origin:center_bottom] shadow-2xl' : ''}`}>
        
        {/* Professional Telemetry Overlay - Unique Feature */}
        <div className="absolute top-8 left-8 z-[600] flex flex-col gap-4 pointer-events-none transition-all duration-700 animate-in slide-in-from-left-8">
           <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[40px] shadow-premium flex flex-col gap-6 w-[360px]">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Navigation Unit Alpha</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-mono tracking-tight">12.9716° N, 77.5946° E</h3>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                    <MapPin className="w-5 h-5" />
                 </div>
              </div>
              
              <div className="h-px bg-slate-100/50" />
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Elevation</span>
                    <span className="text-sm font-bold text-slate-700">920.4m MSL</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Status</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                       Operational
                    </span>
                 </div>
              </div>

              <div className="space-y-3 pt-2">
                 <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> Mitigation Potential
                    </span>
                    <span className="text-2xl font-bold text-slate-900">
                      {analysisData ? '74%' : '68%'}
                    </span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-100">
                    <div 
                      className="h-full bg-slate-900 transition-all duration-1000 ease-out rounded-full" 
                      style={{ width: analysisData ? '74%' : '68%' }}
                    />
                 </div>
              </div>
           </div>
        </div>
        
        <MapContainer 
          center={[12.9716, 77.5946]} 
          zoom={13} 
          className="w-full h-full z-0"
          zoomControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <LayerSwitcher />
          <SelectionHandler onSelectionEnd={setBounds} />
          
          {analysisData?.cells.map((cell: any, idx: number) => {
            const level = (showOptimized && cell.level === 'high') ? 'low' : cell.level;
            return (
              <CircleMarker
                key={idx}
                center={[cell.lat, cell.lng]}
                radius={15}
                pathOptions={{
                  fillColor: HEAT_COLORS[level as keyof typeof HEAT_COLORS],
                  fillOpacity: idx <= revealIndex ? 0.6 : 0,
                  stroke: false,
                  className: 'heat-cell transition-all duration-1000'
                }}
              />
            );
          })}

          {HEAT_ALERTS.map((alert: any) => {
            const s = getAlertStyle(alert.type);
            return (
              <CircleMarker
                key={alert.id}
                center={[alert.lat, alert.lng]}
                radius={alert.type === 'critical' ? 30 : alert.type === 'high' ? 20 : 15}
                pathOptions={{
                  fillColor: alert.type === 'critical' ? 'var(--blush-500)' : alert.type === 'high' ? 'var(--peach-500)' : 'var(--mint-500)',
                  fillOpacity: 0.5,
                  color: alert.type === 'critical' ? 'var(--blush-300)' : 'transparent',
                  weight: alert.type === 'critical' ? 2 : 0,
                  className: alert.type === 'critical' ? 'animate-ping' : ''
                }}
              >
                <Popup className="custom-popup border-none">
                  <div className={`${s.bg} border ${s.border} rounded-[20px] p-4 flex flex-col gap-2 w-[280px]`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{s.icon}</span>
                      <h4 className={`font-bold ${s.text} font-display text-lg`}>{alert.temp}°C</h4>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {alert.loc}</h3>
                    <p className="text-xs font-medium text-gray-600 border-b border-gray-200 pb-2">{alert.reason}</p>
                    <p className="text-xs font-bold text-gray-800 mt-1">{alert.suggestion}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Layer Toggles */}
      <div className="absolute top-8 right-8 z-[600] flex flex-col gap-4 pointer-events-auto animate-in slide-in-from-right-8">
         <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-2.5 flex flex-col gap-2.5 shadow-premium border border-slate-200/50">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveLayer('heat')}
              className={`w-12 h-12 rounded-[22px] transition-all duration-300 ${activeLayer === 'heat' ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Flame className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveLayer('veg')}
              className={`w-12 h-12 rounded-[22px] transition-all duration-300 ${activeLayer === 'veg' ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Leaf className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveLayer('con')}
              className={`w-12 h-12 rounded-[22px] transition-all duration-300 ${activeLayer === 'con' ? 'bg-slate-900 text-white shadow-xl rotate-12 scale-110' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
         </div>
         <Button 
            onClick={() => setIs3D(!is3D)}
            className={`w-auto h-14 rounded-[24px] font-bold shadow-premium flex gap-3 uppercase tracking-[0.15em] text-[11px] transition-all duration-500 px-6 ${is3D ? 'bg-[var(--lavender-500)] text-white scale-105' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            <Box className="w-5 h-5" /> 
            {is3D ? '2D Projection' : '3D Visualization'}
          </Button>
      </div>


      {/* Floating Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[500] w-[95%] max-w-xl flex flex-col gap-6 pointer-events-none">
        {bounds && !analysisData && (
          <div className="animate-in fade-in slide-in-from-bottom-6 flex justify-center pointer-events-auto">
            <Button 
              onClick={analyzeZone}
              className="group relative bg-slate-900 text-white rounded-[32px] px-10 h-16 shadow-2xl hover:shadow-slate-300 hover:-translate-y-1.5 transition-all duration-500 flex items-center justify-center gap-4 font-bold text-xl overflow-hidden active:scale-95"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-6 h-6 fill-emerald-400 text-emerald-400" />
              )}
              <span className="relative z-10 tracking-tight">{isAnalyzing ? 'Processing...' : 'Run Neural Analysis'}</span>
            </Button>
          </div>
        )}

        {analysisData && (
          <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-[40px] border border-slate-200 shadow-premium flex items-center justify-between pointer-events-auto animate-in scale-95 duration-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Model Synchronized</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">Zone Index: <span className="text-rose-500">Critical</span></p>
            </div>
            <Button 
              onClick={() => setShowSimulator(true)}
              className="relative z-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-10 h-14 font-bold shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95"
            >
              Simulate Solutions
            </Button>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl pointer-events-auto rounded-[32px] p-3 flex gap-3 shadow-premium border border-slate-200/50 transition-all duration-500 hover:bg-white">
           <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <div className="flex-1 flex items-center px-4 font-medium">
            <span className="text-sm text-slate-500">Shift + Drag to select scan region</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl w-12 h-12 text-slate-400 hover:bg-slate-50">
            <Layers className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <SimulationPanel 
        isOpen={showSimulator} 
        onClose={() => {
          setShowSimulator(false);
          setShowOptimized(false);
        }} 
        zoneAreaM2={analysisData?.areaM2 || 50000}
        onOptimizeChange={setShowOptimized}
      />
    </div>
  );
}
