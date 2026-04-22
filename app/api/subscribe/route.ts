import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const response = await fetch(
      'https://a.klaviyo.com/client/subscriptions/?company_id=Y4BGsF',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': '2023-10-15',
        },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              profile: {
                data: {
                  type: 'profile',
                  attributes: { email },
                },
              },
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: 'TqkArd',
                },
              },
            },
          },
        }),
      }
    );

    const responseText = await response.text();
    console.log('Klaviyo status:', response.status, responseText);

    if (response.ok || response.status === 202) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed', details: responseText }, { status: 500 });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
