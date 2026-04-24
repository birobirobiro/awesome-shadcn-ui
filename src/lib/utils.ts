import { clsx, type ClassValue } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatResourceDate(dateString: string): string {
  if (!dateString || dateString === "Unknown") return "Unknown";
  const date = parseISO(dateString);
  return isValid(date) ? format(date, "MMMM d, yyyy") : "Unknown";
}
