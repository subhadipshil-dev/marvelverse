"use client";

import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { PlatformLogo } from './PlatformLogo';
import { cn } from '@/lib/utils';

interface FilterSystemProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activePhase: string;
  setActivePhase: (p: string) => void;
  activePlatform: string;
  setActivePlatform: (p: string) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  sortBy: 'timeline' | 'rating' | 'release' | 'alpha';
  setSortBy: (s: 'timeline' | 'rating' | 'release' | 'alpha') => void;
}

const PHASE_OPTIONS = ['All', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];
const PLATFORMS = ['JioHotstar', 'Netflix', 'Prime Video', 'Sony LIV'];
const SORT_OPTIONS = [
  { value: 'timeline', label: 'Timeline Order' },
  { value: 'rating', label: 'IMDb Rating' },
  { value: 'release', label: 'Release Date' },
  { value: 'alpha', label: 'A–Z' },
] as const;

export function FilterSystem({
  searchQuery,
  setSearchQuery,
  activePhase,
  setActivePhase,
  activePlatform,
  setActivePlatform,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
}: FilterSystemProps) {
  const [sortOpen, setSortOpen] = useState(false);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy)!;

  const handleSortSelect = (value: typeof sortBy) => {
    setSortBy(value);
    setSortOpen(false);
  };

  return (
    <div className="filter-container glass-strong border border-white/10 rounded-3xl overflow-visible w-full max-w-7xl mx-auto">
      {/* Search box - no animation */}
      <div className="relative border-b border-white/10 p-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, characters, phases..."
            className="w-full bg-transparent pl-11 pr-4 py-3 text-sm placeholder:text-white/40 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter controls - horizontal, no animation */}
      <div className="flex items-end gap-4 p-4">
        {/* Phase - static segmented, no sliding animation */}
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[1.5px] text-white/40 mb-1.5">Phase</div>
          <div className="flex rounded-2xl bg-white/[0.04] p-1 text-xs">
            {PHASE_OPTIONS.map((phase) => {
              const isActive = activePhase === phase;
              const label = phase === 'All' ? 'All' : 'P' + phase.split(' ')[1];
              return (
                <button
                  key={phase}
                  onClick={() => setActivePhase(phase)}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-xl font-medium transition-colors text-center",
                    isActive 
                      ? "bg-[#c8102e] text-white" 
                      : "text-white/60 hover:text-white/90"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Platforms - logo chips, no animation */}
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[1.5px] text-white/40 mb-1.5">Platforms</div>
          <div className="flex gap-1.5">
            {PLATFORMS.map((platform) => {
              const isActive = activePlatform === platform;
              return (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(isActive ? 'All' : platform)}
                  className={cn(
                    "flex items-center justify-center rounded-xl border p-1.5 transition-all active:scale-[0.96]",
                    isActive 
                      ? "border-[#c8102e] bg-[#c8102e]/10 scale-[1.05]" 
                      : "border-white/10 bg-white/[0.015] hover:border-white/20 hover:bg-white/5"
                  )}
                  title={platform}
                >
                  <PlatformLogo name={platform} className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating - no animation */}
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[1.5px] text-white/40 mb-1.5">Rating</div>
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] text-white/40 tabular-nums">6.0</span>
            <input
              type="range"
              min={6}
              max={10}
              step={0.1}
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="premium-slider flex-1 accent-[#c8102e]"
            />
            <span className="text-[10px] text-[#c5a46e] tabular-nums font-medium w-8 text-right">
              {minRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Sort - compact, no animation for container */}
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[1.5px] text-white/40 mb-1.5">Sort</div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm font-medium transition-all hover:bg-white/5 active:scale-[0.985]"
            >
              <span className="truncate">{currentSort.label}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-white/50 transition-transform", sortOpen && "rotate-180")} />
            </button>

            {sortOpen && (
              <div className="absolute right-0 z-[100] mt-1 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortSelect(option.value)}
                    className={cn(
                      "block w-full px-4 py-2 text-left text-sm transition-colors",
                      sortBy === option.value ? "bg-white/5 text-white" : "text-white/75 hover:bg-white/5"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
