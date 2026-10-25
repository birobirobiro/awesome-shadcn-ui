import Image from "next/image";

import { PartnerCard } from "@/components/partner-card";
import { affiliates } from "@/lib/affiliates";

export function AffiliateLinks() {
  return affiliates.map((affiliate) => (
    <PartnerCard
      key={affiliate.name}
      name={affiliate.name}
      description={affiliate.description}
      url={affiliate.url}
      cta={affiliate.cta}
      logo={
        <>
          <Image
            src={affiliate.logo.light}
            width={20}
            height={20}
            alt=""
            className="object-contain dark:hidden"
          />
          <Image
            src={affiliate.logo.dark}
            width={20}
            height={20}
            alt=""
            className="hidden object-contain dark:block"
          />
        </>
      }
    />
  ));
}
