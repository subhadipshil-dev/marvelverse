"use client";

import React from 'react';
import { Play, Download, Info, Star, Clock, Calendar } from 'lucide-react';
import { Movie } from '@/types/movie';
import { PlatformLogo } from './PlatformLogo';

interface TimelineItemProps {
  movie: Movie;
  onDetails: (movie: Movie) => void;
  onWatch: (movie: Movie) => void;
  onDownload: (movie: Movie) => void;
}

export function TimelineItem({ 
  movie, 
  onDetails, 
  onWatch, 
  onDownload 
}: TimelineItemProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(movie);
  };

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatch(movie);
  };

  const handleDetails = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDetails(movie);
  };

  return (
    <div 
      onClick={() => onDetails(movie)}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_80px_-20px_rgb(0,0,0,0.7)] md:flex-row md:items-start focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c8102e]/50"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDetails(movie);
        }
      }}
    >
      {/* LEFT: POSTER - Fixed width, 2:3, fully visible */}
      <div className="relative w-full flex-shrink-0 overflow-hidden bg-[#050505] p-3 md:w-[240px] lg:w-[260px] xl:w-[280px]">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-contain p-1"
          />
          {/* Subtle inner frame for premium feel */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08]" />
        </div>

        {/* Small phase badge on poster */}
        <div className="absolute left-5 top-5 z-10 rounded-full bg-black/80 px-2.5 py-0.5 text-[10px] font-medium tracking-[1px] text-white/90 backdrop-blur">
          {movie.phase}
        </div>
      </div>

      {/* RIGHT: CONTENT - Takes remaining width */}
      <div className="flex flex-1 flex-col p-5 md:p-6 lg:p-7">
        {/* Title - Large and prominent */}
        <h2 className="mb-2 text-2xl font-semibold leading-tight tracking-[-0.5px] text-white group-hover:text-[#c5a46e] transition-colors md:text-[26px] lg:text-3xl">
          {movie.title}
        </h2>

        {/* Metadata row - Scannable */}
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60">
          <div className="flex items-center gap-1.5 font-medium text-[#c5a46e]">
            <Star className="h-4 w-4 fill-current" />
            <span>{movie.imdbRating} IMDb</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{movie.runtime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Released {movie.releaseYear}</span>
          </div>
          <div className="rounded bg-white/5 px-2 py-px text-xs tracking-widest text-white/50">
            TIMELINE {movie.timelineYear}
          </div>
        </div>

        {/* Short Description - Visible without details */}
        <p className="mb-4 line-clamp-3 text-[15px] leading-relaxed text-white/75 md:line-clamp-4 lg:pr-8">
          {movie.synopsis}
        </p>

        {/* OTT Platforms - Real logos */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs uppercase tracking-[1.5px] text-white/40">Available on</span>
          {movie.ottPlatforms.map((platform) => (
            <div 
              key={platform} 
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1 text-sm"
            >
              <PlatformLogo name={platform} className="h-4 w-4" />
              <span className="font-medium text-white/80">{platform}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons - Horizontal row, equal emphasis */}
        <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            onClick={handleWatch}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#c8102e] text-sm font-semibold tracking-[0.5px] text-white transition-all hover:bg-[#e11d48] active:scale-[0.985]"
          >
            <Play className="h-4 w-4" />
            WATCH NOW
          </button>

          <button
            onClick={handleDownload}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#c5a46e]/70 text-sm font-semibold tracking-[0.5px] text-[#c5a46e] transition-all hover:border-[#c5a46e] hover:bg-[#c5a46e]/5 active:scale-[0.985]"
          >
            <Download className="h-4 w-4" />
            DOWNLOAD
          </button>

          <button
            onClick={handleDetails}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.015] text-sm font-medium tracking-[0.5px] text-white/80 transition-all hover:bg-white/[0.04] hover:text-white active:scale-[0.985]"
          >
            <Info className="h-4 w-4" />
            DETAILS
          </button>
        </div>
      </div>
    </div>
  );
}
