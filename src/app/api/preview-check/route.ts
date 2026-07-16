import { NextRequest, NextResponse } from "next/server";

// Sites that block framing (X-Frame-Options / CSP frame-ancestors) still fire
// the iframe load event, so embeddability can't be detected client-side. This
// endpoint fetches the target's headers server-side and reports whether the
// site can be shown in an iframe.

const FETCH_TIMEOUT_MS = 5000;

/** Hostnames/prefixes that must never be fetched (SSRF hygiene). */
function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "0.0.0.0" ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host === "[::1]" ||
    host.startsWith("169.254.")
  );
}

/** True when a CSP frame-ancestors directive forbids embedding on our origin. */
function cspBlocksFraming(csp: string): boolean {
  const match = csp.toLowerCase().match(/frame-ancestors([^;]*)/);
  if (!match) return false;

  const sources = match[1].trim().split(/\s+/).filter(Boolean);
  // Only wildcard policies allow arbitrary cross-origin embedding.
  return !sources.some((source) => source === "*" || source === "https:");
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url");

  let url: URL;
  try {
    url = new URL(target ?? "");
  } catch {
    return NextResponse.json({ embeddable: false }, { status: 400 });
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    isPrivateHost(url.hostname)
  ) {
    return NextResponse.json({ embeddable: false }, { status: 400 });
  }

  let embeddable = false;
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; awesome-shadcn-ui-preview-check)",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    const xfo = response.headers.get("x-frame-options")?.toLowerCase() ?? "";
    const csp = response.headers.get("content-security-policy") ?? "";

    embeddable =
      response.ok &&
      !xfo.includes("deny") &&
      !xfo.includes("sameorigin") &&
      !cspBlocksFraming(csp);
  } catch {
    embeddable = false;
  }

  return NextResponse.json(
    { embeddable },
    {
      headers: {
        // Framing policy rarely changes; cache aggressively per URL.
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
