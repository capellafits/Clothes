// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

interface GeoRequest extends NextRequest {
  geo?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

// Run on all pages except _next, api, static files
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};

export default function middleware(request: GeoRequest) {
  const url = request.nextUrl.clone();

  const host = request.headers.get('host') || '';
  const existingCountry = url.searchParams.get('country');

  // 1️⃣ If country already set in query (?country=IN/CA), respect it
  if (existingCountry === 'IN' || existingCountry === 'CA') {
    return NextResponse.next();
  }

  // 2️⃣ Detect geo country
  const geoCountry = request.geo?.country?.toUpperCase() || null;

  // 3️⃣ Decide our resolved country
  let resolvedCountry: 'IN' | 'CA' = 'CA';

  // If user is on India domain, force IN
  if (host.includes('in.capellafits.com')) {
    resolvedCountry = 'IN';
  } else if (geoCountry === 'IN') {
    // IP from India
    resolvedCountry = 'IN';
  } else {
    // Everyone else → Canada/global
    resolvedCountry = 'CA';
  }

  // 4️⃣ Attach ?country=... and redirect
  url.searchParams.set('country', resolvedCountry);

  return NextResponse.redirect(url);
}
