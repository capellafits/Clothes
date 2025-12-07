export function getShopifyCustomerConfig(country: "IN" | "CA") {
  if (country === "IN") {
    return {
      domain: process.env.SHOPIFY_DOMAIN_IN!,
      token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_IN!
    };
  }

  return {
    domain: process.env.SHOPIFY_DOMAIN_CA!,
    token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_CA!
  };
}

export async function shopifyCustomerFetch(
  domain: string,
  token: string,
  query: string,
  variables?: any
) {
  const res = await fetch(
    `https://${domain}/api/2024-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const json = await res.json();

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }

  return json.data;
}