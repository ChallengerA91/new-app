"use client";

import { Property } from "@/data/mock-ntreis";
import { Comp } from "@/components/CompsTable";

export default function ComparisonView({
  subject,
  comps,
  onClose,
}: {
  subject: Property;
  comps: Comp[];
  onClose: () => void;
}) {
  const items = [subject, ...comps];
  const fields: { label: string; render: (p: Property | Comp) => React.ReactNode }[] = [
    { label: "Address", render: (p) => <span className="text-white font-bold">{p.address}</span> },
    { label: "City", render: (p) => <span>{p.city}, {p.state}</span> },
    { label: "Beds", render: (p) => <span className="text-neon-cyan font-bold">{p.beds}</span> },
    { label: "Baths", render: (p) => <span className="text-neon-cyan font-bold">{p.baths}</span> },
    { label: "Sq Ft", render: (p) => <span className="font-mono">{p.sqft.toLocaleString()}</span> },
    { label: "Type", render: (p) => <span className="text-neon-magenta/70">{p.propertyType}</span> },
    { label: "Rent", render: (p) => <span className="text-neon-green font-bold font-mono">${p.rentPrice.toLocaleString()}</span> },
    { label: "$/SqFt", render: (p) => <span className="text-neon-orange font-mono">${(p.rentPrice / p.sqft).toFixed(2)}</span> },
    { label: "Year Built", render: (p) => <span>{p.yearBuilt}</span> },
    { label: "DOM", render: (p) => <span>{p.daysOnMarket}</span> },
    { label: "Status", render: (p) => <span className={p.status === "Active" ? "text-neon-green" : p.status === "Pending" ? "text-neon-yellow" : "text-gray-400"}>{p.status}</span> },
    {
      label: "Distance",
      render: (p) => "distance" in p ? <span className="font-mono">{(p as Comp).distance} mi</span> : <span className="text-neon-cyan">Subject</span>,
    },
    {
      label: "Match",
      render: (p) => "similarityScore" in p ? <span className="font-mono">{Math.max(0, Math.min(100, 100 - (p as Comp).similarityScore)).toFixed(0)}%</span> : <span className="text-neon-cyan">--</span>,
    },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative hud-panel rounded-xl p-6 max-w-5xl w-full max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slide-up 0.3s ease-out" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
            <span className="text-[10px] tracking-[0.3em] text-neon-cyan/60 uppercase font-bold">
              Side-by-Side Comparison // {comps.length} Comp{comps.length !== 1 ? "s" : ""} vs Subject
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hud-border">
                <th className="text-left px-4 py-2 text-[10px] tracking-wider text-gray-500 uppercase w-28">Field</th>
                {items.map((p, i) => (
                  <th key={i} className="text-center px-4 py-2 text-[10px] tracking-wider uppercase min-w-[140px]">
                    <span className={i === 0 ? "text-neon-cyan" : "text-gray-400"}>
                      {i === 0 ? "Subject" : `Comp #${i}`}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.label} className="border-b border-hud-border/20">
                  <td className="px-4 py-2 text-[10px] tracking-wider text-gray-500 uppercase">{field.label}</td>
                  {items.map((p, i) => (
                    <td key={i} className={`text-center px-4 py-2 ${i === 0 ? "bg-neon-cyan/5" : ""}`}>
                      {field.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
