"use client";

import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2, Square, Hand, MapPin, X } from "lucide-react";

// Fix Leaflet marker paths just in case they are needed for future
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function getDistance(lng1: number, lat1: number, lng2: number, lat2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapViewer() {
  const [mode, setMode] = useState<"pan" | "draw">("pan");
  const [bbox, setBbox] = useState<{ minLng: number; minLat: number; maxLng: number; maxLat: number } | null>(null);
  const [currentDragBox, setCurrentDragBox] = useState<{ minLng: number; minLat: number; maxLng: number; maxLat: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; zone_id: string } | null>(null);

  const startPoint = useRef<{ lng: number; lat: number } | null>(null);
  const isDrawing = useRef(false);

  const handleAnalyze = async () => {
    if (!bbox) return;
    setLoading(true);
    setResult(null);

    const centerLat = (bbox.minLat + bbox.maxLat) / 2;
    const centerLng = (bbox.minLng + bbox.maxLng) / 2;
    const radiusKm = getDistance(centerLng, centerLat, bbox.minLng, bbox.minLat);

    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: centerLat,
          lng: centerLng,
          radius_km: parseFloat(radiusKm.toFixed(2)),
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to analyze zone.");
    } finally {
      setLoading(false);
    }
  };

  const clearBox = () => {
    setBbox(null);
    setCurrentDragBox(null);
    setResult(null);
  };

  function MapEventsHandler() {
    const map = useMap();

    useEffect(() => {
      if (mode === "draw") {
        map.dragging.disable();
        map.getContainer().style.cursor = "crosshair";
      } else {
        map.dragging.enable();
        map.getContainer().style.cursor = "";
      }
    }, [mode, map]);

    useMapEvents({
      mousedown: (e) => {
        if (mode !== "draw") return;
        isDrawing.current = true;
        startPoint.current = { lng: e.latlng.lng, lat: e.latlng.lat };
        setBbox(null);
        setCurrentDragBox(null);
        setResult(null);
      },
      mousemove: (e) => {
        if (!isDrawing.current || !startPoint.current || mode !== "draw") return;
        const currentLoc = { lng: e.latlng.lng, lat: e.latlng.lat };
        
        setCurrentDragBox({
          minLng: Math.min(startPoint.current.lng, currentLoc.lng),
          maxLng: Math.max(startPoint.current.lng, currentLoc.lng),
          minLat: Math.min(startPoint.current.lat, currentLoc.lat),
          maxLat: Math.max(startPoint.current.lat, currentLoc.lat),
        });
      },
      mouseup: (e) => {
        if (!isDrawing.current || !startPoint.current || mode !== "draw") return;
        isDrawing.current = false;
        const endPoint = { lng: e.latlng.lng, lat: e.latlng.lat };

        const minLng = Math.min(startPoint.current.lng, endPoint.lng);
        const maxLng = Math.max(startPoint.current.lng, endPoint.lng);
        const minLat = Math.min(startPoint.current.lat, endPoint.lat);
        const maxLat = Math.max(startPoint.current.lat, endPoint.lat);

        if (Math.abs(maxLng - minLng) > 0.0001 && Math.abs(maxLat - minLat) > 0.0001) {
          setBbox({ minLng, minLat, maxLng, maxLat });
        }
        setCurrentDragBox(null);
        startPoint.current = null;
      }
    });

    return null;
  }

  const activeBox = bbox || currentDragBox;

  return (
    <main className="h-screen w-full relative overflow-hidden bg-slate-100 flex flex-col text-slate-900">
      
      {/* Map Container */}
      <div className="flex-1 w-full h-full z-0">
        <MapContainer 
          center={[17.385, 78.4867]} 
          zoom={11} 
          scrollWheelZoom={true} 
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventsHandler />
          
          {activeBox && (
            <Polygon 
              positions={[
                [activeBox.minLat, activeBox.minLng],
                [activeBox.minLat, activeBox.maxLng],
                [activeBox.maxLat, activeBox.maxLng],
                [activeBox.maxLat, activeBox.minLng],
              ]} 
              pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.2, weight: 2 }}
            />
          )}
        </MapContainer>
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-[400] flex gap-2 bg-white/90 backdrop-blur shadow-md p-1.5 rounded-lg border border-slate-200">
        <button
          onClick={() => setMode("pan")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
            mode === "pan" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Hand className="w-4 h-4" />
          <span className="hidden sm:inline">Pan</span>
        </button>
        <button
          onClick={() => setMode("draw")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
            mode === "draw" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Square className="w-4 h-4" />
          <span className="hidden sm:inline">Draw Box</span>
        </button>
      </div>

      {/* Floating Panel (Bottom on Mobile, Right on Desktop) */}
      {bbox && (
        <div className="absolute z-[400] bottom-0 left-0 w-full md:bottom-auto md:top-0 md:right-0 md:h-full md:w-96 p-4 md:p-6 transition-all duration-300 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl md:h-full flex flex-col pointer-events-auto w-full max-h-[80vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h2 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Selected Zone
              </h2>
              <button onClick={clearBox} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex-1 flex flex-col gap-5">
              <div className="text-sm border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 font-medium text-slate-600 text-xs uppercase tracking-wider">
                  Coordinates
                </div>
                <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-4 text-slate-700">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">SW Lng</span>
                    <span className="font-mono">{bbox.minLng.toFixed(4)}°</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">SW Lat</span>
                    <span className="font-mono">{bbox.minLat.toFixed(4)}°</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">NE Lng</span>
                    <span className="font-mono">{bbox.maxLng.toFixed(4)}°</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">NE Lat</span>
                    <span className="font-mono">{bbox.maxLat.toFixed(4)}°</span>
                  </div>
                </div>
              </div>

              {result && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-sm font-semibold text-green-800 mb-2">Analysis Complete</h3>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between"><span className="text-green-600/80">Status:</span> <span className="font-medium text-green-700 uppercase">{result.status}</span></p>
                    <p className="flex justify-between"><span className="text-green-600/80">Zone ID:</span> <span className="font-medium text-green-700">{result.zone_id}</span></p>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze zone"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
