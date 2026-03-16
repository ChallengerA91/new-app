"use client";

import { Comp } from "@/components/CompsTable";

export default function NeighborhoodSummary({
  comps,
  subjectCity,
}: {
  comps: Comp[];
  subjectCity: string;
}) {
  if (comps.length === 0) return null;

  // Group by city
  const cityMap: Record<string, Comp[]> = {};
  comps.forEach((c) => {
    if (!cityMap[c.city]) cityMap[c.city] = [];
    cityMap[c.city].push(c);
  });

  const cities = Object.entries(cityMap)
    .map(([city, props]) => {
      const avgRent = Math.round(props.reduce((s, c) => s + c.rentPrice, 0) / props.length);
      const avgSqft = Math.round(props.reduce((s, c) => s + c.sqft, 0) / props.length);
      const avgPpsf = props.reduce((s, c) => s + c.rentPrice / c.sqft, 0) / props.length;
      const types = [...new Set(props.map((p) => p.propertyType))];
      return { city, count: props.length, avgRent, avgSqft, avgPpsf, types };
    })
    .sort((a, b) => b.count - a.count);

  const totalAvgRent = Math.round(comps.reduce((s, c) => s + c.rentPrice, 0) / comps.length);
  const totalAvgSqft = Math.round(comps.reduce((s, c) => s + c.sqft, 0) / comps.length);

  return (
    <div
      className="hud-panel rounded-xl p-6 mt-6"
      style={{ animation: "slide-up 0.65s ease-out" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-4 h-4 text-neon-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span className="text-[10px] tracking-[0.3em] text-neon-yellow/70 uppercase font-bold">
          Neighborhood Summary // {subjectCity} Area
        </span>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 border border-neon-yellow/20 rounded-lg">
          <div className="text-2xl font-black text-neon-green">${totalAvgRent.toLocaleString()}</div>
          <div className="text-[9px] tracking-wider text-gray-500 uppercase">Avg Rent (All Comps)</div>
        </div>
        <div className="text-center p-3 border border-neon-yellow/20 rounded-lg">
          <div className="text-2xl font-black text-neon-cyan">{totalAvgSqft.toLocaleString()}</div>
          <div className="text-[9px] tracking-wider text-gray-500 uppercase">Avg Sq Ft</div>
        </div>
        <div className="text-center p-3 border border-neon-yellow/20 rounded-lg">
          <div className="text-2xl font-black text-neon-orange">
            ${(comps.reduce((s, c) => s + c.rentPrice / c.sqft, 0) / comps.length).toFixed(2)}
          </div>
          <div className="text-[9px] tracking-wider text-gray-500 uppercase">Avg $/SqFt</div>
        </div>
      </div>

      {/* By city breakdown */}
      <div className="space-y-3">
        {cities.map(({ city, count, avgRent, avgSqft, avgPpsf, types }) => (
          <div
            key={city}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              city === subjectCity
                ? "border-neon-cyan/30 bg-neon-cyan/5"
                : "border-hud-border/30"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${city === subjectCity ? "text-neon-cyan" : "text-white"}`}>
                  {city}
                </span>
                {city === subjectCity && (
                  <span className="text-[8px] tracking-wider bg-neon-cyan/20 text-neon-cyan px-1.5 py-0.5 rounded uppercase">
                    Subject Area
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {count} comp{count !== 1 ? "s" : ""} &bull; {types.join(", ")}
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="text-neon-green font-mono font-bold text-sm">${avgRent.toLocaleString()}</div>
                <div className="text-[9px] text-gray-600">avg rent</div>
              </div>
              <div>
                <div className="text-neon-cyan font-mono text-sm">{avgSqft.toLocaleString()}</div>
                <div className="text-[9px] text-gray-600">avg sqft</div>
              </div>
              <div>
                <div className="text-neon-orange font-mono text-sm">${avgPpsf.toFixed(2)}</div>
                <div className="text-[9px] text-gray-600">$/sqft</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
