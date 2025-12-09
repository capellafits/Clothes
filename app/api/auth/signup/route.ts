import { NextResponse } from 'next/server';
import { getShopifyCustomerConfig, shopifyCustomerFetch } from '@/lib/shopifyCustomer';

export async function POST(req: Request) {
  const { email, password, firstName, lastName, country } = await req.json();
  const { domain, token } = getShopifyCustomerConfig(country);

  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch(domain, token, mutation, {
    input: {
      email,
      password,
      firstName,
      lastName,
    },
  });

  const result = data.customerCreate;

  if (result.customerUserErrors?.length) {
    return NextResponse.json(
      { error: result.customerUserErrors[0].message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}