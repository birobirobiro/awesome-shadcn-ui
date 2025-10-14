import { ERROR_MESSAGES, GITHUB_CONFIG } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "start") {
      // Start the GitHub App device flow
      const response = await fetch(GITHUB_CONFIG.DEVICE_FLOW_URL, {
        method: "POST",
        headers: GITHUB_CONFIG.API_HEADERS,
        body: JSON.stringify({
          client_id: GITHUB_CONFIG.CLIENT_ID,
          scope: GITHUB_CONFIG.SCOPES.join(" "),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "GitHub device flow start error:",
          response.status,
          errorText,
        );
        console.error("Request details:", {
          client_id: GITHUB_CONFIG.CLIENT_ID,
          scope: GITHUB_CONFIG.SCOPES.join(" "),
          url: GITHUB_CONFIG.DEVICE_FLOW_URL,
        });
        throw new Error(
          `${ERROR_MESSAGES.GITHUB_API}: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else if (body.action === "poll") {
      // Poll for the GitHub App user access token
      const response = await fetch(GITHUB_CONFIG.ACCESS_TOKEN_URL, {
        method: "POST",
        headers: GITHUB_CONFIG.API_HEADERS,
        body: JSON.stringify({
          client_id: GITHUB_CONFIG.CLIENT_ID,
          device_code: body.device_code,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "GitHub device flow poll error:",
          response.status,
          errorText,
        );
        throw new Error(
          `${ERROR_MESSAGES.GITHUB_API}: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.INVALID_ACTION },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("GitHub device flow error:", error);
    return NextResponse.json(
      { error: error.message || ERROR_MESSAGES.INTERNAL_SERVER },
      { status: 500 },
    );
  }
}
