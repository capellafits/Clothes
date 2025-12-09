// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export const runtime = "experimental-edge"; // keep this (your environment requires it)

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // 🔥 Vercel country detection header (works in all runtimes)
  const headerCountry = req.headers.get("x-vercel-ip-country");
  const geoCountry = headerCountry?.toUpperCase() || null;

  const isIndiaDomain = host.includes("in.capellafits.com");
  const isGlobalDomain = host.includes("capellafits.com") && !isIndiaDomain;

  // ---------------- LOGS ----------------
  console.log("----- GEO DEBUG -----");
  console.log("Host:", host);
  console.log("Geo via header:", headerCountry);
  console.log("isIndiaDomain:", isIndiaDomain);
  console.log("isGlobalDomain:", isGlobalDomain);

  // 1. India IP → India domain
  if (geoCountry === "IN" && isGlobalDomain) {
    console.log("Redirect: India IP → India domain");
    url.host = "in.capellafits.com";
    url.searchParams.set("country", "IN");
    return NextResponse.redirect(url);
  }

  // 2. Non-India IP → Global domain
  if (geoCountry !== "IN" && isIndiaDomain) {
    console.log("Redirect: Non-India IP → Global domain");
    url.host = "capellafits.com";
    url.searchParams.set("country", "CA");
    return NextResponse.redirect(url);
  }

  // 3. Maintain country=IN/CA query
  const existingCountry = url.searchParams.get("country");
  if (existingCountry !== "IN" && existingCountry !== "CA") {
    const resolved = isIndiaDomain || geoCountry === "IN" ? "IN" : "CA";
    console.log("Append country param:", resolved);
    url.searchParams.set("country", resolved);
    return NextResponse.redirect(url);
  }

  console.log("No redirect");
  return NextResponse.next();
}
