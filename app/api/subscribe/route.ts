import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const klaviyoBody = {
      data: {
        type: 'subscription',
        attributes: {
          list_id: 'TqkArd',
          email: email,
          subscriptions: {
            email: {
              marketing: {
                consent: 'SUBSCRIBED',
              },
            },
          },
        },
        relationships: {
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: email,
              },
            },
          },
        },
      },
    };

    const response = await fetch(
      'https://a.klaviyo.com/client/subscriptions/?company_id=Y4BGsF',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': '2024-02-15',
        },
        body: JSON.stringify(klaviyoBody),
      }
    );

    const responseText = await response.text();
    console.log('Klaviyo status:', response.status);
    console.log('Klaviyo response:', responseText);

    if (response.ok || response.status === 202) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Klaviyo error', details: responseText },
      { status: 500 }
    );
  } catch (err) {
    console.error('Subscribe route error:', err);
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
}
