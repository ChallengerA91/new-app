"use client";

import { useState } from "react";
import { Property } from "@/data/mock-ntreis";

export interface Comp extends Property {
  distance: number;
  similarityScore: number;
}

function SimilarityBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, 100 - score));
  const color =
    pct >= 75
      ? "#39ff14"
      : pct >= 50
        ? "#ffe600"
        : pct >= 25
          ? "#ff6b00"
          : "#ff0040";

  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex-1 h-2 bg-hud-border/30 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full similarity-bar"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
      <span className="text-xs font-mono w-10 text-right" style={{ color }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Active: "bg-neon-green/15 text-neon-green border-neon-green/30",
    Leased: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    Pending: "bg-neon-yellow/15 text-neon-yellow border-neon-yellow/30",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${styles[status as keyof typeof styles] ?? styles.Active}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

function exportToCSV(comps: Comp[]) {
  const headers = ["#", "Address", "City", "State", "Zip", "Beds", "Baths", "Sq Ft", "Type", "Rent", "$/SqFt", "Distance (mi)", "Status", "Match %"];
  const rows = comps.map((c, i) => [
    i + 1,
    c.address,
    c.city,
    c.state,
    c.zip,
    c.beds,
    c.baths,
    c.sqft,
    c.propertyType,
    c.rentPrice,
    (c.rentPrice / c.sqft).toFixed(2),
    c.distance,
    c.status,
    Math.max(0, Math.min(100, 100 - c.similarityScore)).toFixed(0) + "%",
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rental-comps.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function CompsTable({
  comps,
  selectedComps,
  onToggleSelect,
  onViewDetail,
}: {
  comps: Comp[];
  selectedComps?: string[];
  onToggleSelect?: (mlsId: string) => void;
  onViewDetail?: (comp: Comp) => void;
}) {
  const [sortField, setSortField] = useState<string>("similarity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const sorted = [...comps].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "rent": return (a.rentPrice - b.rentPrice) * dir;
      case "sqft": return (a.sqft - b.sqft) * dir;
      case "distance": return (a.distance - b.distance) * dir;
      case "ppsf": return (a.rentPrice / a.sqft - b.rentPrice / b.sqft) * dir;
      case "similarity": return (a.similarityScore - b.similarityScore) * dir;
      default: return 0;
    }
  });

  const SortIcon = ({ field }: { field: string }) => (
    <span className="ml-1 opacity-50">{sortField === field ? (sortDir === "asc" ? "▲" : "▼") : ""}</span>
  );

  return (
    <div
      className="hud-panel rounded-xl mt-6 overflow-hidden"
      style={{ animation: "slide-up 0.6s ease-out" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-hud-border">
        <div className="flex items-center gap-3">
          <svg
            className="w-4 h-4 text-neon-magenta"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M3 10h4l3-7 4 14 3-7h4" />
          </svg>
          <span className="text-[10px] tracking-[0.3em] text-neon-magenta/70 uppercase font-bold">
            Comparable Rentals // Top {comps.length} Matches
          </span>
        </div>
        <div className="flex items-center gap-3">
          {selectedComps && selectedComps.length > 0 && (
            <span className="text-[10px] text-neon-cyan tracking-wider">
              {selectedComps.length} SELECTED
            </span>
          )}
          <button
            onClick={() => exportToCSV(comps)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-wider uppercase border border-neon-cyan/30 text-neon-cyan rounded hover:bg-neon-cyan/10 transition-colors cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.2em] text-gray-500 uppercase border-b border-hud-border/50">
              {onToggleSelect && <th className="px-3 py-3 w-8"></th>}
              <th className="text-left px-6 py-3 font-medium">#</th>
              <th className="text-left px-4 py-3 font-medium">Address</th>
              <th className="text-center px-4 py-3 font-medium">BD/BA</th>
              <th className="text-right px-4 py-3 font-medium cursor-pointer hover:text-neon-cyan transition-colors" onClick={() => handleSort("sqft")}>Sq Ft<SortIcon field="sqft" /></th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-right px-4 py-3 font-medium cursor-pointer hover:text-neon-cyan transition-colors" onClick={() => handleSort("rent")}>Rent<SortIcon field="rent" /></th>
              <th className="text-right px-4 py-3 font-medium cursor-pointer hover:text-neon-cyan transition-colors" onClick={() => handleSort("ppsf")}>$/SqFt<SortIcon field="ppsf" /></th>
              <th className="text-right px-4 py-3 font-medium cursor-pointer hover:text-neon-cyan transition-colors" onClick={() => handleSort("distance")}>Dist<SortIcon field="distance" /></th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium cursor-pointer hover:text-neon-cyan transition-colors" onClick={() => handleSort("similarity")}>Match<SortIcon field="similarity" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((comp, i) => (
              <tr
                key={comp.mlsId}
                className={`comp-row border-b border-hud-border/20 hover:bg-neon-cyan/5 transition-colors ${selectedComps?.includes(comp.mlsId) ? "bg-neon-cyan/10" : ""}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {onToggleSelect && (
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedComps?.includes(comp.mlsId) ?? false}
                      onChange={() => onToggleSelect(comp.mlsId)}
                      className="accent-neon-cyan cursor-pointer"
                    />
                  </td>
                )}
                <td className="px-6 py-3">
                  <span
                    className={`font-mono font-bold text-xs ${
                      i === 0
                        ? "text-neon-green text-glow-green"
                        : i < 3
                          ? "text-neon-cyan"
                          : "text-gray-500"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div
                    className={`font-bold text-white ${onViewDetail ? "cursor-pointer hover:text-neon-cyan transition-colors" : ""}`}
                    onClick={() => onViewDetail?.(comp)}
                  >
                    {comp.address}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {comp.city}, {comp.state} {comp.zip}
                  </div>
                </td>
                <td className="text-center px-4 py-3 font-mono text-gray-300">
                  {comp.beds}/{comp.baths}
                </td>
                <td className="text-right px-4 py-3 font-mono text-gray-300">
                  {comp.sqft.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-neon-magenta/70 text-xs">
                  {comp.propertyType}
                </td>
                <td className="text-right px-4 py-3">
                  <span className="font-mono font-bold text-neon-green">
                    ${comp.rentPrice.toLocaleString()}
                  </span>
                </td>
                <td className="text-right px-4 py-3">
                  <span className="font-mono text-neon-orange text-xs">
                    ${(comp.rentPrice / comp.sqft).toFixed(2)}
                  </span>
                </td>
                <td className="text-right px-4 py-3 font-mono text-gray-400 text-xs">
                  {comp.distance} mi
                </td>
                <td className="text-center px-4 py-3">
                  <StatusBadge status={comp.status} />
                </td>
                <td className="px-4 py-3">
                  <SimilarityBar score={comp.similarityScore} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-hud-border/50 text-xs text-gray-500">
        <span>
          AVG RENT:{" "}
          <span className="text-neon-green font-mono font-bold">
            $
            {Math.round(
              comps.reduce((s, c) => s + c.rentPrice, 0) / comps.length
            ).toLocaleString()}
          </span>
        </span>
        <span>
          AVG SQFT:{" "}
          <span className="text-neon-cyan font-mono">
            {Math.round(
              comps.reduce((s, c) => s + c.sqft, 0) / comps.length
            ).toLocaleString()}
          </span>
        </span>
        <span>
          AVG $/SQFT:{" "}
          <span className="text-neon-orange font-mono">
            $
            {(
              comps.reduce((s, c) => s + c.rentPrice / c.sqft, 0) / comps.length
            ).toFixed(2)}
          </span>
        </span>
      </div>
    </div>
  );
}
