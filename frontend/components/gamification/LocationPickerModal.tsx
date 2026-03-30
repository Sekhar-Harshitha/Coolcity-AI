'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Check } from 'lucide-react';

// Fix for default marker icon in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialLocation 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (lat: number, lng: number) => void;
  initialLocation: { lat: number, lng: number } | null;
}) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number }>(
    initialLocation || { lat: 12.9716, lng: 77.5946 }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-display font-black text-slate-900">Adjust Location</h3>
            <p className="text-sm text-slate-500 font-medium">Click on the map to precisely mark the anomaly.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="h-[500px] w-full bg-slate-100 relative">
          <MapContainer 
            center={[selectedLocation.lat, selectedLocation.lng]} 
            zoom={15} 
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={icon} />
            <MapEvents onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })} />
          </MapContainer>
        </div>
        
        <div className="p-8 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Selection</p>
            <p className="text-lg font-mono font-bold text-slate-700">
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm(selectedLocation.lat, selectedLocation.lng);
                onClose();
              }}
              className="flex-1 md:flex-none px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Confirm Coordinates <Check className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
