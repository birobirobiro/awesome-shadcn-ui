import * as React from "react";
import Image from "next/image";

interface ShadcnUiKitLogoProps {
  className?: string;
}

function ShadcnUiKitLogo({ className = "w-5 h-5" }: ShadcnUiKitLogoProps) {
  return (
    <Image
      src="/sponsors/shadcnuikit.svg"
      alt="shadcnuikit.com logo"
      width={20}
      height={20}
      className={className}
    />
  );
}

export default ShadcnUiKitLogo;
