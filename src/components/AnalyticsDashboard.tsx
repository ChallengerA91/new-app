"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from "recharts";
import { Comp } from "@/components/CompsTable";

const COLORS = ["#00f0ff", "#ff00e5", "#39ff14", "#ff6b00", "#ffe600", "#ff0040"];

export default function AnalyticsDashboard({ comps }: { comps: Comp[] }) {
  if (comps.length === 0) return null;

  // Rent distribution data (buckets)
  const minRent = Math.min(...comps.map((c) => c.rentPrice));
  const maxRent = Math.max(...comps.map((c) => c.rentPrice));
  const bucketSize = Math.max(250, Math.ceil((maxRent - minRent) / 6 / 250) * 250);
  const bucketStart = Math.floor(minRent / bucketSize) * bucketSize;
  const rentBuckets: { range: string; count: number }[] = [];
  for (let i = bucketStart; i <= maxRent; i += bucketSize) {
    const count = comps.filter((c) => c.rentPrice >= i && c.rentPrice < i + bucketSize).length;
    if (count > 0) {
      rentBuckets.push({ range: `$${(i / 1000).toFixed(1)}k`, count });
    }
  }

  // Property type distribution
  const typeMap: Record<string, number> = {};
  comps.forEach((c) => {
    typeMap[c.propertyType] = (typeMap[c.propertyType] || 0) + 1;
  });
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // Scatter: sqft vs rent
  const scatterData = comps.map((c) => ({
    sqft: c.sqft,
    rent: c.rentPrice,
    name: c.address,
  }));

  return (
    <div
      className="hud-panel rounded-xl p-6 mt-6"
      style={{ animation: "slide-up 0.6s ease-out" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-4 h-4 text-neon-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-[10px] tracking-[0.3em] text-neon-magenta/70 uppercase font-bold">
          Analytics Dashboard
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rent Distribution */}
        <div>
          <h4 className="text-[10px] tracking-wider text-gray-500 uppercase mb-3 text-center">
            Rent Distribution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rentBuckets}>
              <XAxis dataKey="range" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #1e3a5f",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#00f0ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property Types */}
        <div>
          <h4 className="text-[10px] tracking-wider text-gray-500 uppercase mb-3 text-center">
            Property Types
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={(props: any) =>
                  `${props.name ?? ""} ${((Number(props.percent) || 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {typeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #1e3a5f",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sq Ft vs Rent */}
        <div>
          <h4 className="text-[10px] tracking-wider text-gray-500 uppercase mb-3 text-center">
            Sq Ft vs Rent
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f30" />
              <XAxis
                dataKey="sqft"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                name="Sq Ft"
              />
              <YAxis
                dataKey="rent"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                name="Rent"
              />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #1e3a5f",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) =>
                  name === "rent" ? `$${Number(value).toLocaleString()}` : Number(value).toLocaleString()
                }
              />
              <Scatter data={scatterData} fill="#ff00e5" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
