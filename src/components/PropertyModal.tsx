"use client";

import { Comp } from "@/components/CompsTable";

export default function PropertyModal({
  comp,
  onClose,
}: {
  comp: Comp;
  onClose: () => void;
}) {
  const ppsf = (comp.rentPrice / comp.sqft).toFixed(2);
  const matchPct = Math.max(0, Math.min(100, 100 - comp.similarityScore)).toFixed(0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative hud-panel rounded-xl p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slide-up 0.3s ease-out" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] text-neon-magenta/60 uppercase">
            Property Detail // MLS# {comp.mlsId}
          </span>
        </div>

        {/* Address */}
        <h3 className="text-xl font-black text-white mb-1">{comp.address}</h3>
        <p className="text-gray-400 text-sm mb-6">
          {comp.city}, {comp.state} {comp.zip} &mdash;{" "}
          <span className="text-neon-magenta/70">{comp.subdivision}</span>
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 border border-hud-border rounded-lg">
            <div className="text-xl font-bold text-neon-cyan">{comp.beds}</div>
            <div className="text-[9px] tracking-wider text-gray-500 uppercase">Beds</div>
          </div>
          <div className="text-center p-3 border border-hud-border rounded-lg">
            <div className="text-xl font-bold text-neon-cyan">{comp.baths}</div>
            <div className="text-[9px] tracking-wider text-gray-500 uppercase">Baths</div>
          </div>
          <div className="text-center p-3 border border-hud-border rounded-lg">
            <div className="text-xl font-bold text-neon-magenta">{comp.sqft.toLocaleString()}</div>
            <div className="text-[9px] tracking-wider text-gray-500 uppercase">Sq Ft</div>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-hud-border/30">
            <span className="text-gray-500">Rent</span>
            <span className="text-neon-green font-bold font-mono">${comp.rentPrice.toLocaleString()}/mo</span>
          </div>
          <div className="flex justify-between py-2 border-b border-hud-border/30">
            <span className="text-gray-500">Price per Sq Ft</span>
            <span className="text-neon-orange font-mono">${ppsf}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-hud-border/30">
            <span className="text-gray-500">Property Type</span>
            <span className="text-neon-magenta/70">{comp.propertyType}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-hud-border/30">
            <span className="text-gray-500">Year Built</span>
            <span className="text-white">{comp.yearBuilt}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-hud-border/30">
            <span className="text-gray-500">Distance</span>
            <span className="text-white font-mono">{comp.distance} mi</span>
          </div>
          <div className="flex justify-between py-2 border-b border-hud-border/30">
            <span className="text-gray-500">Days on Market</span>
            <span className="text-white">{comp.daysOnMarket}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-hud-border/30">
            <span className="text-gray-500">Status</span>
            <span className={`font-bold ${comp.status === "Active" ? "text-neon-green" : comp.status === "Pending" ? "text-neon-yellow" : "text-gray-400"}`}>
              {comp.status}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Match Score</span>
            <span className="text-neon-cyan font-bold">{matchPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
