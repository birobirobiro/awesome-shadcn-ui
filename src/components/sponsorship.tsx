import { ArrowUpRight, Plus } from "lucide-react";

import { sponsors } from "@/components/sponsors/sponsors";

export function Sponsorship() {
  return (
    <div className="sponsorship sponsorship--hero">
      <span className="sponsorship__label">Sponsored by</span>

      <div className="sponsorship__links">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener sponsored"
            className="sponsorship__link"
          >
            <span className="sponsorship__mark">{sponsor.LogoComponent}</span>
            <span className="sponsorship__name">{sponsor.name}</span>
            <span className="sponsorship__description">
              {sponsor.description}
            </span>
            <span className="sponsorship__link-cta">
              {sponsor.cta}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>

      <a
        href="https://buy.stripe.com/9B6cN6eZq6N136ygPm0Jq02"
        target="_blank"
        rel="noopener"
        aria-label="Become a sponsor"
        className="sponsorship__cta"
      >
        <span className="sponsorship__cta-mark">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="sponsorship__cta-name">Become a sponsor</span>
        <span className="sponsorship__cta-title">Your product here</span>
        <span className="sponsorship__cta-description">
          Reach the shadcn/ui community.
        </span>
        <span className="sponsorship__cta-action">
          Become a sponsor
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </a>
    </div>
  );
}
