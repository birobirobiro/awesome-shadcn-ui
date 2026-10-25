import { GITHUB_CONFIG } from "@/lib/config";

// Share one cached request across visitors instead of using each browser's quota.
export const revalidate = 60;

export async function GET() {
  let stars: number | null = null;
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.REPO_OWNER}/${GITHUB_CONFIG.REPO_NAME}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "awesome-shadcn-ui",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (response.ok) {
      const data = await response.json();
      if (
        Number.isSafeInteger(data.stargazers_count) &&
        data.stargazers_count >= 0
      ) {
        stars = data.stargazers_count;
      }
    }
  } catch {
    // The repository link remains useful when GitHub is unavailable.
  }

  return Response.json(
    { stars },
    {
      headers: {
        "Cache-Control":
          stars === null
            ? "public, max-age=60, s-maxage=60"
            : "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
