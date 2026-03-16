"use client";

import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import SubjectCard from "@/components/SubjectCard";
import CompsTable, { Comp } from "@/components/CompsTable";
import ThemeToggle from "@/components/ThemeToggle";
import Filters, { FilterState, defaultFilters } from "@/components/Filters";
import RentEstimate from "@/components/RentEstimate";
import PropertyModal from "@/components/PropertyModal";
import ComparisonView from "@/components/ComparisonView";
import SavedSearches, { useSaveProperty } from "@/components/SavedSearches";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import NeighborhoodSummary from "@/components/NeighborhoodSummary";
import { Property } from "@/data/mock-ntreis";

const MapView = lazy(() => import("@/components/MapView"));

export default function Home() {
  const [subject, setSubject] = useState<Property | null>(null);
  const [comps, setComps] = useState<Comp[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [dark, setDark] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedComps, setSelectedComps] = useState<string[]>([]);
  const [detailComp, setDetailComp] = useState<Comp | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState<"table" | "map" | "analytics">("table");
  const { save } = useSaveProperty();

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !dark);
  }, [dark]);

  async function handleSelect(mlsId: string) {
    setLoading(true);
    setHasSearched(true);
    setSubject(null);
    setComps([]);
    setSelectedComps([]);

    const res = await fetch(`/api/comps?mlsId=${mlsId}`);
    const data = await res.json();

    await new Promise((r) => setTimeout(r, 200));

    setSubject(data.subject);
    setComps(data.comps);
    setLoading(false);

    if (data.subject) {
      save(data.subject.mlsId, data.subject.address, data.subject.city);
    }
  }

  const filteredComps = useMemo(() => {
    return comps.filter((c) => {
      if (filters.propertyType !== "All" && c.propertyType !== filters.propertyType) return false;
      if (c.rentPrice < filters.minPrice) return false;
      if (filters.maxPrice < 10000 && c.rentPrice > filters.maxPrice) return false;
      if (filters.maxDistance < 100 && c.distance > filters.maxDistance) return false;
      if (filters.status !== "All" && c.status !== filters.status) return false;
      return true;
    });
  }, [comps, filters]);

  function toggleCompSelect(mlsId: string) {
    setSelectedComps((prev) =>
      prev.includes(mlsId) ? prev.filter((id) => id !== mlsId) : [...prev, mlsId]
    );
  }

  const selectedCompObjects = filteredComps.filter((c) => selectedComps.includes(c.mlsId));

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
        <div className="flex items-center gap-3">
          <SavedSearches onSelect={handleSelect} currentMlsId={subject?.mlsId} />
          <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />
          <span className="text-[9px] tracking-[0.3em] text-gray-600 uppercase font-mono">
            NTREIS v2.0
          </span>
        </div>
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

      {/* Filter toggle + action buttons */}
      {subject && !loading && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-wider uppercase border rounded transition-colors cursor-pointer ${
                showFilters
                  ? "border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10"
                  : "border-hud-border text-gray-400 hover:border-neon-cyan/30"
              }`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>

            {selectedComps.length >= 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-wider uppercase border border-neon-magenta/30 text-neon-magenta rounded hover:bg-neon-magenta/10 transition-colors cursor-pointer"
              >
                Compare ({selectedComps.length})
              </button>
            )}
          </div>

          {/* View tabs */}
          <div className="flex items-center gap-1 border border-hud-border rounded overflow-hidden">
            {(["table", "map", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-neon-cyan/20 text-neon-cyan"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {tab === "table" ? "Table" : tab === "map" ? "Map" : "Analytics"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters panel */}
      {showFilters && subject && !loading && (
        <Filters filters={filters} onChange={setFilters} />
      )}

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
          <RentEstimate subject={subject} comps={filteredComps} />

          {filteredComps.length > 0 && activeTab === "table" && (
            <CompsTable
              comps={filteredComps}
              selectedComps={selectedComps}
              onToggleSelect={toggleCompSelect}
              onViewDetail={setDetailComp}
            />
          )}

          {activeTab === "map" && (
            <Suspense
              fallback={
                <div className="hud-panel rounded-xl mt-6 h-[400px] flex items-center justify-center">
                  <span className="text-[10px] tracking-[0.4em] text-neon-cyan/60 uppercase animate-pulse">
                    Loading Map...
                  </span>
                </div>
              }
            >
              <MapView subject={subject} comps={filteredComps} />
            </Suspense>
          )}

          {activeTab === "analytics" && (
            <AnalyticsDashboard comps={filteredComps} />
          )}

          <NeighborhoodSummary comps={filteredComps} subjectCity={subject.city} />
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

      {/* Modals */}
      {detailComp && (
        <PropertyModal comp={detailComp} onClose={() => setDetailComp(null)} />
      )}
      {showComparison && subject && selectedCompObjects.length >= 2 && (
        <ComparisonView
          subject={subject}
          comps={selectedCompObjects}
          onClose={() => setShowComparison(false)}
        />
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
