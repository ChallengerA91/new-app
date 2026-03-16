"use client";

import { Property } from "@/data/mock-ntreis";

function StatBox({
  label,
  value,
  color = "cyan",
}: {
  label: string;
  value: string | number;
  color?: "cyan" | "magenta" | "green" | "orange" | "yellow";
}) {
  const glowClass = `text-glow-${color}`;
  const colorMap = {
    cyan: "text-neon-cyan border-neon-cyan/30",
    magenta: "text-neon-magenta border-neon-magenta/30",
    green: "text-neon-green border-neon-green/30",
    orange: "text-neon-orange border-neon-orange/30",
    yellow: "text-neon-yellow border-neon-yellow/30",
  };

  return (
    <div
      className={`hud-panel rounded-lg px-4 py-3 border ${colorMap[color]} flex flex-col items-center`}
    >
      <span
        className={`text-2xl font-black ${colorMap[color].split(" ")[0]} ${glowClass}`}
      >
        {value}
      </span>
      <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mt-1">
        {label}
      </span>
    </div>
  );
}

export default function SubjectCard({ property }: { property: Property }) {
  return (
    <div
      className="hud-panel rounded-xl p-6 mt-8"
      style={{ animation: "slide-up 0.5s ease-out" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] text-neon-cyan/60 uppercase">
            Subject Property // Locked
          </span>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-gray-600 font-mono">
          MLS# {property.mlsId}
        </span>
      </div>

      {/* Address */}
      <h2 className="text-2xl font-black text-white tracking-wide mb-1">
        {property.address}
      </h2>
      <p className="text-gray-400 text-sm mb-5">
        {property.city}, {property.state} {property.zip} &mdash;{" "}
        <span className="text-neon-magenta/70">{property.subdivision}</span>
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="Beds" value={property.beds} color="cyan" />
        <StatBox label="Baths" value={property.baths} color="cyan" />
        <StatBox
          label="Sq Ft"
          value={property.sqft.toLocaleString()}
          color="magenta"
        />
        <StatBox label="Type" value={property.propertyType} color="orange" />
        <StatBox
          label="Rent"
          value={`$${property.rentPrice.toLocaleString()}`}
          color="green"
        />
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-hud-border/50">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              property.status === "Active"
                ? "bg-neon-green"
                : property.status === "Pending"
                  ? "bg-neon-yellow"
                  : "bg-gray-500"
            }`}
          />
          <span className="text-xs text-gray-400">{property.status}</span>
        </div>
        <span className="text-xs text-gray-600 font-mono">
          {property.daysOnMarket} DOM &bull; Built {property.yearBuilt}
        </span>
      </div>
    </div>
  );
}
