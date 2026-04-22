import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const response = await fetch(
      'https://a.klaviyo.com/client/subscriptions/?company_id=Y4BGsF',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'revision': '2023-12-15' },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              profile: { data: { type: 'profile', attributes: { email } } },
              list_id: 'TqkArd',
            },
          },
        }),
      }
    );

    if (response.ok || response.status === 202) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
