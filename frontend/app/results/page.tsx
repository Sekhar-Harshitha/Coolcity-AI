"use client";

import { useEffect, useState } from "react";
import { Download, Share2, ArrowLeft, ArrowDownRight, Thermometer, IndianRupee, Map as MapIcon } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OptimalMix {
  name: string;
  units: number;
  budget_allocated: number;
  temp_drop: number;
}

interface SimulationData {
  optimal_mix: OptimalMix[];
  total_predicted_temp_drop: number;
  budget_used: number;
  budget_remaining: number;
  current_heat_score?: number;
  zones_improved?: number;
  total_zones?: number;
  lat?: number;
  lng?: number;
  analyzed_at?: string;
}

export default function ResultsDashboard() {
  const [data, setData] = useState<SimulationData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("coolcity_simulation");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse simulation data", e);
      }
    } else {
      // Mock data for display if none exists yet
      setData({
        optimal_mix: [
          { name: "tree_plantation", units: 1500, budget_allocated: 675000, temp_drop: 12.0 },
          { name: "cool_roofs", units: 50, budget_allocated: 60000, temp_drop: 0.75 },
          { name: "green_walls", units: 15, budget_allocated: 12000, temp_drop: 0.08 },
          { name: "water_bodies", units: 2, budget_allocated: 16000, temp_drop: 0.04 }
        ],
        total_predicted_temp_drop: 12.87,
        budget_used: 763000,
        budget_remaining: 237000,
        current_heat_score: 0.85,
        zones_improved: 124,
        total_zones: 156,
        lat: 17.3850,
        lng: 78.4867,
        analyzed_at: new Date().toLocaleDateString()
      });
    }
  }, []);

  if (!data) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-100">Loading...</div>;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "CoolCity AI Analysis",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    let report = `CoolCity AI Intervention Report\n`;
    report += `Analyzed At: ${data.analyzed_at || new Date().toISOString()}\n`;
    report += `Location: ${data.lat?.toFixed(4) || "17.3850"}, ${data.lng?.toFixed(4) || "78.4867"}\n\n`;
    report += `Total Predicted Temp Reduction: -${data.total_predicted_temp_drop.toFixed(2)}°C\n`;
    report += `Budget Used: INR ${data.budget_used.toLocaleString('en-IN')}\n\n`;
    report += `Optimal Mix Strategies:\n`;
    data.optimal_mix.forEach((m, i) => {
      report += `${i + 1}. ${m.name.replace('_', ' ').toUpperCase()} - ${m.units.toLocaleString()} units (Budget: Rs.${m.budget_allocated.toLocaleString('en-IN')}, Cooldown: -${m.temp_drop.toFixed(2)}°C)\n`;
    });

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CoolCity_Report_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data
  const chartData = {
    labels: data.optimal_mix.map(m => m.name.replace("_", " ").toUpperCase()),
    datasets: [
      {
        label: "Temperature Drop (°C)",
        data: data.optimal_mix.map(m => m.temp_drop),
        backgroundColor: data.optimal_mix.map(m => {
          if (m.name.includes('tree')) return 'rgba(34, 197, 94, 0.8)'; // Green tint
          if (m.name.includes('roof')) return 'rgba(59, 130, 246, 0.8)'; // Blue tint
          if (m.name.includes('wall')) return 'rgba(168, 85, 247, 0.8)'; // Purple tint
          return 'rgba(245, 158, 11, 0.8)'; // Amber/Water tint
        }),
        borderRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  const currentScore = data.current_heat_score || 0.82;
  const eff = data.budget_used > 0 ? (data.total_predicted_temp_drop / (data.budget_used / 100000)) : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 1. Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Map
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
              Simulation Results
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Coordinates: {data.lat?.toFixed(4) || "17.3850"}°N, {data.lng?.toFixed(4) || "78.4867"}°E &bull; Analyzed on: {data.analyzed_at || new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors font-medium text-sm border border-slate-600"
            >
              <Share2 className="w-4 h-4" /> {copied ? "Copied!" : "Share"}
            </button>
            <button 
               onClick={handleDownload}
               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 font-medium text-sm"
            >
              <Download className="w-4 h-4" /> Download Report
            </button>
          </div>
        </header>

        {/* 2. Four metric cards (2x2 grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl transition-all hover:bg-rose-500/20">
            <div className="flex items-center gap-2 text-rose-400 mb-4">
              <Thermometer className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Current Heat Score</h3>
            </div>
            <p className="text-3xl font-bold text-rose-300">{currentScore.toFixed(2)}</p>
            <p className="text-xs text-rose-400/70 mt-1">Risk severity scale (0-1)</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl transition-all hover:bg-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <ArrowDownRight className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Predicted Reduction</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-300">−{data.total_predicted_temp_drop.toFixed(2)}°C</p>
            <p className="text-xs text-emerald-400/70 mt-1">Estimated ambient cooldown</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl transition-all hover:bg-blue-500/20">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <IndianRupee className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Budget Efficiency</h3>
            </div>
            <p className="text-3xl font-bold text-blue-300">{eff.toFixed(2)}°C</p>
            <p className="text-xs text-blue-400/70 mt-1">Cooldown per ₹1 Lakh spent</p>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl transition-all hover:bg-purple-500/20">
             <div className="flex items-center gap-2 text-purple-400 mb-4">
              <MapIcon className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Zones Improved</h3>
            </div>
            <p className="text-3xl font-bold text-purple-300">{data.zones_improved || 124} <span className="text-lg opacity-50">/ {data.total_zones || 156}</span></p>
            <p className="text-xs text-purple-400/70 mt-1">Sectors positively impacted</p>
          </div>
        </div>

        {/* Lower Section (Charts & Plan) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 3. Strategy bar chart */}
          <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
             <h3 className="text-base font-bold mb-6 text-slate-200">Cooling Impact by Strategy</h3>
             <div className="h-[300px] w-full">
                <Bar data={chartData} options={chartOptions as any} />
             </div>
          </div>

          {/* 4. Action plan numbered list */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 overflow-hidden flex flex-col h-full">
             <h3 className="text-base font-bold mb-4 text-slate-200">Recommended Action Plan</h3>
             <ul className="space-y-5 overflow-y-auto pr-2 pb-2 flex-1 scrollbar-thin scrollbar-thumb-slate-600">
               {data.optimal_mix.length > 0 ? data.optimal_mix.map((m, idx) => (
                 <li key={idx} className="flex gap-4 items-start pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5 ring-1 ring-blue-500/30">
                     {idx + 1}
                   </span>
                   <div>
                     <p className="font-semibold text-sm text-slate-200 capitalize tracking-wide">{m.name.replace("_", " ")}</p>
                     <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                       Deploy <strong className="text-slate-300">{m.units.toLocaleString()} units</strong>. Allocates <strong className="text-emerald-400">₹{m.budget_allocated.toLocaleString('en-IN')}</strong> to achieve a localized reduction of <strong className="text-emerald-400">−{m.temp_drop.toFixed(2)}°C</strong>.
                     </p>
                   </div>
                 </li>
               )) : (
                 <li className="text-sm text-slate-500 italic">No sustainable actions recommended based on current constraints.</li>
               )}
             </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
