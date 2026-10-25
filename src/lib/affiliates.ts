export interface Affiliate {
  name: string;
  description: string;
  url: string;
  cta: string;
  logo: { light: string; dark: string };
}

export const affiliates: Affiliate[] = [
  {
    name: "Hostinger",
    description: "VPS hosting for your projects.",
    url: "https://www.hostinger.com/br/cart?product=vps%3Avps_kvm_2&period=12&referral_type=cart_link&REFERRALCODE=BIROBIROBIRO&referral_id=01a16ee0-3dd8-70c8-9539-b3bf71ad19cb",
    cta: "Explore VPS hosting",
    logo: {
      light: "/affiliates/hostinger-light.svg",
      dark: "/affiliates/hostinger-dark.svg",
    },
  },
  {
    name: "Claude",
    description: "An AI assistant for your projects.",
    url: "https://claude.ai/referral/S-2DHcc3oQ",
    cta: "Try Claude",
    logo: { light: "/affiliates/claude.svg", dark: "/affiliates/claude.svg" },
  },
  {
    name: "CodeRabbit",
    description: "AI code reviews for your pull requests.",
    url: "https://coderabbit.link/birobirobiro",
    cta: "Try CodeRabbit",
    logo: {
      light: "/affiliates/coderabbit.svg",
      dark: "/affiliates/coderabbit.svg",
    },
  },
  {
    name: "Dub",
    description: "Link management and conversion tracking.",
    url: "https://refer.dub.co/birobirobiro",
    cta: "Try Dub",
    logo: {
      light: "/affiliates/dub.png",
      dark: "/affiliates/dub.png",
    },
  },
];
