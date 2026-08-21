import { NextRequest, NextResponse } from 'next/server';
import { storefrontFetch } from '@/lib/shopifyCart';

const STORE_MAP: Record<string, string> = {
  CA: 'q00qiq-p0.myshopify.com',
};

const DEFAULT_STORE = 'q00qiq-p0.myshopify.com';

function selectStore(country?: string) {
  return STORE_MAP[country || ''] || DEFAULT_STORE;
}

// Shopify builds checkoutUrl from the market's web presence domain. Here that's
// capellafits.com, which Vercel serves rather than Shopify, so the URL Shopify
// hands back 404s. Point the same cart token at the Shopify domain instead —
// that redirects on to the real checkout.
function onShopifyDomain(url: string, store: string) {
  try {
    const parsed = new URL(url);
    parsed.protocol = 'https:';
    parsed.host = store;
    return parsed.toString();
  } catch {
    return null;
  }
}

const CART_CREATE = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

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

    // Stateless permalink. Kept as the fallback below so a Storefront API
    // hiccup can never stop someone checking out.
    const cartParts = lineItems.map((item: any) => {
      const gid = String(item.variantId);
      const variantId = gid.replace(/\D/g, '');
      const qty = item.quantity || 1;
      return `${variantId}:${qty}`;
    });

    const store = selectStore(country);
    const permalinkUrl = `https://${store}/cart/${cartParts.join(',')}`;

    // A real cart gives us an id we can ask about later. Shopify stops serving
    // a cart once its checkout completes, which is how the storefront knows to
    // clear items the shopper has already paid for.
    try {
      const lines = lineItems.map((item: any) => ({
        merchandiseId: String(item.variantId),
        quantity: item.quantity || 1,
      }));

      const data = await storefrontFetch(CART_CREATE, { lines });
      const userErrors = data?.cartCreate?.userErrors ?? [];
      const cart = data?.cartCreate?.cart;

      const checkoutUrl = cart?.checkoutUrl
        ? onShopifyDomain(cart.checkoutUrl, store)
        : null;

      if (checkoutUrl && userErrors.length === 0) {
        return NextResponse.json({
          success: true,
          checkout: { webUrl: checkoutUrl, cartId: cart.id },
        });
      }

      console.error('cartCreate returned no usable cart:', userErrors);
    } catch (cartErr) {
      console.error('cartCreate failed, falling back to permalink:', cartErr);
    }

    return NextResponse.json({
      success: true,
      checkout: { webUrl: permalinkUrl },
    });
  } catch (err: any) {
    console.error('Checkout API Error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
