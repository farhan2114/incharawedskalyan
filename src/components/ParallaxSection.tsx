import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assets } from '../data/assets';
import { weddingConfig } from '../wedding.config';

gsap.registerPlugin(ScrollTrigger);

export const ParallaxSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.parallax-img',
        { yPercent: -3, scale: 1.04 },
        {
          yPercent: 3,
          scale: 1.04,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const { banner } = weddingConfig;

  return (
    <div
      ref={containerRef}
      className="relative h-[48vh] min-h-[360px] sm:h-[62vh] sm:min-h-[480px] lg:h-[70vh] overflow-hidden bg-[#1a0a0f]"
    >
      <img
        src={banner.image || '/client-images/banner.jpg'}
        alt={banner.alt || 'Beach sunset wedding mandap at ANASUYA, Kapu'}
        loading="eager"
        decoding="async"
        className="parallax-img absolute -top-[8%] left-0 h-[116%] w-full object-cover object-center will-change-transform"
        style={{ imageRendering: 'auto' }}
      />
      {/* Subtle Warm Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

      {/* Floating Glassmorphic Transparent Card with Quote */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="relative mx-auto max-w-lg rounded-2xl border border-gold/50 bg-black/40 px-5 py-6 text-center shadow-2xl backdrop-blur-md sm:px-8 sm:py-8">
          <span className="font-serif text-[10px] sm:text-xs uppercase tracking-[0.28em] text-gold font-medium">
            Where Celebrations Meet The Shore
          </span>
          <p className="mt-3 font-display text-lg sm:text-2xl md:text-3xl leading-snug sm:leading-relaxed text-paper drop-shadow-md">
            &ldquo;{banner.quote}&rdquo;
          </p>
          <div className="rule-gold mx-auto mt-4 w-16" />
          <p className="mt-3 font-title text-[11px] sm:text-xs tracking-widest uppercase text-paper/90">
            Inchara &amp; Kalyan &bull; Kapu Beach
          </p>
        </div>
      </div>
    </div>
  );
};
