"use client";

import { Property } from "@/data/mock-ntreis";
import { Comp } from "@/components/CompsTable";

export default function RentEstimate({
  subject,
  comps,
}: {
  subject: Property;
  comps: Comp[];
}) {
  if (comps.length === 0) return null;

  // Weighted average: closer matches get more weight
  const totalWeight = comps.reduce((s, c) => s + (100 - Math.min(c.similarityScore, 99)), 0);
  const weightedRent = comps.reduce(
    (s, c) => s + c.rentPrice * (100 - Math.min(c.similarityScore, 99)),
    0
  ) / totalWeight;

  const avgRent = comps.reduce((s, c) => s + c.rentPrice, 0) / comps.length;
  const minRent = Math.min(...comps.map((c) => c.rentPrice));
  const maxRent = Math.max(...comps.map((c) => c.rentPrice));
  const estimated = Math.round(weightedRent / 25) * 25;
  const diff = estimated - subject.rentPrice;
  const diffPct = ((diff / subject.rentPrice) * 100).toFixed(1);

  return (
    <div
      className="hud-panel rounded-xl p-6 mt-6"
      style={{ animation: "slide-up 0.55s ease-out" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-4 h-4 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] tracking-[0.3em] text-neon-green/70 uppercase font-bold">
          Rent Estimate // AI Analysis
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Suggested rent */}
        <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-4 border border-neon-green/30 rounded-lg bg-neon-green/5">
          <span className="text-3xl font-black text-neon-green text-glow-green">
            ${estimated.toLocaleString()}
          </span>
          <span className="text-[10px] tracking-wider text-gray-500 uppercase mt-1">
            Suggested Rent
          </span>
          <span className={`text-xs font-mono mt-2 ${diff > 0 ? "text-neon-green" : diff < 0 ? "text-red-400" : "text-gray-400"}`}>
            {diff > 0 ? "+" : ""}{diff !== 0 ? `$${diff.toLocaleString()} (${diffPct}%)` : "At market"} vs listed
          </span>
        </div>

        {/* Range */}
        <div className="flex flex-col items-center justify-center p-4 border border-hud-border rounded-lg">
          <span className="text-lg font-bold text-neon-cyan">
            ${minRent.toLocaleString()} - ${maxRent.toLocaleString()}
          </span>
          <span className="text-[10px] tracking-wider text-gray-500 uppercase mt-1">
            Comp Range
          </span>
        </div>

        {/* Avg */}
        <div className="flex flex-col items-center justify-center p-4 border border-hud-border rounded-lg">
          <span className="text-lg font-bold text-neon-orange">
            ${Math.round(avgRent).toLocaleString()}
          </span>
          <span className="text-[10px] tracking-wider text-gray-500 uppercase mt-1">
            Simple Average
          </span>
        </div>

        {/* Confidence */}
        <div className="flex flex-col items-center justify-center p-4 border border-hud-border rounded-lg">
          <span className="text-lg font-bold text-neon-magenta">
            {comps.length >= 8 ? "HIGH" : comps.length >= 5 ? "MEDIUM" : "LOW"}
          </span>
          <span className="text-[10px] tracking-wider text-gray-500 uppercase mt-1">
            Confidence ({comps.length} comps)
          </span>
        </div>
      </div>
    </div>
  );
}
