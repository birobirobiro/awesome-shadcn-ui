import { ReactNode } from "react";
import ShadcnStudioLogo from "./shadcn-studio-logo";
import ShadcnBlocksLogo from "./shadcn-blocks-logo";

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
    url: "https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=banner&utm_campaign=github",
    LogoComponent: <ShadcnStudioLogo className="w-5 h-5 shrink-0" />,
  },
  {
    name: "shadcnblocks.com",
    description: "UI blocks for your next project",
    url: "https://www.shadcnblocks.com/?utm_source=awesome-shadcn-ui&utm_medium=banner&utm_campaign=github",
    LogoComponent: <ShadcnBlocksLogo className="w-5 h-5 shrink-0" />,
  },
];
