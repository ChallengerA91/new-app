"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "@/data/mock-ntreis";
import { Comp } from "@/components/CompsTable";

export default function MapView({
  subject,
  comps,
}: {
  subject: Property;
  comps: Comp[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [subject.lat, subject.lng],
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Subject marker (cyan)
    const subjectIcon = L.divIcon({
      className: "",
      html: `<div style="width:20px;height:20px;background:#00f0ff;border:3px solid #fff;border-radius:50%;box-shadow:0 0 12px #00f0ff,0 0 24px #00f0ff80;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([subject.lat, subject.lng], { icon: subjectIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:monospace;font-size:12px;">
          <b style="color:#00f0ff;">SUBJECT</b><br/>
          <b>${subject.address}</b><br/>
          ${subject.beds}BD/${subject.baths}BA &bull; ${subject.sqft.toLocaleString()} SF<br/>
          <b style="color:#39ff14;">$${subject.rentPrice.toLocaleString()}/mo</b>
        </div>`
      );

    // Comp markers
    comps.forEach((comp, i) => {
      const matchPct = Math.max(0, Math.min(100, 100 - comp.similarityScore));
      const color = matchPct >= 75 ? "#39ff14" : matchPct >= 50 ? "#ffe600" : matchPct >= 25 ? "#ff6b00" : "#ff0040";

      const compIcon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 0 8px ${color}80;display:flex;align-items:center;justify-content:center;font-size:8px;color:#000;font-weight:bold;">${i + 1}</div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker([comp.lat, comp.lng], { icon: compIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:monospace;font-size:12px;">
            <b>#${i + 1}</b> &mdash; ${matchPct.toFixed(0)}% match<br/>
            <b>${comp.address}</b><br/>
            ${comp.beds}BD/${comp.baths}BA &bull; ${comp.sqft.toLocaleString()} SF<br/>
            <b style="color:#39ff14;">$${comp.rentPrice.toLocaleString()}/mo</b><br/>
            ${comp.distance} mi away
          </div>`
        );
    });

    // Fit bounds
    const allPoints: [number, number][] = [
      [subject.lat, subject.lng],
      ...comps.map((c) => [c.lat, c.lng] as [number, number]),
    ];
    map.fitBounds(allPoints, { padding: [40, 40] });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [subject, comps]);

  return (
    <div
      className="hud-panel rounded-xl mt-6 overflow-hidden"
      style={{ animation: "slide-up 0.55s ease-out" }}
    >
      <div className="flex items-center gap-3 px-6 py-3 border-b border-hud-border">
        <svg className="w-4 h-4 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[10px] tracking-[0.3em] text-neon-cyan/70 uppercase font-bold">
          Map View // {comps.length} Comps Plotted
        </span>
      </div>
      <div ref={mapRef} className="w-full h-[400px]" />
    </div>
  );
}
