"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
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

// Reusable animation variants for premium scroll feel (staggered, spring, elegant)
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 70, damping: 16 }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const headingVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
  }
};

const posterVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 60, damping: 18 }
  }
};

const HERO_MOVIE_IDS = [
  "avengers-endgame",
  "avengers-infinity-war",
  "spider-man-no-way-home",
  "black-panther",
  "captain-america-civil-war",
] as const;

const HERO_ROTATION_MS = 4000;
const HERO_FADE_DURATION = 0.5;

// Main Page
export default function MarvelverseTimeline() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhase, setActivePhase] = useState("All");
  const [activePlatform, setActivePlatform] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"timeline" | "rating" | "release" | "alpha">("timeline");

  const heroMovies = useMemo(
    () =>
      HERO_MOVIE_IDS.map((id) => movies.find((movie) => movie.id === id)).filter(
        (movie): movie is Movie => Boolean(movie)
      ),
    []
  );
  const [currentHeroIndex, setCurrentHeroIndex] = useState(
    Math.max(
      0,
      heroMovies.findIndex((movie) => movie.id === "avengers-endgame")
    )
  );
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isHeroCarouselHovered, setIsHeroCarouselHovered] = useState(false);
  const currentHeroMovie = heroMovies[currentHeroIndex] || movies[0];

  const shouldReduceMotion = useReducedMotion();

  // For timeline progressive line glow
  const timelineRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.4, 1, 0.9]);

  // Subtle parallax for allowed elements (hero backdrop already has Ken Burns; featured poster)
  const { scrollYProgress: pageScroll } = useScroll();
  const featuredPosterY = useTransform(pageScroll, [0.08, 0.32], [4, -14]);
  const featuredPosterScale = useTransform(pageScroll, [0.08, 0.32], [0.985, 1.012]);

  // (No longer needed for background — kept minimal for any future subtle effects if required)

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

  useEffect(() => {
    if (shouldReduceMotion || isHeroHovered || isHeroCarouselHovered || heroMovies.length < 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, HERO_ROTATION_MS);

    return () => window.clearTimeout(timer);
  }, [currentHeroIndex, heroMovies.length, isHeroCarouselHovered, isHeroHovered, shouldReduceMotion]);

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

  // Support switching movies directly from inside the details view (cinematic "scene change")
  const handleMovieChange = (newMovie: Movie) => {
    setSelectedMovie(newMovie);
    // Drawer stays open; the drawer component will scroll its content to top via its own effect
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
    <div className="min-h-screen bg-[#0f0f14] text-[#f5f5f5] selection:bg-[#c8102e] selection:text-white">
      {/* ============================================
          CINEMATIC PREMIUM BACKGROUND LAYERS
          Layered ambient red + gold radials, scroll-reactive lighting,
          subtle floating particles (global ambient), soft vignette.
          Feels like a Marvel Studios streaming title sequence.
      ============================================ */}
      <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
        {/* Soft dark charcoal base — richer and more comfortable than pure black */}
        <div className="absolute inset-0 bg-[#0f0f14]" />

        {/* Layered ambient red glow — restrained, upper-left for subtle warmth and depth */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(ellipse at 28% 16%, rgba(200,16,46,0.055) 0%, transparent 52%)' 
          }} 
        />

        {/* Layered warm gold glow — lower-right, very soft for elegant richness */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(ellipse at 68% 82%, rgba(197,164,110,0.042) 0%, transparent 56%)' 
          }} 
        />

        {/* Gentle center light wash — soft atmospheric light behind hero/featured area */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(ellipse at 50% 20%, rgba(232,225,210,0.018) 0%, transparent 65%)' 
          }} 
        />

        {/* Very soft ambient color blobs for organic depth (low opacity blur "glows" around sections) */}
        <div 
          className="absolute rounded-full" 
          style={{ 
            left: '8%', 
            top: '8%', 
            width: '520px', 
            height: '520px', 
            background: 'rgba(200,16,46,0.035)', 
            filter: 'blur(180px)' 
          }} 
        />
        <div 
          className="absolute rounded-full" 
          style={{ 
            right: '6%', 
            bottom: '22%', 
            width: '580px', 
            height: '580px', 
            background: 'rgba(197,164,110,0.028)', 
            filter: 'blur(200px)' 
          }} 
        />

        {/* Subtle edge vignette — only at the very edges, not crushing the whole page */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(0,0,0,0.28)_100%)]" />

        {/* Faint textured noise/grain layer — prevents flatness while staying elegant and invisible at distance */}
        <div 
          className="absolute inset-0 opacity-[0.035] mix-blend-screen" 
          style={{
            backgroundImage: 'radial-gradient(#fff 0.6px, transparent 0.6px)',
            backgroundSize: '3.5px 3.5px',
            backgroundPosition: '0 0'
          }} 
        />

        {/* Global subtle ambient particle field (very faint cinematic dust for life) */}
        <ParticleField 
          variant="ambient" 
          zIndex="z-[-1]" 
          className="opacity-[0.55]" 
        />
      </div>

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
      <section
        className="relative h-[760px] overflow-hidden border-b border-white/10 sm:h-[820px] lg:h-[860px]"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Dynamic Background crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentHeroMovie.id}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentHeroMovie.thumbnail})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : HERO_FADE_DURATION, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040404] via-[#050505]/92 to-[#050505]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,5,5,0.55)_72%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_35%,rgba(200,16,46,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

        {/* Subtle particle field for cinematic feel */}
        <ParticleField />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-6">
          <div className="grid flex-1 grid-rows-[1fr_auto] pt-10 pb-8">
            {/* Main content grid: Left info + Right poster */}
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,620px)_340px] lg:gap-12">
              {/* LEFT: Movie info */}
              <div className="flex h-[440px] w-full max-w-[620px] flex-col justify-between sm:h-[470px] lg:h-[500px]">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={currentHeroMovie.id}
                    className="flex h-full flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.2 : HERO_FADE_DURATION, ease: "easeInOut" }}
                  >
                    <div className="flex h-8 items-center gap-3">
                      <div className="inline-flex items-center rounded-full bg-[#c8102e]/90 px-4 py-1 text-xs font-semibold tracking-[2px] text-white">
                        {currentHeroMovie.phase}
                      </div>
                      <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-medium tracking-[1px] text-white/90">
                        {currentHeroMovie.timelineYear}
                      </div>
                    </div>

                    <div className="mt-6 flex h-[112px] items-start md:h-[142px]">
                      <h1 className="line-clamp-2 text-5xl font-semibold leading-[0.95] tracking-[-2.5px] text-white md:text-7xl">
                        {currentHeroMovie.title}
                      </h1>
                    </div>

                    <div className="mt-5 flex h-6 items-center gap-6 text-sm text-white/70">
                      <div className="flex items-center gap-1.5 font-semibold text-[#c5a46e]">
                        <Star className="h-4 w-4 fill-current" /> {currentHeroMovie.imdbRating} IMDb
                      </div>
                      <div>{currentHeroMovie.runtime}</div>
                      <div>{currentHeroMovie.releaseYear}</div>
                    </div>

                    <div className="mt-5 h-[72px] max-w-xl">
                      <p className="line-clamp-3 text-[15px] leading-6 text-white/80">
                        {currentHeroMovie.synopsis}
                      </p>
                    </div>

                    <div className="mt-5 h-[74px]">
                      <div className="mb-2 text-xs uppercase tracking-[2px] text-white/40">Available on</div>
                      <div className="flex h-[48px] flex-wrap content-start gap-2 overflow-hidden">
                        {currentHeroMovie.ottPlatforms.map((platform) => (
                          <div key={platform} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs">
                            <PlatformLogo name={platform} className="h-3.5 w-3.5" />
                            <span className="text-white/80">{platform}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex h-[60px] flex-wrap items-end gap-4 pt-8">
                      <button
                        onClick={() => openMovie(currentHeroMovie)}
                        className="btn btn-primary px-8 py-3.5 text-base"
                      >
                        EXPLORE MOVIE
                      </button>
                      <button
                        onClick={scrollToTimeline}
                        className="btn btn-secondary border-white/20 px-8 py-3.5 text-base"
                      >
                        VIEW TIMELINE POSITION
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* RIGHT: Large featured poster */}
              <div className="relative mx-auto flex h-[360px] w-[240px] flex-shrink-0 items-center justify-center sm:h-[420px] sm:w-[280px] lg:mx-0 lg:h-[510px] lg:w-[340px]">
                <div className="absolute -inset-8 rounded-full bg-[#c8102e] opacity-20 blur-[60px]" />
                <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_30px_80px_-15px_rgb(0,0,0,0.8)]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={currentHeroMovie.id}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.2 : HERO_FADE_DURATION, ease: "easeInOut" }}
                    >
                      <img
                        src={currentHeroMovie.thumbnail}
                        alt={currentHeroMovie.title}
                        className="h-full w-full object-contain object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-5 text-xs uppercase tracking-[2.5px] text-white/40">EXPLORE THE COLLECTION</div>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentHeroMovie.id}
                  className="mx-auto flex w-max items-end gap-[14px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.2 : HERO_FADE_DURATION, ease: "easeInOut" }}
                  onMouseEnter={() => setIsHeroCarouselHovered(true)}
                  onMouseLeave={() => setIsHeroCarouselHovered(false)}
                >
                  {heroMovies.map((movie, index) => {
                    const isActive = currentHeroMovie.id === movie.id;
                    return (
                    <button
                      key={movie.id}
                      onClick={() => setCurrentHeroIndex(index)}
                      className={cn(
                        "flex h-[174px] w-[112px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border bg-black/30 transition-all duration-300",
                        isActive
                          ? "-translate-y-[6px] border-[#c8102e] shadow-[0_0_24px_rgba(200,16,46,0.3)] ring-1 ring-[#c8102e]/40"
                          : "border-white/10"
                        )}
                      >
                        <div className="flex h-[144px] items-center justify-center bg-black">
                          <img
                            src={movie.thumbnail}
                            alt={movie.title}
                            className="h-full w-full object-contain object-center"
                          />
                        </div>
                        <div className="flex h-[30px] items-center bg-black/60 px-2 text-[10px] leading-4 text-white/90">
                          <span className="block w-full truncate text-center">{movie.title.split(":")[0]}</span>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED MOVIE OF THE WEEK (Premium Banner)
      ============================================ */}
      <motion.section 
        className="border-b border-white/10 bg-[#121218]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
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
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] md:flex-row cinematic-spotlight"
          >
            {/* Portrait poster on the side for featured - subtle scroll parallax + entry */}
            <motion.div 
              className="relative w-full overflow-hidden bg-black md:w-[260px] lg:w-[280px]"
              style={!shouldReduceMotion ? { y: featuredPosterY, scale: featuredPosterScale } : undefined}
            >
              <div className="relative aspect-[2/3] w-full md:aspect-auto md:h-full">
                <img 
                  src={featuredMovie.thumbnail} 
                  alt={featuredMovie.title} 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </motion.div>

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
      </motion.section>



      {/* ============================================
          TIMELINE + MOVIE GRID
      ============================================ */}
      {/* SINGLE FilterSystem component.
          Must remain completely static in normal document flow.
          Full-width horizontal layout, below featured and above timeline.
          EXCLUDED from all scroll animations and layout transforms.
          Do not wrap in motion, do not add special classes for docking/sidebar. */}
      <div className="mx-auto px-6 mt-10 pb-16">
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
        ref={timelineRef}
        className="mx-auto max-w-7xl px-6 pb-20 pt-8"
      >
        {/* Timeline content remains centered. */}
        <div>
            {/* Header - sequential reveal */}
            <motion.div 
              className="mb-9 flex items-end justify-between"
              variants={headingVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div>
                <div className="text-xs uppercase tracking-[3.5px] text-[#c5a46e]">CHRONOLOGICAL ORDER</div>
                <div className="section-title mt-1 text-4xl font-semibold tracking-[-1.8px]">The Complete MCU Timeline</div>
              </div>
              <div className="hidden text-right text-xs text-white/50 md:block">
                {filteredMovies.length} FILMS SHOWN<br />OF {totalMovies} TOTAL
              </div>
            </motion.div>

            {/* Timeline Visual Progress Indicator */}
            <div className="mb-8 flex items-center gap-4 text-xs uppercase tracking-widest text-white/50">
              <div className="flex-1 h-px bg-white/10" />
              <div>MCU CHRONOLOGY • {filteredMovies.length} FILMS</div>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* The timeline blocks with line */}
            <div className="relative pl-10 md:pl-14">
              {/* Glowing vertical timeline line - progressive glow on scroll */}
              <div className="timeline-line" />
              <motion.div 
                className="absolute left-[39px] top-0 z-10 w-[2px] bg-gradient-to-b from-[#c8102e]/30 via-[#c8102e] to-transparent"
                style={{ 
                  height: lineHeight,
                  opacity: lineOpacity,
                  boxShadow: "0 0 8px rgba(200,16,46,0.6)"
                }} 
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
          MCU INSIGHTS SHOWCASE
          Combined premium cinematic stats + platforms panel
      ============================================ */}
      <section id="platforms" className="relative border-y border-white/10 bg-[#0a0a0a] py-16 overflow-hidden">
        {/* Subtle cinematic background orb for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(200,16,46,0.06),transparent_60%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Shared Premium Header */}
          <div className="text-center mb-10">
            <div className="text-xs tracking-[3.5px] text-[#c5a46e]">THE UNIVERSE AT A GLANCE</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight">MCU Insights</div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* LEFT: MCU by the Numbers - Premium Dashboard Style */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-[2.5px] text-[#c5a46e]">MCU BY THE NUMBERS</div>
                  <div className="text-xl font-semibold tracking-tight">Phases & Highlights</div>
                </div>
                {/* Subtle total films highlight */}
                <div className="hidden md:block text-right">
                  <div className="text-[10px] tracking-[2px] text-white/50">TOTAL FILMS</div>
                  <div className="text-3xl font-semibold tabular-nums text-white">
                    <AnimatedCounter value={phasesData.reduce((sum: number, p: any) => sum + p.movies, 0)} />
                  </div>
                </div>
              </div>

              {/* Phase Cards - tighter, more interesting with color accents and progress */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {phasesData.map((phase: any, idx: number) => {
                  const maxMovies = Math.max(...phasesData.map((p: any) => p.movies));
                  const progress = Math.round((phase.movies / maxMovies) * 100);
                  return (
                    <motion.div 
                      key={idx} 
                      className="glass rounded-2xl p-5 cinematic-spotlight group relative overflow-hidden border border-white/10"
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    >
                      {/* Color accent bar */}
                      <div 
                        className="absolute top-0 left-0 h-1 w-full" 
                        style={{ background: phase.color }} 
                      />
                      
                      <div className="text-xs tracking-widest text-white/50 mb-1">{phase.name}</div>
                      <div className="text-4xl font-semibold tracking-[-1.5px] text-white tabular-nums">
                        <AnimatedCounter value={phase.movies} />
                      </div>
                      <div className="text-sm text-white/60">films</div>

                      {/* Faint progress bar for visual energy */}
                      <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700 group-hover:brightness-125" 
                          style={{ 
                            width: `${progress}%`, 
                            background: phase.color 
                          }} 
                        />
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">{progress}% of peak phase</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Featured Highlight Card - larger, cinematic, with glow */}
              <motion.div 
                className="glass rounded-3xl p-6 md:p-7 border border-white/10 cinematic-spotlight relative overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Subtle red ambient glow inside */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#c8102e]/10 rounded-full blur-3xl" />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-xs tracking-[2.5px] text-[#c5a46e]">HIGHEST RATED</div>
                    <div className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
                      Avengers: Infinity War &amp; Endgame
                    </div>
                    <div className="mt-1 text-sm text-white/60">Tied for the pinnacle of the MCU</div>
                  </div>
                  <div className="text-6xl md:text-7xl font-semibold text-[#c5a46e] tracking-[-2px] tabular-nums">
                    8.4
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Available on Premium Platforms - Featured Experience Panel */}
            <div className="lg:col-span-5">
              <div className="glass-strong rounded-3xl p-7 border border-white/10 h-full flex flex-col">
                <div>
                  <div className="text-xs tracking-[3.5px] text-[#c5a46e]">WATCH ANYWHERE</div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight">Available on Premium Platforms</div>
                  <p className="mt-2 text-sm text-white/70">Where to watch the MCU in style</p>
                </div>

                {/* Elegant platform panel with larger, richer badges */}
                <div className="mt-auto pt-6">
                  <motion.div 
                    className="flex flex-wrap gap-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {platformsData.map((platform: any, idx: number) => (
                      <motion.button 
                        key={platform.name} 
                        variants={cardVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => {
                          setActivePlatform(platform.name);
                          document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group flex-1 min-w-[140px] flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.015] px-4 py-3 text-left transition-all hover:border-[#c8102e]/40 hover:bg-white/[0.03]"
                        style={{ 
                          borderColor: `${platform.color}30`,
                        }}
                      >
                        <div className="flex-shrink-0">
                          <PlatformLogo name={platform.name} className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-sm tracking-tight text-white group-hover:text-[#c5a46e] transition-colors">
                            {platform.name}
                          </div>
                          <div className="text-[10px] text-white/50">Premium</div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                  <p className="mt-4 text-center text-[10px] text-white/50 tracking-widest">Click any platform to filter the timeline instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CINEMATIC PREMIUM FOOTER
      ============================================ */}
      <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-10 text-sm text-white/60">
        <div className="mx-auto max-w-7xl px-6">
          {/* Top Brand Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-y-10 pb-10 border-b border-white/10">
            {/* Brand + Description */}
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <img src="/favicon.ico" alt="MarvelVerse Logo" className="h-9 w-9 rounded-xl ring-1 ring-white/10" />
                <div>
                  <div className="font-semibold tracking-[-0.5px] text-xl text-white">MARVELVERSE</div>
                  <div className="text-[9px] -mt-1 text-[#c5a46e] tracking-[3px]">TIMELINE</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-white/70 pr-2">
                A premium fan-made MCU timeline experience.<br />
                Explore the complete chronological order of the Marvel Cinematic Universe in an elegant, immersive interface.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col sm:flex-row gap-x-16 gap-y-8 text-xs">
              <div>
                <div className="uppercase tracking-[2.5px] text-[#c5a46e] text-[10px] mb-3">NAVIGATE</div>
                <div className="flex flex-col gap-2.5">
                  <Link href="/about" className="hover:text-white transition-colors">About</Link>
                  <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                </div>
              </div>
              <div>
                <div className="uppercase tracking-[2.5px] text-[#c5a46e] text-[10px] mb-3">LEGAL</div>
                <div className="flex flex-col gap-2.5">
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Disclaimer + Developer Credit */}
          <div className="py-8 border-b border-white/10">
            {/* Disclaimer */}
            <p className="text-[10px] leading-relaxed text-white/40 max-w-2xl">
              MarvelVerse is an unofficial fan-made MCU reference guide.<br />
              Marvel, Marvel Studios, and all related characters, logos, artwork, and trademarks are property of Marvel Entertainment and The Walt Disney Company.<br />
              This website is not affiliated with, endorsed by, or sponsored by Marvel Studios or Disney.
            </p>

            {/* Developer Credit - Gold accent, professional signature */}
            <div className="mt-5 text-xs">
              Developed by <a 
                href="https://in.linkedin.com/in/subhadip-shil-867aaa255" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#c5a46e] hover:text-[#e8b923] underline decoration-[#c5a46e]/50 hover:decoration-[#e8b923] transition-colors"
              >
                Subhadip Shil
              </a>
            </div>
          </div>

          {/* Bottom: Copyright + Subtle Red Glow Accent */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-y-2 text-[10px] tracking-widest text-white/40">
            <div>© {new Date().getFullYear()} MARVELVERSE — ALL RIGHTS RESERVED</div>
            <div className="flex items-center gap-2">
              CRAFTED WITH OBSESSION
              <span className="inline-block w-1.5 h-px bg-[#c8102e]/60" />
            </div>
          </div>
        </div>

        {/* Subtle ambient red glow line at very bottom for cinematic close */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c8102e]/20 to-transparent mt-8" />
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
        onMovieChange={handleMovieChange}
      />
    </div>
  );
}
