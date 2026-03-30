import dynamic from "next/dynamic";

const MapViewer = dynamic(() => import("../components/MapViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-100 text-slate-500">
      <div className="animate-pulse w-10 h-10 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin mb-4" />
      <p>Loading Map...</p>
    </div>
  ),
});

export default function Home() {
  return <MapViewer />;
}
