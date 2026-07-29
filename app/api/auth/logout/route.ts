// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

const CUSTOMER_COOKIE = 'customerAccessToken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CUSTOMER_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ customer: null });
    }

    const headerStore = await headers();
    const country = headerStore.get('x-country') || 'CA';

    const DOMAIN = process.env.SHOPIFY_DOMAIN_CA;

    const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_CA;

    if (!DOMAIN || !STOREFRONT_TOKEN) {
      console.error('Missing Shopify env', { country, DOMAIN, STOREFRONT_TOKEN });
      return NextResponse.json({ customer: null }, { status: 500 });
    }

    const res = await fetch(`https://${DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: `
          query getCustomer($token: String!) {
            customer(customerAccessToken: $token) {
              id
              firstName
              lastName
              email
            }
          }
        `,
        variables: { token },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      console.error('Shopify GraphQL error', json.errors);
      return NextResponse.json({ customer: null });
    }

    return NextResponse.json({ customer: json.data?.customer ?? null });
  } catch (err) {
    console.error('auth/me error', err);
    return NextResponse.json({ customer: null }, { status: 500 });
  }
}
