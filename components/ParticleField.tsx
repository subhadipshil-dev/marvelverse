"use client";

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function ParticleField() {
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.92;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create cinematic red/gold particles
    for (let i = 0; i < 42; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.9,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.55 + 0.25,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle drift + wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height * 0.92;
        if (p.y > canvas.height * 0.92) p.y = 0;

        // Subtle pulse
        const pulse = Math.sin(Date.now() / 900 + i) * 0.2 + 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        
        // Alternate red / gold
        const isRed = i % 3 !== 0;
        ctx.fillStyle = isRed 
          ? `rgba(200,16,46,${p.alpha * 0.85})` 
          : `rgba(197,164,110,${p.alpha * 0.55})`;
        ctx.fill();

        // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.6 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = isRed 
          ? `rgba(200,16,46,${p.alpha * 0.07})` 
          : `rgba(197,164,110,${p.alpha * 0.04})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none absolute inset-0 z-10 mix-blend-screen" 
    />
  );
}
