import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

export async function GET() {
  try {
    // ✅ MUST await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get('customerAccessToken')?.value;

    if (!token) {
      return NextResponse.json({ customer: null });
    }

    // ✅ MUST await headers()
    const headerStore = await headers();
    const country = headerStore.get('x-country') || 'CA';

    // ✅ Select correct Shopify store
    const DOMAIN =
      country === 'IN'
        ? process.env.SHOPIFY_DOMAIN_IN
        : process.env.SHOPIFY_DOMAIN_CA;

    const TOKEN =
      country === 'IN'
        ? process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_IN
        : process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_CA;

    if (!DOMAIN || !TOKEN) {
      console.error('❌ Shopify env missing', { country, DOMAIN, TOKEN });
      return NextResponse.json({ customer: null }, { status: 500 });
    }

    const res = await fetch(`https://${DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
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
      console.error('❌ Shopify GraphQL error', json.errors);
      return NextResponse.json({ customer: null });
    }

    return NextResponse.json({
      customer: json.data?.customer ?? null,
    });

  } catch (error) {
    console.error('❌ auth/me error', error);
    return NextResponse.json(
      { customer: null },
      { status: 500 }
    );
  }
}