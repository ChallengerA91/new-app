"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SubjectCard from "@/components/SubjectCard";
import CompsTable from "@/components/CompsTable";
import { Property } from "@/data/mock-ntreis";

interface CompResult extends Property {
  distance: number;
  similarityScore: number;
}

export default function Home() {
  const [subject, setSubject] = useState<Property | null>(null);
  const [comps, setComps] = useState<CompResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSelect(mlsId: string) {
    setLoading(true);
    setHasSearched(true);
    setSubject(null);
    setComps([]);

    const res = await fetch(`/api/comps?mlsId=${mlsId}`);
    const data = await res.json();

    // Small delay for dramatic effect
    await new Promise((r) => setTimeout(r, 200));

    setSubject(data.subject);
    setComps(data.comps);
    setLoading(false);
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 max-w-7xl mx-auto">
      {/* Top HUD bar */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[9px] tracking-[0.3em] text-gray-600 uppercase">
            System Online
          </span>
        </div>
        <span className="text-[9px] tracking-[0.3em] text-gray-600 uppercase font-mono">
          NTREIS v2.0 // Mock Data
        </span>
      </div>

      {/* Title area */}
      <div className="text-center mb-10 mt-6">
        <div className="inline-block relative">
          <h1
            className="text-5xl md:text-6xl font-black tracking-tight text-white"
            style={{ animation: "flicker 4s infinite" }}
          >
            RENTAL
            <span className="text-neon-cyan text-glow-cyan">COMPS</span>
          </h1>
          <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
        </div>
        <p className="text-gray-500 text-sm tracking-[0.2em] uppercase mt-4">
          Property Intelligence System // DFW Metroplex
        </p>
      </div>

      {/* Search */}
      <SearchBar onSelect={handleSelect} />

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-16 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-neon-cyan/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-neon-cyan rounded-full animate-spin" />
            <div className="absolute inset-2 border-2 border-transparent border-b-neon-magenta rounded-full animate-spin [animation-direction:reverse] [animation-duration:0.6s]" />
          </div>
          <span className="text-[10px] tracking-[0.4em] text-neon-cyan/60 uppercase animate-pulse">
            Analyzing Comparables...
          </span>
        </div>
      )}

      {/* Results */}
      {subject && !loading && (
        <div>
          <SubjectCard property={subject} />
          {comps.length > 0 && <CompsTable comps={comps} />}
        </div>
      )}

      {/* Empty state */}
      {!hasSearched && !loading && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="relative mb-6">
            <svg
              className="w-20 h-20 text-hud-border"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.5}
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-neon-cyan/20 rounded-full animate-ping" />
            </div>
          </div>
          <p className="text-gray-600 text-sm tracking-wider uppercase">
            Enter an address to begin target acquisition
          </p>
          <p className="text-gray-700 text-xs mt-2 max-w-md">
            Try searching for &quot;Dallas&quot;, &quot;Fort Worth&quot;,
            &quot;Plano&quot;, &quot;Oak Lawn&quot;, or any street name
          </p>
        </div>
      )}

      {/* Bottom HUD decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent pointer-events-none" />
      <div className="fixed bottom-2 left-4 text-[8px] tracking-[0.3em] text-gray-700 uppercase pointer-events-none">
        RentalCOMPS HQ &copy; 2026
      </div>
      <div className="fixed bottom-2 right-4 text-[8px] tracking-[0.3em] text-gray-700 uppercase font-mono pointer-events-none">
        {"{"}NTREIS{"}"}
      </div>
    </main>
  );
}
