"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2, Square, Hand, MapPin, X } from "lucide-react";

if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
}

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

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [mode, setMode] = useState<"pan" | "draw">("pan");
  const [bbox, setBbox] = useState<{ minLng: number; minLat: number; maxLng: number; maxLat: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; zone_id: string } | null>(null);

  const isDrawing = useRef(false);
  const startPoint = useRef<{ lng: number; lat: number } | null>(null);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [78.4867, 17.385], // Centered on Hyderabad, India
      zoom: 11,
    });

    map.current.on("load", () => {
      // Add source and layer for the drawn bounding box
      map.current?.addSource("drawn-box", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.current?.addLayer({
        id: "drawn-box-fill",
        type: "fill",
        source: "drawn-box",
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.2,
        },
      });

      map.current?.addLayer({
        id: "drawn-box-line",
        type: "line",
        source: "drawn-box",
        paint: {
          "line-color": "#2563eb",
          "line-width": 2,
        },
      });
    });

    const onMouseDown = (e: mapboxgl.MapMouseEvent) => {
      if (mode !== "draw") return;
      isDrawing.current = true;
      startPoint.current = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      setBbox(null);
      setResult(null);
    };

    const onMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (!isDrawing.current || !startPoint.current || mode !== "draw") return;
      const currentPoint = { lng: e.lngLat.lng, lat: e.lngLat.lat };

      const minLng = Math.min(startPoint.current.lng, currentPoint.lng);
      const maxLng = Math.max(startPoint.current.lng, currentPoint.lng);
      const minLat = Math.min(startPoint.current.lat, currentPoint.lat);
      const maxLat = Math.max(startPoint.current.lat, currentPoint.lat);

      const polygon = {
        type: "Feature" as const,
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [minLng, minLat],
              [maxLng, minLat],
              [maxLng, maxLat],
              [minLng, maxLat],
              [minLng, minLat],
            ],
          ],
        },
        properties: {},
      };

      const source = map.current?.getSource("drawn-box") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(polygon);
      }
    };

    const onMouseUp = (e: mapboxgl.MapMouseEvent) => {
      if (!isDrawing.current || !startPoint.current || mode !== "draw") return;
      isDrawing.current = false;
      const endPoint = { lng: e.lngLat.lng, lat: e.lngLat.lat };

      const minLng = Math.min(startPoint.current.lng, endPoint.lng);
      const maxLng = Math.max(startPoint.current.lng, endPoint.lng);
      const minLat = Math.min(startPoint.current.lat, endPoint.lat);
      const maxLat = Math.max(startPoint.current.lat, endPoint.lat);

      if (Math.abs(maxLng - minLng) > 0.0001 && Math.abs(maxLat - minLat) > 0.0001) {
        setBbox({ minLng, minLat, maxLng, maxLat });
      } else {
        // Box too small, clear it
        const source = map.current?.getSource("drawn-box") as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({ type: "FeatureCollection", features: [] });
        }
      }
      startPoint.current = null;
    };

    map.current.on("mousedown", onMouseDown);
    map.current.on("mousemove", onMouseMove);
    map.current.on("mouseup", onMouseUp);

    return () => {
      // Cleanup events on re-render/dismount
      if (map.current) {
        map.current.off("mousedown", onMouseDown);
        map.current.off("mousemove", onMouseMove);
        map.current.off("mouseup", onMouseUp);
      }
    };
  }, [mode]);

  useEffect(() => {
    if (map.current) {
      if (mode === "draw") {
        map.current.dragPan.disable();
        map.current.scrollZoom.disable();
        map.current.doubleClickZoom.disable();
        map.current.getCanvas().style.cursor = "crosshair";
      } else {
        map.current.dragPan.enable();
        map.current.scrollZoom.enable();
        map.current.doubleClickZoom.enable();
        map.current.getCanvas().style.cursor = "grab";
      }
    }
  }, [mode]);

  const handleAnalyze = async () => {
    if (!bbox) return;
    setLoading(true);
    setResult(null);

    const centerLat = (bbox.minLat + bbox.maxLat) / 2;
    const centerLng = (bbox.minLng + bbox.maxLng) / 2;
    
    // Simplistic radius: distance from center to one of the corners
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

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

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
    setResult(null);
    const source = map.current?.getSource("drawn-box") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({ type: "FeatureCollection", features: [] });
    }
  };

  return (
    <main className="h-screen w-full relative overflow-hidden bg-slate-100 flex-col flex text-slate-900">
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg max-w-md shadow-lg text-center">
            <h2 className="text-xl font-bold text-amber-800 mb-2">Mapbox Token Missing</h2>
            <p className="text-amber-700 mb-4">
              Please add <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to your <code>.env.local</code> file in the <code>frontend</code> folder to load the map.
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="flex-1 w-full h-full" />

      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 bg-white/90 backdrop-blur shadow-md p-1.5 rounded-lg border border-slate-200">
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
        <div className="absolute z-20 bottom-0 left-0 w-full md:bottom-auto md:top-0 md:right-0 md:h-full md:w-96 p-4 md:p-6 transition-all duration-300 pointer-events-none">
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
