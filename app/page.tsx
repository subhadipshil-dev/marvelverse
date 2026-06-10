"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Shuffle, ArrowUp, Play, Star, Award, 
  Calendar, Users, Film, ChevronDown 
} from 'lucide-react';
import { toast } from 'sonner';

import moviesData from '@/data/movies.json';
import phasesData from '@/data/phases.json';
import platformsData from '@/data/platforms.json';
import { Movie } from '@/types/movie';
import { TimelineItem } from '@/components/TimelineItem';
import { FilterSystem } from '@/components/FilterSystem';
import { MovieDrawer } from '@/components/MovieDrawer';
import { ParticleField } from '@/components/ParticleField';
import { PlatformLogo } from '@/components/PlatformLogo';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Types
const movies: Movie[] = moviesData as Movie[];

const PHASES = ["All", ...phasesData.map((p: any) => p.name)];
const PLATFORMS = ["All", ...platformsData.map((p: any) => p.name)];

// Animated Counter
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  );
}



// Main Page
export default function MarvelverseTimeline() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhase, setActivePhase] = useState("All");
  const [activePlatform, setActivePlatform] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"timeline" | "rating" | "release" | "alpha">("timeline");

  // Hero current movie state for dynamic hero
  const [currentHeroMovie, setCurrentHeroMovie] = useState(
    movies.find((m) => m.id === "avengers-endgame") || movies[0]
  );

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll progress + back to top
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
      setShowBackToTop(window.scrollY > 820);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtering + Searching
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.phase.toLowerCase().includes(q) ||
        m.cast.some(c => c.toLowerCase().includes(q)) ||
        String(m.timelineYear).includes(q) ||
        m.synopsis.toLowerCase().includes(q)
      );
    }

    // Phase
    if (activePhase !== "All") {
      result = result.filter(m => m.phase === activePhase);
    }

    // Platform
    if (activePlatform !== "All") {
      result = result.filter(m => m.ottPlatforms.includes(activePlatform));
    }

    // Rating
    if (minRating > 0) {
      result = result.filter(m => m.imdbRating >= minRating);
    }

    // Sort
    if (sortBy === "timeline") {
      result.sort((a, b) => a.orderIndex - b.orderIndex);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.imdbRating - a.imdbRating);
    } else if (sortBy === "release") {
      result.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sortBy === "alpha") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [searchQuery, activePhase, activePlatform, minRating, sortBy]);



  // Stats
  const totalMovies = movies.length;
  const avgRating = (movies.reduce((sum, m) => sum + m.imdbRating, 0) / totalMovies).toFixed(1);
  const totalPhases = phasesData.length;
  const platformsCount = platformsData.length;

  // Timeline progress (approximate visual)
  const timelineProgress = Math.min(100, Math.floor((filteredMovies.length / totalMovies) * 100));

  // Actions
  const openMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // Keep selection briefly for exit animation
    setTimeout(() => setSelectedMovie(null), 320);
  };

  const handleWatch = (movie: Movie) => {
    if (movie.watchUrl) {
      window.open(movie.watchUrl, '_blank');
    } else {
      toast("Watch link coming soon", {
        description: "Official streaming links will be added for every title.",
      });
    }
  };

  const handleDownload = (movie: Movie) => {
    if (movie.downloadUrl) {
      window.open(movie.downloadUrl, '_blank');
    } else {
      toast("More info coming soon", {
        description: "Additional details and links will be available shortly.",
      });
    }
  };

  const handleTrailer = (movie: Movie) => {
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, '_blank');
    } else {
      toast("Trailer coming soon", {
        description: "Official trailers will appear here shortly.",
      });
    }
  };

  // Random movie picker (premium FAB action)
  const pickRandomMovie = () => {
    const random = movies[Math.floor(Math.random() * movies.length)];
    openMovie(random);
    
    // Nice toast feedback
    toast(`Now playing: ${random.title}`, {
      description: `${random.phase} • ${random.timelineYear}`,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActivePhase("All");
    setActivePlatform("All");
    setMinRating(0);
    setSortBy("timeline");
  };

  const scrollToTimeline = () => {
    document.getElementById('timeline')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured movie of the week (deterministic but nice)
  const featuredMovie = movies.find(m => m.id === "avengers-endgame") || movies[21];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-[#c8102e] selection:text-white">
      {/* Fixed Scroll Progress */}
      <div 
        className="scroll-progress" 
        style={{ width: `${scrollProgress}%` }} 
      />

      {/* Premium Glass Floating Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-3xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="MarvelVerse Logo" className="h-9 w-9 rounded-xl" />
            <div>
              <div className="font-semibold tracking-[-0.4px] text-xl">MARVELVERSE</div>
              <div className="text-[9px] -mt-1 text-[#c5a46e] tracking-[2.5px]">TIMELINE</div>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a href="#timeline" className="text-white/70 hover:text-white transition-colors">Timeline</a>
            <a href="#stats" className="text-white/70 hover:text-white transition-colors">Stats</a>
            <a href="#platforms" className="text-white/70 hover:text-white transition-colors">Platforms</a>
            <button onClick={scrollToTimeline} className="btn btn-secondary px-5 py-2 text-xs">EXPLORE TIMELINE</button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={pickRandomMovie}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs hover:bg-white/10 transition-all active:scale-[0.985]"
            >
              <Shuffle className="h-3.5 w-3.5" /> RANDOM
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================
          HERO — PREMIUM CINEMATIC EXPERIENCE
      ============================================ */}
      <section className="relative h-[92vh] overflow-hidden border-b border-white/10">
        {/* Dynamic Background with Ken Burns slow zoom and fade on change */}
        <motion.div
          key={currentHeroMovie.id}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentHeroMovie.thumbnail})` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Slow zoom animation layer */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentHeroMovie.thumbnail})` }}
            animate={{ scale: [1, 1.08] }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          />
        </motion.div>

        {/* Cinematic dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/95 to-[#050505]/60" />
        
        {/* Red ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(200,16,46,0.18),transparent_60%)]" />

        {/* Subtle particle field for cinematic feel */}
        <ParticleField />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col">
          {/* Main content grid: Left info + Right poster */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 pt-12 pb-8">
            {/* LEFT: Movie info */}
            <div className="flex-1 max-w-2xl space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center rounded-full bg-[#c8102e]/90 px-4 py-1 text-xs font-semibold tracking-[2px] text-white">
                  {currentHeroMovie.phase}
                </div>
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-medium tracking-[1px] text-white/90">
                  {currentHeroMovie.timelineYear}
                </div>
              </div>

              {/* Large Title */}
              <h1 className="text-5xl md:text-7xl font-semibold tracking-[-2.5px] leading-[0.95] text-white">
                {currentHeroMovie.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                <div className="flex items-center gap-1.5 text-[#c5a46e] font-semibold">
                  <Star className="h-4 w-4 fill-current" /> {currentHeroMovie.imdbRating} IMDb
                </div>
                <div>{currentHeroMovie.runtime}</div>
                <div>{currentHeroMovie.releaseYear}</div>
              </div>

              {/* Synopsis */}
              <p className="max-w-xl text-[15px] leading-relaxed text-white/80 line-clamp-4">
                {currentHeroMovie.synopsis}
              </p>

              {/* Available Platforms */}
              <div>
                <div className="text-xs uppercase tracking-[2px] text-white/40 mb-2">Available on</div>
                <div className="flex flex-wrap gap-2">
                  {currentHeroMovie.ottPlatforms.map((platform) => (
                    <div key={platform} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs">
                      <PlatformLogo name={platform} className="h-3.5 w-3.5" />
                      <span className="text-white/80">{platform}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => openMovie(currentHeroMovie)} 
                  className="btn btn-primary px-8 py-3.5 text-base"
                >
                  EXPLORE MOVIE
                </button>
                <button 
                  onClick={scrollToTimeline} 
                  className="btn btn-secondary px-8 py-3.5 text-base border-white/20"
                >
                  VIEW TIMELINE POSITION
                </button>
              </div>
            </div>

            {/* RIGHT: Large featured poster with float and glow */}
            <div className="relative hidden lg:block flex-shrink-0">
              {/* Glow behind poster */}
              <div className="absolute -inset-8 bg-[#c8102e] opacity-20 blur-[60px] rounded-full" />
              
              <motion.div
                key={currentHeroMovie.id}
                className="relative w-[340px] aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-15px_rgb(0,0,0,0.8)]"
                initial={{ opacity: 0, x: 60, rotateY: 8 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                whileHover={{ scale: 1.015, rotateY: -2 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              >
                <img 
                  src={currentHeroMovie.thumbnail} 
                  alt={currentHeroMovie.title} 
                  className="h-full w-full object-cover"
                />
                {/* Cinematic inner shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </motion.div>
            </div>
          </div>

          {/* Redesigned Top Stats as glass cards below title area */}
          <div className="pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "MOVIES", value: totalMovies },
                { label: "AVG RATING", value: parseFloat(avgRating) },
                { label: "PHASES", value: totalPhases },
                { label: "PLATFORMS", value: platformsCount },
              ].map((stat, i) => (
                <div key={i} className="glass rounded-2xl border border-white/10 p-5 flex items-center gap-4">
                  <div className="text-3xl font-semibold tracking-[-1px] text-white tabular-nums">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-xs uppercase tracking-[2px] text-white/50 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM: Interactive Movie Carousel */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pt-12 pb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-xs uppercase tracking-[2.5px] text-white/40 mb-3">EXPLORE THE COLLECTION</div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              {movies.slice(0, 7).map((movie) => {
                const isActive = currentHeroMovie.id === movie.id;
                return (
                  <motion.button
                    key={movie.id}
                    onClick={() => setCurrentHeroMovie(movie)}
                    className={cn(
                      "flex-shrink-0 snap-start rounded-2xl overflow-hidden border transition-all duration-300",
                      isActive 
                        ? "border-[#c8102e] w-28 md:w-32 ring-1 ring-[#c8102e]/40" 
                        : "border-white/10 w-20 md:w-24 opacity-70 hover:opacity-100"
                    )}
                    whileHover={{ scale: isActive ? 1.02 : 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative aspect-[2/3]">
                      <img 
                        src={movie.thumbnail} 
                        alt={movie.title} 
                        className="absolute inset-0 h-full w-full object-cover" 
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#c8102e]/30 to-transparent" />
                      )}
                    </div>
                    {isActive && (
                      <div className="px-2 py-1 text-[10px] text-center text-white/90 truncate bg-black/50">
                        {movie.title.split(":")[0]}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED MOVIE OF THE WEEK (Premium Banner)
      ============================================ */}
      <section className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6 py-9">
          <div className="flex items-center justify-between pb-4">
            <div>
              <div className="text-xs tracking-[3px] text-[#c5a46e]">CURATED FOR YOU</div>
              <div className="text-2xl font-semibold tracking-tight">Featured • This Week</div>
            </div>
            <button onClick={() => openMovie(featuredMovie)} className="btn btn-ghost text-xs">VIEW DETAILS</button>
          </div>

          <div 
            onClick={() => openMovie(featuredMovie)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] md:flex-row"
          >
            {/* Portrait poster on the side for featured */}
            <div className="relative w-full overflow-hidden bg-black md:w-[260px] lg:w-[280px]">
              <div className="relative aspect-[2/3] w-full md:aspect-auto md:h-full">
                <img 
                  src={featuredMovie.thumbnail} 
                  alt={featuredMovie.title} 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
              <div className="mb-1 flex items-center gap-3 text-xs">
                <div className="rounded-full bg-[#c8102e] px-2.5 py-px text-white tracking-wider">{featuredMovie.phase}</div>
                <div className="text-[#c5a46e] flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-current" /> {featuredMovie.imdbRating}
                </div>
                <div className="text-white/50">{featuredMovie.timelineYear}</div>
              </div>

              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{featuredMovie.title}</h3>
              <p className="mt-2 max-w-lg text-sm text-white/70 line-clamp-3">{featuredMovie.synopsis}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={(e) => { e.stopPropagation(); handleWatch(featuredMovie); }} className="btn btn-primary text-sm px-6 py-2.5">WATCH NOW</button>
                <button onClick={(e) => { e.stopPropagation(); handleDownload(featuredMovie); }} className="btn btn-download text-sm px-5 py-2.5">MORE INFO</button>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ============================================
          TIMELINE + MOVIE GRID
      ============================================ */}
      {/* SINGLE FilterSystem component - horizontal layout, no animations. Container is fixed only in landscape mode via CSS. */}
      <div className="mx-auto max-w-7xl px-6 pb-6">
        <FilterSystem
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activePhase={activePhase}
          setActivePhase={setActivePhase}
          activePlatform={activePlatform}
          setActivePlatform={setActivePlatform}
          minRating={minRating}
          setMinRating={setMinRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      {/* ============================================
          TIMELINE + MOVIE GRID
      ============================================ */}
      <section 
        id="timeline" 
        className="mx-auto max-w-7xl px-6 pb-20 pt-8"
      >
        {/* Timeline content remains centered. */}
        <div>
            {/* Header */}
            <div className="mb-9 flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-[3.5px] text-[#c5a46e]">CHRONOLOGICAL ORDER</div>
                <div className="section-title mt-1 text-4xl font-semibold tracking-[-1.8px]">The Complete MCU Timeline</div>
              </div>
              <div className="hidden text-right text-xs text-white/50 md:block">
                {filteredMovies.length} FILMS SHOWN<br />OF {totalMovies} TOTAL
              </div>
            </div>

            {/* Timeline Visual Progress Indicator */}
            <div className="mb-8 flex items-center gap-4 text-xs uppercase tracking-widest text-white/50">
              <div className="flex-1 h-px bg-white/10" />
              <div>MCU CHRONOLOGY • {filteredMovies.length} FILMS</div>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* The timeline blocks with line */}
            <div className="relative pl-10 md:pl-14">
              {/* Glowing vertical timeline line */}
              <div className="timeline-line" />
              <div 
                className="absolute left-[39px] top-0 z-10 w-[2px] bg-gradient-to-b from-[#c8102e]/30 via-[#c8102e] to-transparent transition-all duration-700" 
                style={{ height: `${Math.max(12, Math.min(94, timelineProgress))}%` }} 
              />
              <div className="timeline-pulse" style={{ top: `${Math.max(4, Math.min(86, timelineProgress - 4))}%` }} />

              <div className="space-y-8">
                {filteredMovies.map((movie, index) => {
                  const prevYear = index > 0 ? filteredMovies[index - 1].timelineYear : null;
                  const showYearMarker = prevYear === null || prevYear !== movie.timelineYear;

                  return (
                    <div key={movie.id} className="relative">
                      {/* Year Marker */}
                      {showYearMarker && (
                        <div className="absolute -left-10 top-3 z-20 flex items-center gap-3 md:-left-14">
                          <div className="rounded-full bg-[#c8102e] px-3.5 py-1 text-xs font-semibold tracking-[1.5px] text-white shadow-md">
                            {movie.timelineYear}
                          </div>
                          <div className="hidden h-px w-6 bg-white/20 md:block" />
                        </div>
                      )}

                      <div className="ml-2 md:ml-4">
                        <TimelineItem
                          movie={movie}
                          onDetails={openMovie}
                          onWatch={handleWatch}
                          onDownload={handleDownload}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredMovies.length === 0 && (
                <div className="py-16 text-center text-white/60">
                  No films match your current filters.<br />
                  <button onClick={clearFilters} className="mt-3 underline">Clear all filters</button>
                </div>
              )}
            </div>
          </div>
      </section>

      {/* ============================================
          MCU STATISTICS DASHBOARD
      ============================================ */}
      <section className="border-y border-white/10 bg-[#0a0a0a] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 text-center">
            <div className="text-xs tracking-[3.5px] text-[#c5a46e]">THE UNIVERSE AT A GLANCE</div>
            <div className="mt-1 text-3xl font-semibold tracking-[-1px]">MCU by the Numbers</div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {phasesData.map((phase: any, idx: number) => (
              <div key={idx} className="glass rounded-2xl p-6">
                <div className="text-xs tracking-widest text-white/50">{phase.name}</div>
                <div className="mt-2 text-5xl font-semibold tracking-[-1.5px] text-white">{phase.movies}</div>
                <div className="mt-1 text-sm text-white/60">films</div>
              </div>
            ))}
            <div className="glass col-span-1 flex flex-col justify-between rounded-2xl p-6 md:col-span-2 lg:col-span-1">
              <div>
                <div className="text-xs tracking-widest text-white/50">HIGHEST RATED</div>
                <div className="mt-3 text-[22px] font-semibold leading-none tracking-tight">Avengers: Infinity War &amp; Endgame</div>
              </div>
              <div className="mt-6 text-4xl font-semibold text-[#c5a46e] tracking-[-1px]">8.4</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          OTT PLATFORMS SECTION
      ============================================ */}
      <section id="platforms" className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <div className="text-xs tracking-[3.5px] text-[#c5a46e]">WATCH ANYWHERE</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight">Available on Premium Platforms</div>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {platformsData.map((platform: any) => (
            <div 
              key={platform.name} 
              onClick={() => {
                setActivePlatform(platform.name);
                document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all hover:border-[#c8102e]/50 hover:text-white active:scale-[0.985]"
              style={{ 
                background: `${platform.color}10`, 
                borderColor: `${platform.color}30`,
                color: 'white'
              }}
            >
              <PlatformLogo name={platform.name} className="h-4 w-4" />
              {platform.name}
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-white/50">Click a platform to filter the entire timeline</p>
      </section>

      {/* ============================================
          FINAL CTA + FOOTER
      ============================================ */}
      <footer className="border-t border-white/10 bg-black/60 py-16 text-center text-sm text-white/50">
        <div className="mx-auto max-w-md px-6">
          <div className="mb-2 flex justify-center">
            <img src="/favicon.ico" alt="MarvelVerse Logo" className="h-8 w-8 rounded-xl" />
          </div>
          <div className="font-semibold tracking-tight text-white text-lg">MARVELVERSE TIMELINE</div>
          <p className="mt-2 text-xs leading-relaxed">
            A premium fan experience. Not affiliated with Marvel Studios or Disney.<br />
            All links are placeholders and will be populated with official sources.
          </p>

          {/* Footer Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>

          {/* Copyright Disclaimer for AdSense compliance */}
          <p className="mt-6 text-[10px] leading-relaxed text-white/40 max-w-sm mx-auto">
            MarvelVerse is an unofficial fan-made MCU reference guide.<br />
            Marvel, Marvel Studios, and all related characters, logos, artwork, and trademarks are property of Marvel Entertainment and The Walt Disney Company.<br />
            This website is not affiliated with, endorsed by, or sponsored by Marvel Studios or Disney.
          </p>
        </div>

        <div className="mt-12 text-[10px] tracking-widest">© {new Date().getFullYear()} — CRAFTED WITH OBSESSION</div>
      </footer>

      {/* Random Movie Floating Action Button */}
      <button
        onClick={pickRandomMovie}
        className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#111] text-[#c5a46e] shadow-2xl backdrop-blur-xl transition active:scale-95 hover:bg-[#1a1a1a] hover:text-[#e8b923] lg:bottom-9 lg:right-9"
        aria-label="Pick a random MCU movie"
      >
        <Shuffle className="h-5 w-5" />
      </button>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-24 z-[90] flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#111]/90 text-white/60 backdrop-blur-xl hover:text-white lg:bottom-9 lg:right-[108px]"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* PREMIUM MOVIE DETAILS DRAWER */}
      <MovieDrawer 
        movie={selectedMovie} 
        isOpen={isDrawerOpen} 
        onClose={closeDrawer} 
      />
    </div>
  );
}
