"use client";

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface ParticleFieldProps {
  count?: number;
  baseOpacity?: number;
  speed?: number;
  heightFactor?: number;
  className?: string;
  zIndex?: string;
  /** 'hero' | 'ambient' controls density and movement character */
  variant?: 'hero' | 'ambient';
}

export function ParticleField({
  count,
  baseOpacity,
  speed = 1,
  heightFactor = 1,
  className = "",
  zIndex = "z-10",
  variant = "hero",
}: ParticleFieldProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion: render nothing / skip loop
    if (shouldReduceMotion) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrame: number;
    let particles: Array<{x: number; y: number; vx: number; vy: number; size: number; alpha: number}> = [];

    const isAmbient = variant === 'ambient';
    const particleCount = count ?? (isAmbient ? 22 : 42);
    const opacityMul = baseOpacity ?? (isAmbient ? 0.6 : 1);
    const moveSpeed = speed * (isAmbient ? 0.55 : 1);
    const hFactor = heightFactor * (isAmbient ? 1 : 0.92);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * hFactor;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create cinematic red/gold particles - fewer/slower for ambient global
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.95,
        vx: (Math.random() - 0.5) * 0.28 * moveSpeed,
        vy: (Math.random() - 0.5) * 0.18 * moveSpeed,
        size: Math.random() * (isAmbient ? 1.4 : 1.8) + (isAmbient ? 0.5 : 0.6),
        alpha: Math.random() * (isAmbient ? 0.38 : 0.55) + (isAmbient ? 0.15 : 0.25),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle drift + wrap
        const maxY = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = maxY;
        if (p.y > maxY) p.y = 0;

        // Subtle pulse - slower for ambient
        const pulseSpeed = isAmbient ? 1200 : 900;
        const pulse = Math.sin(Date.now() / pulseSpeed + i) * (isAmbient ? 0.15 : 0.2) + 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        
        // Alternate red / gold
        const isRed = i % 3 !== 0;
        const alpha = p.alpha * opacityMul;
        ctx.fillStyle = isRed 
          ? `rgba(200,16,46,${alpha * (isAmbient ? 0.9 : 0.85)})` 
          : `rgba(197,164,110,${alpha * (isAmbient ? 0.65 : 0.55)})`;
        ctx.fill();

        // Soft glow - more diffused for ambient global field
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (isAmbient ? 3.2 : 2.6) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = isRed 
          ? `rgba(200,16,46,${alpha * (isAmbient ? 0.045 : 0.07)})` 
          : `rgba(197,164,110,${alpha * (isAmbient ? 0.03 : 0.04)})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [count, baseOpacity, speed, heightFactor, variant]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`pointer-events-none absolute inset-0 ${zIndex} mix-blend-screen ${className}`} 
    />
  );
}
