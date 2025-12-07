import { NextResponse } from "next/server";
import { getShopifyCustomerConfig, shopifyCustomerFetch } from "@/lib/shopifyCustomer";

export async function POST(req: Request) {
  const { email, password, firstName, lastName, country } = await req.json();

  const { domain, token } = getShopifyCustomerConfig(country);

  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch(domain, token, mutation, {
    input: { email, password, firstName, lastName }
  });

  return NextResponse.json(data.customerCreate);
}