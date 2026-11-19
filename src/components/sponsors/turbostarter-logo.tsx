import * as React from "react";

interface TurboStarterLogoProps {
  className?: string;
}

function TurboStarterLogo({ className = "w-5 h-5" }: TurboStarterLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <image href="/sponsors/turbostarter.svg" width="32" height="32" />
    </svg>
  );
}

export default TurboStarterLogo;