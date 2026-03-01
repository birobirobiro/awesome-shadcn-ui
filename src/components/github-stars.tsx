"use client";

import { Octokit } from "@octokit/rest";
import { useEffect, useState } from "react";

async function getStars() {
  const octokit = new Octokit();
  const { data } = await octokit.repos.get({
    owner: "birobirobiro",
    repo: "awesome-shadcn-ui",
  });
  return data.stargazers_count;
}

export function GithubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    getStars().then(setStars);
  }, []);

  if (stars === null) return null;

  const formattedStars =
    stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars;

  return <span className="text-sm">{formattedStars}</span>;
}
