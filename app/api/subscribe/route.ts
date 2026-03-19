import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN_CA;
    const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN_CA;

    if (!domain || !token) {
      return NextResponse.json({ error: 'Missing Shopify config' }, { status: 500 });
    }

    const response = await fetch(
      `https://${domain}/admin/api/2024-01/customers.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: JSON.stringify({
          customer: {
            email,
            tags: 'popup-signup',
            email_marketing_consent: {
              state: 'subscribed',
              opt_in_level: 'single_opt_in',
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle duplicate customer (already exists)
      if (data.errors?.email) {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 422 }
        );
      }
      return NextResponse.json({ error: 'Shopify error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
