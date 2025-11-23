// app/api/shopify/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout API ');
    
    const body = await request.json();
    const { lineItems, country } = body;

    console.log(' Request data:', { country, items: lineItems?.length });

    // Validate
    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!country) {
      return NextResponse.json({ error: 'No country specified' }, { status: 400 });
    }

    // Get credentials
    let domain: string;
    let token: string;

    if (country === 'CA') {
      domain = process.env.SHOPIFY_DOMAIN_CA || '';
      token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_CA || '';
      console.log('🇨🇦 Using Canada store');
    } else {
      domain = process.env.SHOPIFY_DOMAIN_IN || '';
      token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_IN || '';
      console.log('🇮🇳 Using India store');
    }

    // Validate credentials
    if (!domain) {
      console.error('❌ Missing domain for country:', country);
      return NextResponse.json({ error: `Missing domain for ${country}` }, { status: 500 });
    }

    if (!token) {
      console.error('❌ Missing token for country:', country);
      return NextResponse.json({ error: `Missing token for ${country}` }, { status: 500 });
    }

    console.log('✅ Using domain:', domain);

    // Shopify mutation
    const mutation = `
      mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
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

    const variables = {
      input: {
        lines: lineItems.map((item: any) => ({
          merchandiseId: item.variantId,
          quantity: item.quantity,
        })),
      },
    };

    console.log('📤 Sending to Shopify GraphQL API...');

    // Call Shopify
    const shopifyResponse = await fetch(
      `https://${domain}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      }
    );

    console.log('Shopify response status:', shopifyResponse.status);

    if (!shopifyResponse.ok) {
      const text = await shopifyResponse.text();
      console.error('❌ Shopify error:', text);
      return NextResponse.json(
        { error: 'Failed to reach Shopify' },
        { status: shopifyResponse.status }
      );
    }

    const shopifyData = await shopifyResponse.json();
    console.log('📥 Shopify response:', JSON.stringify(shopifyData, null, 2));

    // Check errors
    if (shopifyData.errors) {
      console.error('❌ GraphQL errors:', shopifyData.errors);
      return NextResponse.json(
        { error: shopifyData.errors[0]?.message },
        { status: 400 }
      );
    }

    // Get checkout URL
    const checkoutUrl = shopifyData.data?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      console.error(' No checkout URL:', shopifyData);
      return NextResponse.json(
        { error: 'No checkout URL returned' },
        { status: 400 }
      );
    }

    console.log(' Success! Checkout URL:', checkoutUrl);

    return NextResponse.json({
      success: true,
      checkout: { webUrl: checkoutUrl },
    });
  } catch (error) {
    console.error(' API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
