import { NextRequest, NextResponse } from "next/server";
import { mockProperties, Property } from "@/data/mock-ntreis";

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeSimilarity(subject: Property, comp: Property): number {
  // Weighted similarity score (lower = more similar)
  const bedDiff = Math.abs(subject.beds - comp.beds) * 15;
  const bathDiff = Math.abs(subject.baths - comp.baths) * 10;
  const sqftDiff = (Math.abs(subject.sqft - comp.sqft) / subject.sqft) * 30;
  const typePenalty = subject.propertyType === comp.propertyType ? 0 : 20;
  const distance = haversineDistance(
    subject.lat,
    subject.lng,
    comp.lat,
    comp.lng
  );
  const distScore = Math.min(distance * 5, 25);

  return bedDiff + bathDiff + sqftDiff + typePenalty + distScore;
}

export async function GET(request: NextRequest) {
  const mlsId = request.nextUrl.searchParams.get("mlsId");

  if (!mlsId) {
    return NextResponse.json({ error: "mlsId is required" }, { status: 400 });
  }

  // Simulate network delay for realism
  await new Promise((r) => setTimeout(r, 600));

  const subject = mockProperties.find((p) => p.mlsId === mlsId);
  if (!subject) {
    return NextResponse.json(
      { error: "Property not found" },
      { status: 404 }
    );
  }

  const comps = mockProperties
    .filter((p) => p.mlsId !== mlsId)
    .map((p) => ({
      ...p,
      distance: Math.round(
        haversineDistance(subject.lat, subject.lng, p.lat, p.lng) * 10
      ) / 10,
      similarityScore: Math.round(computeSimilarity(subject, p) * 10) / 10,
    }))
    .sort((a, b) => a.similarityScore - b.similarityScore)
    .slice(0, 10);

  return NextResponse.json({ subject, comps });
}
