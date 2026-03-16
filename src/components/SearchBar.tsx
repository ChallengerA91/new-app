"use client";

import { useState, useRef, useEffect } from "react";

interface SearchResult {
  mlsId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  rentPrice: number;
}

export default function SearchBar({
  onSelect,
}: {
  onSelect: (mlsId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounce.current) clearTimeout(debounce.current);
    if (value.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    debounce.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data);
      setOpen(data.length > 0);
      setLoading(false);
    }, 250);
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      {/* Decorative corner brackets */}
      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-neon-cyan opacity-60" />
      <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-neon-cyan opacity-60" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-neon-cyan opacity-60" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-neon-cyan opacity-60" />

      <div className="flex items-center gap-3 hud-panel rounded-lg px-4 py-3">
        {/* Targeting reticle icon */}
        <svg
          className="w-5 h-5 text-neon-cyan flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="1" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="1" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="23" y2="12" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="ENTER TARGET ADDRESS..."
          className="input-hud flex-1 bg-transparent text-neon-cyan placeholder-neon-cyan/30 font-bold tracking-wider text-lg outline-none border-none"
        />

        {loading && (
          <div className="w-5 h-5 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full hud-panel rounded-lg overflow-hidden max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] tracking-[0.3em] text-neon-cyan/50 uppercase border-b border-hud-border">
            {results.length} targets acquired
          </div>
          {results.map((r) => (
            <button
              key={r.mlsId}
              onClick={() => {
                onSelect(r.mlsId);
                setOpen(false);
                setQuery(r.address);
              }}
              className="w-full text-left px-4 py-3 hover:bg-neon-cyan/10 border-b border-hud-border/30 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold group-hover:text-neon-cyan transition-colors">
                    {r.address}
                  </span>
                  <span className="text-gray-500 ml-2 text-sm">
                    {r.city}, {r.state} {r.zip}
                  </span>
                </div>
                <span className="text-neon-green font-mono text-sm">
                  ${r.rentPrice.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex gap-4 mt-1 text-xs text-gray-500">
                <span>{r.beds}BD</span>
                <span>{r.baths}BA</span>
                <span>{r.sqft.toLocaleString()} SF</span>
                <span className="text-neon-magenta/60">{r.propertyType}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
