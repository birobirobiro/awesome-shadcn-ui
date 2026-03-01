import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-5 w-auto" }: LogoProps) {
  return (
    <Image
      src="/logo-mobile.svg"
      alt="awesome-shadcn/ui"
      width={24}
      height={24}
      className={className}
    />
  );
}

export function HeroLogo({ className = "h-40 w-auto" }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="awesome-shadcn/ui"
      width={160}
      height={160}
      className={className}
    />
  );
}
