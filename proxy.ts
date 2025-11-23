// proxy.ts (in root directory)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Skip localhost
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  // ================================================================
  // CRITICAL: SHOPIFY CHECKOUT REDIRECT (Must be FIRST)
  // ================================================================
  // Check if this is a Shopify cart/checkout URL
  if (pathname.startsWith('/cart/c/') || pathname.startsWith('/checkouts/')) {
    
    const isIndiaDomain = hostname.includes('in.capellafits.com');
    
    // Your Shopify domains
    const shopifyDomain = isIndiaDomain 
      ? '2kgqvk-km.myshopify.com'  // India
      : 'q00qiq-p0.myshopify.com'; // Canada

    // Build full Shopify URL
    const shopifyUrl = `https://${shopifyDomain}${pathname}${search}`;
    
    console.log(`🛒 Redirecting to Shopify: ${shopifyUrl}`);
    
    // IMPORTANT: Use 307 redirect (temporary, preserves POST)
    return NextResponse.redirect(shopifyUrl, { status: 307 });
  }

  // Skip API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Default: continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match EVERYTHING except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif).*)',
  ],
};


