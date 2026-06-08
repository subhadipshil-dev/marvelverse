"use client";

import React from 'react';

interface PlatformLogoProps {
  name: string;
  className?: string;
}

const PLATFORM_LOGOS: Record<string, string> = {
  "Disney+": "/logos/disneyplus.svg",
  "Netflix": "/logos/netflix.svg",
  "Prime Video": "/logos/primevideo.svg",
  "JioHotstar": "/logos/jiohotstar.svg",
  "Sony LIV": "/logos/sonyliv.svg",
};

export function PlatformLogo({ name, className = "h-3.5 w-3.5" }: PlatformLogoProps) {
  const logoSrc = PLATFORM_LOGOS[name];

  if (!logoSrc) {
    const initials = name
      .split(/[\s+&]/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return (
      <div className={`flex items-center justify-center rounded bg-white/10 text-[9px] font-bold text-white/70 ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={logoSrc} 
      alt={`${name} logo`} 
      className={`${className} object-contain flex-shrink-0`}
      loading="lazy"
    />
  );
}
