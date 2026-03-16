import { NextRequest, NextResponse } from "next/server";
import { mockProperties } from "@/data/mock-ntreis";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  const results = mockProperties.filter(
    (p) =>
      p.address.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.zip.includes(query) ||
      p.subdivision.toLowerCase().includes(query)
  );

  return NextResponse.json(
    results.map((p) => ({
      mlsId: p.mlsId,
      address: p.address,
      city: p.city,
      state: p.state,
      zip: p.zip,
      beds: p.beds,
      baths: p.baths,
      sqft: p.sqft,
      propertyType: p.propertyType,
      rentPrice: p.rentPrice,
    }))
  );
}
