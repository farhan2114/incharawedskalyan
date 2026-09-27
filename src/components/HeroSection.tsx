import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { assets } from '../data/assets';
import { weddingConfig, weddingData } from '../wedding.config';
import { playAudio } from '../lib/audio';

const paperCards = [
  { x: -320, y: 180, r: -24, d: 0, w: 120, h: 158 },
  { x: 300, y: 220, r: 18, d: 0.08, w: 96, h: 126 },
  { x: -190, y: -160, r: 32, d: 0.16, w: 84, h: 110 },
  { x: 230, y: -140, r: -30, d: 0.24, w: 108, h: 142 },
  { x: -400, y: -40, r: 12, d: 0.32, w: 76, h: 100 },
  { x: 420, y: 40, r: -14, d: 0.4, w: 88, h: 116 },
];

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [opened, setOpened] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Lock scroll until opened
  useEffect(() => {
    const docEl = document.documentElement;
    if (opened) {
      document.body.classList.remove('doors-locked');
      docEl.classList.remove('doors-locked');
      return;
    }
    window.scrollTo(0, 0);
    document.body.classList.add('doors-locked');
    docEl.classList.add('doors-locked');

    const prevent = (e: Event) => e.preventDefault();
    const handleKey = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });
    window.addEventListener('keydown', handleKey, { passive: false });

    return () => {
      document.body.classList.remove('doors-locked');
      docEl.classList.remove('doors-locked');
      window.removeEventListener('wheel', prevent);
      window.removeEventListener('touchmove', prevent);
      window.removeEventListener('keydown', handleKey);
    };
  }, [opened]);

  // Setup GSAP animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => setOpened(true),
      });

      tl.to('.doors-button', { autoAlpha: 0, duration: 0.25, pointerEvents: 'none', ease: 'power2.out' }, 'open')
        .to('.door-l', { rotateY: -104, duration: prefersReduced ? 0.3 : 2.1, ease: 'power3.inOut' }, 'open')
        .to('.door-r', { rotateY: 104, duration: prefersReduced ? 0.3 : 2.1, ease: 'power3.inOut' }, 'open')
        .to('.doors-container', { autoAlpha: 0, duration: 0.4, pointerEvents: 'none', ease: 'power2.out', onComplete: () => setOpened(true) }, 'open+=1.9')
        .to('.door-shadow', { autoAlpha: 0, duration: 1.4 }, 'open')
        .fromTo('.temple', { scale: 1.18, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.2, ease: 'power2.out' }, 'open+=0.2')
        .fromTo(
          '.paper',
          { autoAlpha: 0, x: 0, y: 60, scale: 0.4, rotate: 0 },
          {
            autoAlpha: 1,
            x: (i) => paperCards[i].x,
            y: (i) => paperCards[i].y,
            scale: 1,
            rotate: (i) => paperCards[i].r,
            duration: 1.9,
            ease: 'power2.out',
            stagger: 0.07,
          },
          'open+=0.85'
        )
        .fromTo(
          '.invite-card',
          { autoAlpha: 0, y: 140, scale: 0.62, rotateX: 42 },
          { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 1.6, ease: 'power4.out' },
          'open+=1.15'
        )
        .fromTo(
          '.invite-line',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out' },
          '-=0.85'
        );

      tlRef.current = tl;
    }, section);

    return () => ctx.revert();
  }, []);

  const handleOpen = () => {
    if (clicked) return;
    setClicked(true);
    playAudio();
    tlRef.current?.play();
  };

  return (
    <section
      ref={sectionRef}
      className={`${
        opened ? 'relative' : 'fixed inset-0 z-[100]'
      } flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-background`}
    >
      {/* Temple Backdrop */}
      <img
        src={assets.temple}
        alt="Temple gopuram archway"
        className="temple pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-0 blur-[1px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-background/54" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[var(--gradient-veil)]" />

      {/* Floating Paper Cards */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {paperCards.map((card, i) => (
          <div
            key={i}
            className="paper absolute opacity-0 shadow-[var(--shadow-card)]"
            style={{ width: `${card.w}px`, height: `${card.h}px` }}
          >
            <div className="h-full w-full border border-gold/40 bg-paper">
              <div className="m-2 h-full border border-gold/25 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_70%)]" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Invitation Card */}
      <div className="relative z-20 w-full px-5 [perspective:1400px]">
        <div className="invite-card mx-auto max-w-xl opacity-0">
          <div className="paper-card arch-top relative px-4 py-10 text-center sm:px-12 sm:py-16">
            <img
              src={assets.mandalaGold}
              alt=""
              aria-hidden="true"
              width="1024"
              height="1024"
              className="pointer-events-none absolute -top-16 left-1/2 w-28 -translate-x-1/2 opacity-60 sm:-top-20 sm:w-36"
            />
            <p className="invite-line eyebrow mt-6">{weddingData.dateShort}</p>
            <h1 className="invite-line mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-display text-2xl min-[360px]:text-3xl min-[480px]:text-5xl sm:text-6xl md:text-7xl leading-[1.08] break-words">
              <span className="text-gold-foil animate-foil">{weddingData.bride}</span>
              <span className="mx-1.5 font-title text-base sm:text-2xl md:text-3xl align-middle text-maroon">&amp;</span>
              <span className="text-gold-foil animate-foil">{weddingData.groom}</span>
            </h1>
            <div className="invite-line rule-gold mx-auto mt-8 w-2/3" />
            <p className="invite-line mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {weddingData.invitationLine}
            </p>
            <p className="invite-line mt-8 font-title text-lg tracking-wide">{weddingData.dateLabel}</p>
            <p className="invite-line mt-1 text-sm text-muted-foreground">
              {weddingData.muhurtham} · {weddingData.venue}, {weddingData.city}
            </p>
            <a
              href="#blessings"
              className="invite-line mt-9 inline-flex items-center gap-2 border border-gold/60 bg-transparent px-6 py-3 text-[0.7rem] uppercase tracking-[0.3em] text-gold-deep transition-colors hover:bg-gold/10"
            >
              Send your blessing
            </a>
          </div>
        </div>
      </div>

      {/* ── Temple Doors ── */}
      {!opened && (
        <div className="doors-container absolute inset-0 z-30 flex [perspective:1600px]">
          <div
            className="door-l relative h-full w-1/2 origin-left bg-cover bg-right"
            style={{ backgroundImage: `url(${assets.templeDoor})`, transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/50 to-transparent" />
          </div>
          <div
            className="door-r relative h-full w-1/2 origin-right bg-cover bg-left"
            style={{ backgroundImage: `url(${assets.templeDoor})`, transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/50 to-transparent" />
          </div>

          {!clicked && (
            <button
              type="button"
              onClick={handleOpen}
              aria-label="Open the temple doors and enter the invitation"
              className="doors-button absolute inset-0 flex flex-col items-center justify-end gap-3 pb-24 focus:outline-none cursor-pointer"
            >
              <span className="rounded-full border border-gold/70 bg-black/35 px-8 py-4 font-title text-[0.7rem] uppercase tracking-[0.32em] text-paper backdrop-blur-sm transition-colors hover:bg-black/55">
                {weddingConfig.invitation.doorsButtonText || 'Tap to open the doors'}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.24em] text-paper/70">
                {weddingConfig.invitation.doorsSubText || 'Music will play softly'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Door Shadow Overlay */}
      <div className="door-shadow pointer-events-none absolute inset-0 z-40 bg-black/25" />
    </section>
  );
};
