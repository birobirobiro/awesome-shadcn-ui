import { ReactNode } from "react";
import KerryStudioLogo from "./kerry-studio-logo";
import ShadcnStudioLogo from "./shadcn-studio-logo";
import ShadcnUiKitLogo from "./shadcn-ui-kit-logo";
import TurboStarterLogo from "./turbostarter-logo";

export interface Sponsor {
  name: string;
  description: string;
  url: string;
  cta: string;
  LogoComponent: ReactNode;
}

export const sponsors: Sponsor[] = [
  {
    name: "shadcnstudio.com",
    description: "shadcn blocks & templates",
    url: "https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=site&utm_campaign=github",
    cta: "Browse components",
    LogoComponent: <ShadcnStudioLogo className="w-5 h-5 shrink-0" />,
  },
  {
    name: "shadcnuikit.com",
    description: "Dashboards, templates & Blocks",
    url: "https://shadcnuikit.com/?utm_source=awesome-shadcn-ui&utm_medium=site&utm_campaign=github",
    cta: "Browse dashboards",
    LogoComponent: <ShadcnUiKitLogo className="w-5 h-5 shrink-0" />,
  },
  {
    name: "UIAble",
    description: "shadcn/ui components. Get 50% off any license with AWE50.",
    url: "https://links.codedthemes.com/cEYIF",
    cta: "Explore UIAble",
    LogoComponent: (
      <svg viewBox="0 0 130 124" className="h-5 w-5 shrink-0" aria-hidden="true">
        <image href="/sponsors/uiable.svg" width="422" height="124" />
      </svg>
    ),
  },
  {
    name: "Kerry Studio",
    description: "A modern SQL database manager.",
    url: "https://kerry.studio/",
    cta: "Explore Kerry Studio",
    LogoComponent: <KerryStudioLogo className="h-5 w-5 shrink-0" />,
  },
  {
    name: "TurboStarter",
    description: "SaaS starter kits for web, mobile and browser extensions.",
    url: "https://www.turbostarter.dev/?utm_source=awesome-shadcn-ui&utm_medium=site&utm_campaign=turbostarter",
    cta: "Explore TurboStarter",
    LogoComponent: <TurboStarterLogo className="h-5 w-5 shrink-0" />,
  },
];
