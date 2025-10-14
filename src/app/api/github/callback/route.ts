import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url),
    );
  }

  if (!code) {
    console.error("No authorization code received");
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  // For device flow, we don't need to handle the callback here
  // The device flow handles everything through the device-flow endpoint
  // This endpoint is just required by GitHub App configuration
  console.log("GitHub App callback received:", { code, state });

  return NextResponse.redirect(new URL("/?success=authorized", request.url));
}
