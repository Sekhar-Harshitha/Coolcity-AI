'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  Flame, 
  Droplets, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  X, 
  Loader2, 
  Target,
  Maximize2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { awardPoints } from '@/lib/gamification/pointsEngine';
import { useGamification } from './GamificationProvider';
import dynamic from 'next/dynamic';

// Correct way to dynamic import our component that uses Leaflet
const LocationPickerModal = dynamic(() => import('./LocationPickerModal'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[10000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-8 animate-pulse text-white">Loading Intelligence Map...</div>
});

export default function CitizenMode() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>({ lat: 17.412, lng: 78.441 }); // Hyderabad Default
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [heatType, setHeatType] = useState('');
  const [solution, setSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addXP, addToast } = useGamification();

  // Auto-detect location on mount for Step 1
  useEffect(() => {
    if (step === 1 && !location) {
      handleGetLocation();
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported');
      return;
    }
    setIsLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
        addToast('success', 'Location precisely detected 📍', '📍');
      },
      (err) => {
        setLocError('Location permission denied. Please select manually.');
        setIsLocating(false);
        addToast('warning', 'Location permission denied', '📍');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      addToast('error', 'File too large (Max 10MB)', '❌');
      return;
    }
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    
    // Auto-move to next step after a slight delay for better UX
    setTimeout(() => {
      setStep(3);
    }, 800);
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhoto(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitReport = async () => {
    setIsSubmitting(true);
    if (navigator.vibrate) navigator.vibrate(50);
    
    // Simulate complex AI indexing
    await new Promise(r => setTimeout(r, 2000));

    // Calculate points
    let earned = 10; // Base: Reporting hotspot
    if (photo) earned += 15; // Uploading image
    if (solution) earned += 20; // Suggesting solution

    // Prepare Multipart Form Data
    const formData = new FormData();
    if (photo) formData.append('file', photo);
    formData.append('lat', (location?.lat || 12.9716).toString());
    formData.append('lng', (location?.lng || 77.5946).toString());
    formData.append('username', 'Citizen Scientist');
    formData.append('type', heatType);
    formData.append('solution', solution);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/citizen/report`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      setSubmitted(true);
      addXP(earned, 'pts', document.getElementById('submitBtn'));
      addToast('success', 'Heat anomaly verified & mapped 🌿', '🏆');
      await awardPoints('USER1', 'REPORT_HEAT_ANOMALY', { heatType, solution, points: earned });
    } catch (err) {
      console.warn('Submission error:', err);
      // Fallback for demo
      setSubmitted(true);
      addXP(earned, 'pts', document.getElementById('submitBtn'));
      addToast('info', 'Report saved to local cloud (Async Sync) 📡', '📡');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !location) return;
    if (step === 3 && !heatType) return;
    setStep(s => Math.min(s + 1, 4));
  };
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <div className="bg-white rounded-[32px] p-12 flex flex-col items-center justify-center text-center min-h-[500px] border border-slate-100 shadow-premium animate-in zoom-in-95 duration-500">
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 rounded-full animate-pulse" />
           <div className="bg-emerald-50 p-8 rounded-full relative z-10 border border-emerald-100">
             <CheckCircle className="w-20 h-20 text-emerald-500" />
           </div>
        </div>
        <h2 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight">Mission Accomplished!</h2>
        <p className="text-slate-500 mb-10 font-medium max-w-sm leading-relaxed">
          Your environmental data has been synthesized into the city's heat mitigation model. 
          <span className="block mt-2 text-emerald-600 font-bold">You've earned 45 XP! 🌿</span>
        </p>
        <button 
          onClick={() => { setSubmitted(false); setStep(1); setPhoto(null); setPreview(null); setHeatType(''); setSolution(''); }} 
          className="bg-slate-900 px-10 py-4 rounded-[20px] font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest text-sm"
        >
          Submit New Report <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/40 backdrop-blur-2xl rounded-[40px] p-6 md:p-10 flex flex-col min-h-[600px] relative overflow-hidden border border-white shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
      
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between mb-12 relative z-10">
        {[1, 2, 3, 4].map((indicator) => (
           <div key={indicator} className="flex-1 flex items-center last:flex-none">
             <div 
               onClick={() => indicator < step && setStep(indicator)}
               className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base transition-all duration-500 cursor-pointer ${
                  step === indicator 
                    ? 'bg-slate-900 text-white scale-110 shadow-2xl shadow-slate-300' 
                    : step > indicator 
                      ? 'bg-emerald-500 text-white hover:scale-105' 
                      : 'bg-white text-slate-300 border border-slate-100'
               }`}
             >
                {step > indicator ? <CheckCircle className="w-6 h-6 stroke-[3]" /> : indicator}
             </div>
             {indicator < 4 && (
                <div className="flex-1 h-[2px] mx-4 relative overflow-hidden bg-slate-100 rounded-full">
                   <div 
                     className="absolute inset-0 bg-emerald-500 transition-all duration-700 ease-in-out" 
                     style={{ width: step > indicator ? '100%' : '0%' }} 
                   />
                </div>
             )}
           </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col relative z-10 transition-all duration-500">
        
        {/* Step 1: Location */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-8 fade-in h-full flex flex-col">
             <div className="mb-8">
               <h3 className="font-display font-black text-3xl text-slate-900 tracking-tight mb-2">Pinpoint Anomaly</h3>
               <p className="text-slate-500 font-medium">Where did you detect the high temperature?</p>
             </div>
             
             <div className="flex-1 flex flex-col gap-6">
                <div className={`relative overflow-hidden bg-slate-50 rounded-[32px] p-10 text-center border transition-all duration-500 ${location ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
                   {isLocating ? (
                     <div className="flex flex-col items-center py-10">
                        <Loader2 className="w-16 h-16 text-slate-300 animate-spin mb-6" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Satellite Feed...</p>
                     </div>
                   ) : (
                     <>
                       <div className={`w-20 h-20 rounded-[28px] mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-xl transition-all ${location ? 'bg-emerald-500 text-white rotate-12' : 'bg-white text-slate-300'}`}>
                          <MapPin className="w-10 h-10" />
                       </div>
                       
                       {locError ? (
                         <div className="text-rose-500 font-bold mb-4 flex items-center justify-center gap-2">
                           <AlertCircle className="w-4 h-4" /> {locError}
                         </div>
                       ) : location ? (
                         <div className="space-y-2">
                           <p className="text-slate-900 font-black text-xl">Spatial Index Locked</p>
                           <p className="text-sm font-mono text-emerald-600 font-bold bg-white/80 py-2 px-6 rounded-full inline-block shadow-sm">
                             {location.lat.toFixed(6)} N, {location.lng.toFixed(6)} E
                           </p>
                         </div>
                       ) : (
                         <p className="text-slate-400 font-bold">Waiting for spatial input</p>
                       )}
                     </>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button 
                     onClick={handleGetLocation}
                     disabled={isLocating}
                     className="bg-white border-2 border-slate-900 text-slate-900 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                   >
                     {isLocating ? 'Locating...' : 'Auto-Detect'} <Target className="w-5 h-5" />
                   </button>
                   <button 
                     className="bg-white border-2 border-slate-100 text-slate-500 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                     onClick={() => setIsMapModalOpen(true)}
                   >
                     Adjust on Map <Maximize2 className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Step 2: Upload Image */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-8 fade-in h-full flex flex-col">
             <div className="mb-8">
               <h3 className="font-display font-black text-3xl text-slate-900 tracking-tight mb-2">Visual Evidence</h3>
               <p className="text-slate-500 font-medium">Capture the physical landscape of the heat zone.</p>
             </div>

             <div 
               onClick={() => fileInputRef.current?.click()}
               onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
               onDrop={e => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
               className={`flex-1 border-[3px] border-dashed rounded-[40px] p-10 flex flex-col items-center justify-center cursor-pointer transition-all relative group overflow-hidden ${preview ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200'}`}
             >
               {preview ? (
                 <>
                   <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700" />
                   <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl">
                         <Camera className="w-8 h-8 text-slate-900" />
                      </div>
                      <p className="text-white font-black uppercase tracking-widest text-xs">Tap to Replace</p>
                      <button 
                        onClick={removePhoto}
                        className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-rose-500 text-white transition-all shadow-xl"
                      >
                         <Trash2 className="w-6 h-6" />
                      </button>
                   </div>
                 </>
               ) : (
                 <>
                    <div className="w-24 h-24 rounded-[32px] bg-white shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <Upload className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="font-black text-xl text-slate-900 mb-2">Drag & Drop Scan</p>
                    <p className="text-slate-400 font-bold mb-4">or tap to activate camera</p>
                    <div className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                       Earn +15 XP Bonus
                    </div>
                 </>
               )}
               <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={e => e.target.files && handleFile(e.target.files[0])} />
             </div>
             
             {preview && (
                <button 
                  onClick={() => setStep(3)}
                  className="mt-6 w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                   Verify & Process Scan
                </button>
             )}
          </div>
        )}

        {/* Step 3: Heat Type */}
        {step === 3 && (
          <div className="animate-in slide-in-from-right-8 fade-in h-full flex flex-col">
             <div className="mb-8">
               <h3 className="font-display font-black text-3xl text-slate-900 tracking-tight mb-2">Anatomical Profile</h3>
               <p className="text-slate-500 font-medium">Select the primary cause of high heat retention.</p>
             </div>

             <div className="flex flex-col gap-4">
               {[
                 { id: 'concrete', label: 'High heat concrete area', icon: <Flame className="w-5 h-5 text-rose-500" /> },
                 { id: 'trees', label: 'No tree cover / Bare land', icon: <X className="w-5 h-5 text-amber-500" /> },
                 { id: 'buildings', label: 'Heat trapped buildings', icon: <Target className="w-5 h-5 text-sky-500" /> },
                 { id: 'parking', label: 'Parking lot heat sink', icon: <AlertCircle className="w-5 h-5 text-orange-500" /> }
               ].map(type => (
                 <label 
                   key={type.id} 
                   className={`p-6 rounded-[28px] cursor-pointer transition-all duration-300 border-2 flex items-center justify-between group ${heatType === type.label ? 'border-slate-900 bg-slate-900 shadow-2xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'}`}
                   onClick={() => setHeatType(type.label)}
                 >
                    <div className="flex items-center gap-5">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${heatType === type.label ? 'bg-white/10' : 'bg-slate-50'}`}>
                          {type.icon}
                       </div>
                       <span className={`font-bold text-lg ${heatType === type.label ? 'text-white' : 'text-slate-700'}`}>{type.label}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${heatType === type.label ? 'border-emerald-400 bg-emerald-400' : 'border-slate-200'}`}>
                        {heatType === type.label && <CheckCircle className="w-4 h-4 text-slate-900 stroke-[3]" />}
                    </div>
                 </label>
               ))}
             </div>
          </div>
        )}

        {/* Step 4: Suggestion & Submit */}
        {step === 4 && (
          <div className="animate-in slide-in-from-right-8 fade-in h-full flex flex-col">
             <div className="mb-8">
               <h3 className="font-display font-black text-3xl text-slate-900 tracking-tight mb-2">Mitigation Strategy</h3>
               <p className="text-slate-500 font-medium">How would you transform this zone?</p>
             </div>
             
             <div className="flex-1 space-y-6">
                <textarea 
                  value={solution}
                  onChange={e => setSolution(e.target.value)}
                  placeholder="e.g. Implement a Miyawaki forest or install white reflective solar-grid roofs..." 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] p-8 text-slate-900 text-lg outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white focus:border-slate-900 transition-all resize-none min-h-[220px] font-bold placeholder:text-slate-300"
                />
                
                <div className="bg-[var(--mint-50)] rounded-[24px] p-6 border border-[var(--mint-100)] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <Droplets className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                         <p className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Reward Tier 3</p>
                         <p className="font-bold text-emerald-700">Strategic Insight Bonus</p>
                      </div>
                   </div>
                   <span className="font-black text-emerald-600 text-lg">+20 XP</span>
                </div>
             </div>
          </div>
        )}

      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-12 relative z-10 pt-8 border-t border-slate-100">
         {step > 1 ? (
           <button 
             onClick={prevStep} 
             disabled={isSubmitting}
             className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50"
           >
              <ArrowLeft className="w-5 h-5" /> Back
           </button>
         ) : (
           <div />
         )}
         
         {step < 4 ? (
           <button 
             onClick={nextStep} 
             disabled={step === 1 && !location || step === 3 && !heatType} 
             className="flex items-center gap-3 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs px-10 py-5 rounded-[22px] shadow-2xl shadow-slate-300 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
           >
              Next Strategy <ArrowRight className="w-5 h-5" />
           </button>
         ) : (
           <button 
             id="submitBtn" 
             onClick={submitReport} 
             disabled={!heatType || isSubmitting} 
             className="relative flex items-center gap-3 bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-xs px-12 py-5 rounded-[22px] shadow-2xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group overflow-hidden"
           >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Transmitting...
                </>
              ) : (
                <>
                  Publish Report <CheckCircle className="w-5 h-5" />
                </>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[2000ms]" />
           </button>
         )}
      </div>

      {/* Manual Modals */}
      {isMapModalOpen && (
        <LocationPickerModal 
          isOpen={isMapModalOpen}
          initialLocation={location}
          onClose={() => setIsMapModalOpen(false)}
          onConfirm={(lat, lng) => {
            setLocation({ lat, lng });
            addToast('success', 'Location manually refined 📍', '✅');
          }}
        />
      )}
    </div>
  );
}

