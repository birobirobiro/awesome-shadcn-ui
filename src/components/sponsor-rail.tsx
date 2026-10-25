import { Plus } from "lucide-react";

import { AffiliateLinks } from "@/components/affiliate-links";
import { PartnerCard } from "@/components/partner-card";
import { sponsors } from "@/components/sponsors/sponsors";

const SPONSORSHIP_URL = "https://buy.stripe.com/9B6cN6eZq6N136ygPm0Jq02";

export function SponsorRail() {
  return (
    <aside className="sponsor-rail" aria-label="Partners">
      <section aria-labelledby="sponsor-rail-title">
        <h2 id="sponsor-rail-title" className="sponsor-rail__title">
          Sponsors
        </h2>
        <div className="sponsor-rail__list">
          {sponsors.map((sponsor) => (
            <PartnerCard
              key={sponsor.name}
              name={sponsor.name}
              description={sponsor.description}
              url={sponsor.url}
              cta={sponsor.cta}
              logo={sponsor.LogoComponent}
            />
          ))}
          <PartnerCard
            name="Your product here"
            description="Reach the shadcn/ui community."
            url={SPONSORSHIP_URL}
            cta="Become a sponsor"
            logo={<Plus aria-hidden="true" />}
            open
          />
        </div>
      </section>
      <section
        className="sponsor-rail__affiliates mt-6"
        aria-labelledby="affiliate-rail-title"
      >
        <h2 id="affiliate-rail-title" className="sponsor-rail__title">
          Affiliate links
        </h2>
        <div className="sponsor-rail__list">
          <AffiliateLinks />
        </div>
      </section>
    </aside>
  );
}
