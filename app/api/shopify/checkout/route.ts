import { NextRequest, NextResponse } from 'next/server';

const STORE_MAP: Record<string, string> = {
  IN: 'capellafits-in.myshopify.com',
  US: 'capellafits.myshopify.com',
};

const DEFAULT_STORE = 'capellafits.myshopify.com';

function selectStore(country?: string) {
  return STORE_MAP[country || ''] || DEFAULT_STORE;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineItems, country } = body;

    if (!lineItems || !Array.isArray(lineItems)) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    const cartParts = lineItems.map((item: any) => {
      const gid = String(item.variantId);
      const variantId = gid.replace(/\D/g, '');
      const qty = item.quantity || 1;
      return `${variantId}:${qty}`;
    });

    const store = selectStore(country);
    const checkoutUrl = `https://${store}/cart/${cartParts.join(',')}`;

    console.log('Generated checkout URL:', checkoutUrl);

    return NextResponse.json({
      success: true,
      checkout: { webUrl: checkoutUrl },
    });
  } catch (err: any) {
    console.error('Checkout API Error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
