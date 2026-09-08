// Public Klaviyo client API: never put a private API key in this module.
// Email List triggers the existing welcome email containing WELCOME15.
export async function subscribeToNewsletter(rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const response = await fetch('https://a.klaviyo.com/client/subscriptions/?company_id=Y4BGsF', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      revision: '2026-07-15',
    },
    body: JSON.stringify({
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'Capella website 15% welcome signup',
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email,
                subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
              },
            },
          },
        },
        relationships: { list: { data: { type: 'list', id: 'TJFSmx' } } },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(response.status === 429
      ? 'Please wait a moment before trying again.'
      : 'We could not complete your signup. Please try again.');
  }
}
