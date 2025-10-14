import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Donation() {
  return (
    <Link
      href="https://buymeacoffee.com/birobirobiro"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button
        className="
          fixed bottom-4 right-4 z-50 
          flex items-center gap-2 
          rounded-full p-4 
          bg-[#ffe433]/90 hover:bg-[#ffe433] 
          text-black font-semibold 
          transition-all duration-300 ease-in-out
          hover:scale-105 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-[#ffe433] focus:ring-opacity-50
        "
      >
        <Image
          src="/BuyMyACoffee.svg"
          alt="Buy me a coffee"
          width={30}
          height={30}
          className="transition-transform duration-300 ease-in-out group-hover:rotate-12"
        />
        <span className="hidden sm:inline">Buy me a coffee</span>
      </Button>
    </Link>
  );
}
