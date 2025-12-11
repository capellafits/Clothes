// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { getShopifyCustomerConfig, shopifyCustomerFetch } from '@/lib/shopifyCustomer';

const CUSTOMER_COOKIE = 'customerAccessToken';

export async function POST(req: Request) {
  const { email, password, country } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const { domain, token } = getShopifyCustomerConfig(country);

  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch(domain, token, mutation, {
    input: { email, password },
  });

  const auth = data.customerAccessTokenCreate;

  if (!auth.customerAccessToken) {
    return NextResponse.json(
      { error: auth.customerUserErrors?.[0]?.message || 'Invalid email or password' },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set(CUSTOMER_COOKIE, auth.customerAccessToken.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });

  return res;
}