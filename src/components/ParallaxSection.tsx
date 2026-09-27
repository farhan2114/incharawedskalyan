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
        { yPercent: -6, scale: 1.15 },
        {
          yPercent: 6,
          scale: 1.15,
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
      className="relative h-[65vh] min-h-[480px] sm:min-h-[580px] md:h-[76vh] overflow-hidden bg-[#24080e]"
    >
      <img
        src={banner.image || '/client-images/banner.jpg'}
        alt={banner.alt || 'The wedding mandap'}
        loading="lazy"
        width={1920}
        height={1080}
        className="parallax-img absolute -top-[15%] left-0 h-[130%] w-full object-cover object-center sm:object-[center_45%] will-change-transform brightness-[0.92]"
      />
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />

      {/* Floating Glassmorphic Transparent Card with Quote */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
        <div className="relative mx-auto max-w-xl rounded-2xl border border-gold/40 bg-black/45 px-6 py-8 text-center shadow-2xl backdrop-blur-md sm:px-10 sm:py-10">
          <span className="font-serif text-[11px] sm:text-xs uppercase tracking-[0.3em] text-gold font-medium">
            Sacred Union &bull; ANASUYA, Kapu
          </span>
          <p className="mt-4 font-display text-xl sm:text-3xl md:text-4xl leading-relaxed text-paper drop-shadow">
            &ldquo;{banner.quote}&rdquo;
          </p>
          <div className="rule-gold mx-auto mt-5 w-20" />
          <p className="mt-4 font-title text-xs sm:text-sm tracking-widest uppercase text-paper/80">
            Inchara &amp; Kalyan
          </p>
        </div>
      </div>
    </div>
  );
};
