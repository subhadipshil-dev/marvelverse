import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getPhaseColor(phase: string): string {
  if (phase.includes("1")) return "#c8102e";
  if (phase.includes("2")) return "#e11d48";
  if (phase.includes("3")) return "#f43f5e";
  if (phase.includes("4")) return "#fb7185";
  if (phase.includes("5")) return "#fda4af";
  return "#c8102e";
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    "Netflix": "#E50914",
    "Prime Video": "#00A8E1",
    "JioHotstar": "#0F1C3F",
    "Sony LIV": "#FFCC00",
  };
  return colors[platform] || "#4B5563";
}
