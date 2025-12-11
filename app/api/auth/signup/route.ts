// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { getShopifyCustomerConfig, shopifyCustomerFetch } from '@/lib/shopifyCustomer';

const CUSTOMER_COOKIE = 'customerAccessToken';

export async function POST(req: Request) {
  const { firstName, lastName, email, password, country } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const { domain, token } = getShopifyCustomerConfig(country);

  // 1) Create customer
  const createMutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const createData = await shopifyCustomerFetch(domain, token, createMutation, {
    input: {
      firstName,
      lastName,
      email,
      password,
    },
  });

  const create = createData.customerCreate;

  if (!create.customer) {
    return NextResponse.json(
      { error: create.customerUserErrors?.[0]?.message || 'Signup failed' },
      { status: 400 },
    );
  }

  // 2) Immediately create access token (auto-login)
  const tokenMutation = `
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

  const tokenData = await shopifyCustomerFetch(domain, token, tokenMutation, {
    input: { email, password },
  });

  const auth = tokenData.customerAccessTokenCreate;

  if (!auth.customerAccessToken) {
    return NextResponse.json(
      { error: auth.customerUserErrors?.[0]?.message || 'Could not login after signup' },
      { status: 400 },
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