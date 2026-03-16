"use client";

export interface FilterState {
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  maxDistance: number;
  status: string;
}

export const defaultFilters: FilterState = {
  propertyType: "All",
  minPrice: 0,
  maxPrice: 10000,
  maxDistance: 100,
  status: "All",
};

export default function Filters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}) {
  return (
    <div
      className="hud-panel rounded-lg p-4 mt-4"
      style={{ animation: "slide-up 0.4s ease-out" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-3.5 h-3.5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-[10px] tracking-[0.3em] text-neon-cyan/60 uppercase">
          Filters
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Property Type */}
        <div>
          <label className="block text-[9px] tracking-wider text-gray-500 uppercase mb-1">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => onChange({ ...filters, propertyType: e.target.value })}
            className="w-full bg-hud-bg border border-hud-border rounded px-2 py-1.5 text-xs text-white focus:border-neon-cyan outline-none"
          >
            <option value="All">All Types</option>
            <option value="Single Family">Single Family</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Duplex">Duplex</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-[9px] tracking-wider text-gray-500 uppercase mb-1">
            Min Rent
          </label>
          <input
            type="number"
            value={filters.minPrice || ""}
            onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) || 0 })}
            placeholder="$0"
            className="w-full bg-hud-bg border border-hud-border rounded px-2 py-1.5 text-xs text-white focus:border-neon-cyan outline-none"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[9px] tracking-wider text-gray-500 uppercase mb-1">
            Max Rent
          </label>
          <input
            type="number"
            value={filters.maxPrice >= 10000 ? "" : filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) || 10000 })}
            placeholder="No max"
            className="w-full bg-hud-bg border border-hud-border rounded px-2 py-1.5 text-xs text-white focus:border-neon-cyan outline-none"
          />
        </div>

        {/* Max Distance */}
        <div>
          <label className="block text-[9px] tracking-wider text-gray-500 uppercase mb-1">
            Max Distance (mi)
          </label>
          <input
            type="number"
            value={filters.maxDistance >= 100 ? "" : filters.maxDistance}
            onChange={(e) => onChange({ ...filters, maxDistance: Number(e.target.value) || 100 })}
            placeholder="No max"
            className="w-full bg-hud-bg border border-hud-border rounded px-2 py-1.5 text-xs text-white focus:border-neon-cyan outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-[9px] tracking-wider text-gray-500 uppercase mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full bg-hud-bg border border-hud-border rounded px-2 py-1.5 text-xs text-white focus:border-neon-cyan outline-none"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Leased">Leased</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
