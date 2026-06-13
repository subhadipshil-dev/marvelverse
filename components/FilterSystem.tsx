"use client";

import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
const PLATFORMS = ['Disney+', 'Netflix', 'Prime Video', 'JioHotstar', 'Sony LIV'];
const PLATFORM_COLORS: Record<string, string> = {
  'Disney+': '#5b8cff',
  'JioHotstar': '#0F1C3F',
  'Netflix': '#E50914',
  'Prime Video': '#00A8E1',
  'Sony LIV': '#FFCC00',
};
const SORT_OPTIONS = [
  { value: 'timeline', label: 'Timeline Order' },
  { value: 'release', label: 'Release Order' },
  { value: 'rating', label: 'IMDb Rating' },
  { value: 'alpha', label: 'Title A-Z' },
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
  const sliderValue = Math.max(minRating, 6);

  const handleSortSelect = (value: typeof sortBy) => {
    setSortBy(value);
    setSortOpen(false);
  };

  return (
    <motion.div 
      className="filter-container relative mx-auto max-w-[1400px] overflow-visible rounded-[28px] border p-6 backdrop-blur-[20px] md:p-8"
      style={{
        background: 'rgba(10,10,18,0.75)',
        borderColor: 'rgba(255,255,255,0.06)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_18%_0%,rgba(200,16,46,0.08),transparent_42%)]" />

      {/* ROW 1: Search */}
      <div className="relative z-10 mb-6">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-[#c8102e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, series, characters or timeline years..."
            className="h-14 w-full rounded-2xl border border-white/[0.08] bg-[#08080f]/75 pl-14 pr-12 text-[15px] text-white shadow-[inset_0_1px_12px_rgba(0,0,0,0.32)] outline-none transition-all duration-300 placeholder:text-white/35 hover:border-white/20 focus:border-[#c8102e]/60 focus:shadow-[inset_0_1px_12px_rgba(0,0,0,0.32),0_0_0_3px_rgba(200,16,46,0.16),0_0_28px_rgba(200,16,46,0.18)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 rounded-full p-2 text-white/40 transition-all -translate-y-1/2 hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ROW 2: Filters */}
      <div className="relative z-10 grid grid-cols-1 gap-8 pt-6 pb-0 md:grid-cols-2 xl:grid-cols-[1.4fr_1.2fr_1fr_0.9fr] xl:items-start">
        
        {/* PHASE */}
        <div>
          <div className="mb-3 text-[12px] uppercase tracking-[2px] text-[#c5a46e]">Phase</div>
          <div className="flex flex-wrap gap-2.5">
            {PHASE_OPTIONS.map((phase) => {
              const isActive = activePhase === phase;
              return (
                <button
                  key={phase}
                  onClick={() => setActivePhase(phase)}
                  className={cn(
                    "flex h-10 items-center rounded-full border px-[18px] text-[13px] font-medium tracking-wide transition-all",
                    isActive
                      ? "border-[#c8102e]/70 bg-gradient-to-r from-[#c8102e] to-[#8f0b20] text-white shadow-[0_0_22px_rgba(200,16,46,0.28)]"
                      : "border-white/[0.08] bg-white/[0.035] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  {phase}
                </button>
              );
            })}
          </div>
        </div>

        {/* PLATFORMS */}
        <div>
          <div className="mb-3 text-[12px] uppercase tracking-[2px] text-[#c5a46e]">Platforms</div>
          <div className="flex flex-wrap gap-2.5">
            {PLATFORMS.map((platform) => {
              const isActive = activePlatform === platform;
              const color = PLATFORM_COLORS[platform] || '#c8102e';
              return (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(isActive ? 'All' : platform)}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-all active:scale-[0.985]",
                    isActive 
                      ? "text-white" 
                      : "text-white/75 hover:text-white"
                  )}
                  style={{ 
                    borderColor: isActive ? color : 'rgba(255,255,255,0.08)',
                    background: isActive ? `${color}18` : 'rgba(255,255,255,0.035)',
                    boxShadow: isActive ? `0 0 18px ${color}3d` : 'none'
                  }}
                  title={platform}
                >
                  <PlatformLogo name={platform} className="h-4 w-4" />
                  <span className="text-xs tracking-wide">{platform}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RATING */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[12px] uppercase tracking-[2px] text-[#c5a46e]">MCU Rating</div>
            <div className="rounded-full border border-[#c5a46e]/20 bg-[#c5a46e]/10 px-3 py-1 text-sm font-medium tabular-nums tracking-tight text-[#c5a46e]">
              {sliderValue.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="relative">
              <input
                type="range"
                min={6}
                max={10}
                step={0.1}
                value={sliderValue}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="premium-slider relative z-10 w-full accent-[#c5a46e]"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-white/40 tabular-nums">
              <span>6.0</span>
              <span>10.0</span>
            </div>
          </div>
        </div>

        {/* SORT */}
        <div>
          <div className="mb-3 text-[12px] uppercase tracking-[2px] text-[#c5a46e]">Sort</div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#08080f]/75 px-4 text-sm font-medium text-white/90 shadow-[inset_0_1px_12px_rgba(0,0,0,0.28)] transition-all hover:border-white/20 hover:bg-white/[0.045] active:scale-[0.985]"
            >
              <span className="truncate">{currentSort.label}</span>
              <ChevronDown className={cn("h-4 w-4 text-white/50 transition-transform", sortOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 z-[100] mt-2 w-full min-w-[12rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] py-1 shadow-2xl"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      className={cn(
                        "block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5",
                        sortBy === option.value ? "text-white bg-white/5" : "text-white/75"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
