const API_VERSION = '2024-10';

function getConfig() {
  return {
    domain: process.env.SHOPIFY_STORE_DOMAIN_CA,
    token: process.env.SHOPIFY_STOREFRONT_TOKEN_CA,
  };
}

export async function storefrontFetch(
  query: string,
  variables: Record<string, unknown>
): Promise<any> {
  const { domain, token } = getConfig();

  if (!domain || !token) {
    throw new Error('Missing Shopify storefront credentials');
  }

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Storefront API responded ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message || 'Storefront API error');
  }

  return json.data;
}
