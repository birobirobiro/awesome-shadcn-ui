import * as React from "react";

interface KerryStudioLogoProps {
  className?: string;
}

function KerryStudioLogo({ className = "w-5 h-5" }: KerryStudioLogoProps) {
  return (
    <svg
      viewBox="0 0 301 301"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <image href="/sponsors/kerry.svg" width="301" height="301" />
    </svg>
  );
}

export default KerryStudioLogo;
