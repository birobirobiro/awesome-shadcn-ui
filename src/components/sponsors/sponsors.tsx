import { ReactNode } from "react";
import ShadcnStudioLogo from "./shadcn-studio-logo";
import ShadcnUiKitLogo from "./shadcn-ui-kit-logo";

export interface Sponsor {
  name: string;
  description: string;
  url: string;
  LogoComponent: ReactNode;
}

export const sponsors: Sponsor[] = [
  {
    name: "shadcnstudio.com",
    description: "shadcn blocks & templates",
    url: "https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=site&utm_campaign=github",
    LogoComponent: <ShadcnStudioLogo className="w-5 h-5 shrink-0" />,
  },
  {
    name: "shadcnuikit.com",
    description: "Dashboards, templates & Blocks",
    url: "https://shadcnuikit.com/?utm_source=awesome-shadcn-ui&utm_medium=site&utm_campaign=github",
    LogoComponent: <ShadcnUiKitLogo className="w-5 h-5 shrink-0" />,
  },
];
