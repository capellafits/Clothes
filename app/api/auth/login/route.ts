import { NextResponse } from "next/server";
import { getShopifyCustomerConfig, shopifyCustomerFetch } from "@/lib/shopifyCustomer";

export async function POST(req: Request) {
  const { email, password, country } = await req.json();
  const { domain, token } = getShopifyCustomerConfig(country);

  const mutation = `
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

  const data = await shopifyCustomerFetch(domain, token, mutation, {
    input: { email, password }
  });

  const auth = data.customerAccessTokenCreate;

  if (!auth.customerAccessToken) {
    return NextResponse.json({ error: auth.customerUserErrors }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("customerToken", auth.customerAccessToken.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res;
}