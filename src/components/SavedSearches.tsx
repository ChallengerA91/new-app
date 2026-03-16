"use client";

import { useEffect, useState } from "react";

interface SavedSearch {
  mlsId: string;
  address: string;
  city: string;
  savedAt: string;
}

export default function SavedSearches({
  onSelect,
  currentMlsId,
}: {
  onSelect: (mlsId: string) => void;
  currentMlsId?: string;
}) {
  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("rentalcomps-saved");
    if (data) setSaved(JSON.parse(data));
  }, []);

  function save(mlsId: string, address: string, city: string) {
    const updated = [
      { mlsId, address, city, savedAt: new Date().toISOString() },
      ...saved.filter((s) => s.mlsId !== mlsId),
    ].slice(0, 20);
    setSaved(updated);
    localStorage.setItem("rentalcomps-saved", JSON.stringify(updated));
  }

  function remove(mlsId: string) {
    const updated = saved.filter((s) => s.mlsId !== mlsId);
    setSaved(updated);
    localStorage.setItem("rentalcomps-saved", JSON.stringify(updated));
  }

  const isSaved = currentMlsId ? saved.some((s) => s.mlsId === currentMlsId) : false;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {currentMlsId && (
          <button
            onClick={() => {
              if (isSaved) {
                remove(currentMlsId);
              } else {
                const item = saved.find((s) => s.mlsId === currentMlsId);
                save(currentMlsId, item?.address ?? currentMlsId, item?.city ?? "");
              }
            }}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              isSaved
                ? "border-neon-yellow/50 text-neon-yellow"
                : "border-hud-border text-gray-500 hover:text-neon-yellow hover:border-neon-yellow/30"
            }`}
            title={isSaved ? "Remove bookmark" : "Bookmark this property"}
          >
            <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-wider uppercase border border-hud-border text-gray-400 rounded hover:border-neon-yellow/30 hover:text-neon-yellow transition-colors cursor-pointer"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Saved ({saved.length})
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 hud-panel rounded-lg overflow-hidden z-50">
          <div className="px-3 py-2 text-[10px] tracking-[0.3em] text-neon-yellow/50 uppercase border-b border-hud-border">
            Saved Properties
          </div>
          {saved.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-600 text-xs">
              No saved searches yet
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {saved.map((s) => (
                <div
                  key={s.mlsId}
                  className="flex items-center justify-between px-4 py-2 border-b border-hud-border/30 hover:bg-neon-yellow/5 group"
                >
                  <button
                    className="flex-1 text-left cursor-pointer"
                    onClick={() => {
                      onSelect(s.mlsId);
                      setOpen(false);
                    }}
                  >
                    <div className="text-white text-sm font-bold group-hover:text-neon-yellow transition-colors">
                      {s.address}
                    </div>
                    <div className="text-[10px] text-gray-500">{s.city}</div>
                  </button>
                  <button
                    onClick={() => remove(s.mlsId)}
                    className="text-gray-600 hover:text-red-400 ml-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function useSaveProperty() {
  function save(mlsId: string, address: string, city: string) {
    const data = localStorage.getItem("rentalcomps-saved");
    const saved: SavedSearch[] = data ? JSON.parse(data) : [];
    const updated = [
      { mlsId, address, city, savedAt: new Date().toISOString() },
      ...saved.filter((s) => s.mlsId !== mlsId),
    ].slice(0, 20);
    localStorage.setItem("rentalcomps-saved", JSON.stringify(updated));
  }
  return { save };
}
