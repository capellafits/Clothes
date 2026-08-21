import { NextRequest, NextResponse } from 'next/server';
import { storefrontFetch } from '@/lib/shopifyCart';

const CART_STATUS = `
  query CartStatus($id: ID!) {
    cart(id: $id) {
      id
      totalQuantity
    }
  }
`;

// Reports whether the cart we sent a shopper to checkout with is still live.
// Shopify stops returning a cart once its checkout completes, so `active:false`
// means the order went through (or the cart expired) and the storefront copy is
// stale. Every failure path answers `active:true`: never wipe someone's cart
// because of a transient error.
export async function POST(request: NextRequest) {
  try {
    const { cartId } = await request.json();

    if (!cartId || typeof cartId !== 'string') {
      return NextResponse.json({ active: true });
    }

    const data = await storefrontFetch(CART_STATUS, { id: cartId });
    const cart = data?.cart;
    const active = !!cart && (cart.totalQuantity ?? 0) > 0;

    return NextResponse.json({ active });
  } catch (err) {
    console.error('cart-status check failed:', err);
    return NextResponse.json({ active: true });
  }
}
