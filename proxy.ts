import { NextResponse, NextRequest } from 'next/server';

interface GeoRequest extends NextRequest {
  geo?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};

export default function proxy(request: GeoRequest) {
  const url = request.nextUrl;

  const country = request.geo?.country?.toLowerCase() || null;

  // GEO REDIRECT
  if (!url.pathname.startsWith('/us') && country === 'us') {
    url.pathname = `/us${url.pathname}`;
    return NextResponse.redirect(url);
  }

  // CHECKOUT REDIRECT
  if (url.pathname.startsWith('/checkout')) {
    return NextResponse.redirect(
      'https://your-shopify-store.myshopify.com' + url.pathname
    );
  }

  return NextResponse.next();
}