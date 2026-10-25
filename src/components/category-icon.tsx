import {
  ArrowLeftRight,
  Blocks,
  Component,
  Folder,
  Globe,
  Layers,
  LayoutGrid,
  LibraryBig,
  Palette,
  PanelsTopLeft,
  Plug,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  "Libs and Components": Blocks,
  Registries: LibraryBig,
  "Plugins and Extensions": Plug,
  "Colors and Customizations": Palette,
  Animations: Sparkles,
  Tools: Wrench,
  "Websites and Portfolios": Globe,
  Platforms: Layers,
  Ports: ArrowLeftRight,
  "Design System": Component,
  "Boilerplates / Templates": PanelsTopLeft,
  "All resources": LayoutGrid,
  All: LayoutGrid,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Icon = categoryIcons[category] ?? Folder;
  return <Icon className={className} aria-hidden="true" />;
}
