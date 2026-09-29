import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { weddingConfig } from '../wedding.config';
import { RevealOnScroll } from './RevealOnScroll';
import { SpinningMandala } from './Ornaments';
import {
  ArrowRight,
  X,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Navigation,
  Shirt,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface EventItem {
  id: string;
  name: string;
  tagline: string;
  day: string;
  time: string;
  place: string;
  address?: string;
  mapsUrl: string;
  image: string;
  note: string;
  funLines: string;
  dressCode: string;
}

// Lazy-cached confetti shapes to guarantee zero lag, zero flicker, and maximum performance
let cachedMusicShapes: any[] | null = null;
let cachedRoseShapes: any[] | null = null;

const getCachedMusicShapes = () => {
  if (!cachedMusicShapes && typeof window !== 'undefined') {
    try {
      cachedMusicShapes = [
        confetti.shapeFromText({ text: '♫', scalar: 2.2 }),
        confetti.shapeFromText({ text: '♪', scalar: 2.2 }),
        confetti.shapeFromText({ text: '♬', scalar: 2.2 }),
        confetti.shapeFromText({ text: '♩', scalar: 2.2 }),
        confetti.shapeFromText({ text: '✨', scalar: 1.8 }),
      ];
    } catch {
      cachedMusicShapes = ['circle', 'square'];
    }
  }
  return cachedMusicShapes || ['circle', 'square'];
};

const getCachedRoseShapes = () => {
  if (!cachedRoseShapes && typeof window !== 'undefined') {
    try {
      cachedRoseShapes = [
        confetti.shapeFromText({ text: '🌹', scalar: 2.4 }),
        confetti.shapeFromText({ text: '🌸', scalar: 2.2 }),
        confetti.shapeFromText({ text: '🌺', scalar: 2.0 }),
      ];
    } catch {
      cachedRoseShapes = ['circle'];
    }
  }
  return cachedRoseShapes || ['circle'];
};

export const EventsSection: React.FC = () => {
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Automatic carousel rotation every 2.8 seconds (pauses on hover or when modal is open)
  useEffect(() => {
    if (isPaused || activeModalEvent) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 2800);

    return () => clearInterval(timer);
  }, [isPaused, activeModalEvent]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        setActiveIndex((prev) => (prev + 1) % 3);
      } else {
        setActiveIndex((prev) => (prev - 1 + 3) % 3);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const nextEvent = () => setActiveIndex((prev) => (prev + 1) % 3);
  const prevEvent = () => setActiveIndex((prev) => (prev - 1 + 3) % 3);

  const [modalSwipeDirection, setModalSwipeDirection] = useState<'left' | 'right' | null>(null);
  const modalTouchStartX = useRef<number | null>(null);
  const modalTouchStartY = useRef<number | null>(null);

  const handleModalTouchStart = (e: React.TouchEvent) => {
    modalTouchStartX.current = e.touches[0].clientX;
    modalTouchStartY.current = e.touches[0].clientY;
  };

  const handleModalTouchEnd = (e: React.TouchEvent) => {
    if (modalTouchStartX.current === null || modalTouchStartY.current === null || !activeModalEvent) return;
    const deltaX = e.changedTouches[0].clientX - modalTouchStartX.current;
    const deltaY = e.changedTouches[0].clientY - modalTouchStartY.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goToNextModalEvent();
      } else {
        goToPrevModalEvent();
      }
    }
    modalTouchStartX.current = null;
    modalTouchStartY.current = null;
  };

  const goToNextModalEvent = () => {
    if (!activeModalEvent) return;
    const currentIdx = events.findIndex((e) => e.name === activeModalEvent.name);
    const nextIdx = (currentIdx + 1) % events.length;
    const nextEv = events[nextIdx];
    setModalSwipeDirection('right');
    setActiveModalEvent(nextEv);
    setActiveIndex(nextIdx);
    triggerThemedSplash(nextEv.id || 'haldi');
    setTimeout(() => setModalSwipeDirection(null), 300);
  };

  const goToPrevModalEvent = () => {
    if (!activeModalEvent) return;
    const currentIdx = events.findIndex((e) => e.name === activeModalEvent.name);
    const prevIdx = (currentIdx - 1 + events.length) % events.length;
    const prevEv = events[prevIdx];
    setModalSwipeDirection('left');
    setActiveModalEvent(prevEv);
    setActiveIndex(prevIdx);
    triggerThemedSplash(prevEv.id || 'haldi');
    setTimeout(() => setModalSwipeDirection(null), 300);
  };

  const switchModalEvent = (targetIdx: number) => {
    if (!activeModalEvent) return;
    const currentIdx = events.findIndex((e) => e.name === activeModalEvent.name);
    if (currentIdx === targetIdx) return;
    const dir = targetIdx > currentIdx ? 'right' : 'left';
    const nextEv = events[targetIdx];
    setModalSwipeDirection(dir);
    setActiveModalEvent(nextEv);
    setActiveIndex(targetIdx);
    triggerThemedSplash(nextEv.id || 'haldi');
    setTimeout(() => setModalSwipeDirection(null), 300);
  };

  const getCardTransform = (idx: number, total: number) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      return {
        transform: 'translate(-50%, -50%) translate3d(0, 0, 0) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto' as const,
      };
    } else if (diff === -1) {
      return {
        transform: isMobile
          ? 'translate(-50%, -50%) translate3d(-26%, 0, -60px) rotateY(16deg) scale(0.88)'
          : 'translate(-50%, -50%) translate3d(-34%, 0, -120px) rotateY(20deg) scale(0.90)',
        opacity: 0.42,
        zIndex: 10,
        pointerEvents: 'auto' as const,
      };
    } else {
      return {
        transform: isMobile
          ? 'translate(-50%, -50%) translate3d(26%, 0, -60px) rotateY(-16deg) scale(0.88)'
          : 'translate(-50%, -50%) translate3d(34%, 0, -120px) rotateY(-20deg) scale(0.90)',
        opacity: 0.42,
        zIndex: 10,
        pointerEvents: 'auto' as const,
      };
    }
  };

  const triggerThemedSplash = (themeKey: string) => {
    if (themeKey === 'haldi') {
      const turmericColors = ['#FFB703', '#FB8500', '#F59E0B', '#EAB308', '#FDE047', '#FEF08A', '#D97706', '#FFFBEB', '#FFD700', '#FFFFFF'];

      // Wave 1: Center massive cloudburst
      confetti({
        particleCount: 160,
        spread: 360,
        startVelocity: 50,
        ticks: 280,
        gravity: 0.65,
        origin: { x: 0.5, y: 0.45 },
        colors: turmericColors,
        shapes: ['circle'],
        scalar: 1.35,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Left edge cannon sweeping across full screen
      confetti({
        particleCount: 90,
        angle: 60,
        spread: 85,
        startVelocity: 56,
        ticks: 280,
        gravity: 0.6,
        origin: { x: 0.04, y: 0.65 },
        colors: turmericColors,
        shapes: ['circle'],
        scalar: 1.25,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Right edge cannon sweeping across full screen
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 85,
        startVelocity: 56,
        ticks: 280,
        gravity: 0.6,
        origin: { x: 0.96, y: 0.65 },
        colors: turmericColors,
        shapes: ['circle'],
        scalar: 1.25,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Top cloud mist showering downwards
      confetti({
        particleCount: 85,
        angle: 90,
        spread: 180,
        startVelocity: 26,
        ticks: 300,
        gravity: 0.45,
        origin: { x: 0.5, y: 0.04 },
        colors: ['#FEF08A', '#FDE047', '#EAB308', '#FFFFFF'],
        shapes: ['circle'],
        scalar: 1.6,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Wave 2: Secondary golden sparkles & burst
      setTimeout(() => {
        confetti({
          particleCount: 110,
          spread: 360,
          startVelocity: 42,
          ticks: 260,
          gravity: 0.55,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#FFD700', '#FFF8DC', '#FFA500', '#FDE047'],
          shapes: ['circle'],
          scalar: 1.4,
          zIndex: 99999,
          disableForReducedMotion: true,
        });
      }, 140);

    } else if (themeKey === 'sangeet') {
      const musicShapes = getCachedMusicShapes();
      const musicalColors = ['#E11D48', '#C026D3', '#9333EA', '#F43F5E', '#F59E0B', '#FDE047', '#A855F7', '#38BDF8', '#FFFFFF'];

      // Wave 1: Center explosion of notes
      confetti({
        particleCount: 130,
        spread: 360,
        startVelocity: 50,
        ticks: 280,
        gravity: 0.55,
        origin: { x: 0.5, y: 0.45 },
        colors: musicalColors,
        shapes: musicShapes,
        scalar: 2.1,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Left cannon notes sweeping right
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 80,
        startVelocity: 54,
        ticks: 290,
        gravity: 0.5,
        origin: { x: 0.04, y: 0.68 },
        colors: musicalColors,
        shapes: musicShapes,
        scalar: 2.0,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Right cannon notes sweeping left
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 80,
        startVelocity: 54,
        ticks: 290,
        gravity: 0.5,
        origin: { x: 0.96, y: 0.68 },
        colors: musicalColors,
        shapes: musicShapes,
        scalar: 2.0,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Top sparkling beats cascading down
      confetti({
        particleCount: 75,
        angle: 90,
        spread: 180,
        startVelocity: 30,
        ticks: 300,
        gravity: 0.42,
        origin: { x: 0.5, y: 0.04 },
        colors: ['#FDE047', '#F472B6', '#C084FC', '#38BDF8', '#FFFFFF'],
        shapes: ['circle', 'square'],
        scalar: 1.3,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Wave 2: Secondary rhythm flurry
      setTimeout(() => {
        confetti({
          particleCount: 95,
          spread: 360,
          startVelocity: 44,
          ticks: 260,
          gravity: 0.5,
          origin: { x: 0.5, y: 0.5 },
          colors: musicalColors,
          shapes: musicShapes,
          scalar: 2.2,
          zIndex: 99999,
          disableForReducedMotion: true,
        });
      }, 140);

    } else {
      // wedding: Rose Petals Shower
      const roseShapes = getCachedRoseShapes();
      const roseColors = ['#991B1B', '#BE123C', '#E11D48', '#881337', '#FB7185', '#F43F5E', '#D4AF37', '#FFE4E6', '#FFF1F2'];

      // Wave 1: Center explosion of petals
      confetti({
        particleCount: 140,
        spread: 360,
        startVelocity: 46,
        ticks: 320,
        gravity: 0.45,
        origin: { x: 0.5, y: 0.45 },
        colors: roseColors,
        shapes: roseShapes,
        scalar: 2.3,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Left cannon rose petals
      confetti({
        particleCount: 90,
        angle: 60,
        spread: 80,
        startVelocity: 52,
        ticks: 320,
        gravity: 0.45,
        origin: { x: 0.04, y: 0.65 },
        colors: roseColors,
        shapes: roseShapes,
        scalar: 2.1,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Right cannon rose petals
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 80,
        startVelocity: 52,
        ticks: 320,
        gravity: 0.45,
        origin: { x: 0.96, y: 0.65 },
        colors: roseColors,
        shapes: roseShapes,
        scalar: 2.1,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Top gentle curtain of rose petals raining down
      confetti({
        particleCount: 105,
        angle: 90,
        spread: 180,
        startVelocity: 26,
        ticks: 340,
        gravity: 0.38,
        origin: { x: 0.5, y: 0.0 },
        colors: roseColors,
        shapes: roseShapes,
        scalar: 1.9,
        zIndex: 99999,
        disableForReducedMotion: true,
      });

      // Wave 2: Secondary shower of royal blossoms
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 360,
          startVelocity: 38,
          ticks: 320,
          gravity: 0.4,
          origin: { x: 0.5, y: 0.5 },
          colors: roseColors,
          shapes: roseShapes,
          scalar: 2.3,
          zIndex: 99999,
          disableForReducedMotion: true,
        });
      }, 140);
    }
  };

  const handleOpenEventModal = (event: EventItem) => {
    const themeKey = event.id || 'haldi';
    triggerThemedSplash(themeKey);
    setActiveModalEvent(event);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalEvent(null);
    };
    if (activeModalEvent) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalEvent]);

  // Card theme configs matching reference image
  const cardThemes: Record<
    string,
    {
      titleColor: string;
      titleShadow: string;
      gradientOverlay: string;
      btnBg: string;
      btnRing: string;
      btnColor: string;
      topIcon: React.ReactNode;
    }
  > = {
    haldi: {
      titleColor: 'text-[#5C2E00]',
      titleShadow: 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]',
      gradientOverlay: 'from-[#FFF8E7] via-[#FFF3D6]/95 via-40% sm:via-48% to-transparent',
      btnBg: 'bg-gradient-to-br from-[#D98A16] via-[#B87A0D] to-[#8C5503] hover:from-[#E59620] hover:to-[#A36605]',
      btnRing: 'ring-[#E5B842] border-white/90',
      btnColor: 'text-white',
      topIcon: (
        <svg className="w-6 h-6 sm:w-9 sm:h-9 text-[#B5780E] drop-shadow-sm" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 5c-1.8 6-5.5 10.5-10 13 3.5 3 8 5 10 11.5 2-6.5 6.5-8.5 10-11.5-4.5-2.5-8.2-7-10-13z" />
          <path d="M11 18c-4 3.5-8 8.5-6.5 14.5 4.5-1 9-4.5 11-8-2.5-2.5-4-4.5-4.5-6.5z" opacity="0.85" />
          <path d="M37 18c-.5 2-2 4-4.5 6.5 2 3.5 6.5 7 11 8 1.5-6-2.5-11-6.5-14.5z" opacity="0.85" />
          <circle cx="24" cy="35" r="2.8" />
        </svg>
      ),
    },
    sangeet: {
      titleColor: 'text-[#FFF4D0]',
      titleShadow: 'drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]',
      gradientOverlay: 'from-[#170520] via-[#240833]/95 via-40% sm:via-48% to-transparent',
      btnBg: 'bg-gradient-to-br from-[#6C1A58] via-[#4A0E3D] to-[#2E0527] hover:from-[#7E2167] hover:to-[#3D0A32]',
      btnRing: 'ring-[#D4AF37] border-[#FFF4D0]',
      btnColor: 'text-[#FFF4D0]',
      topIcon: (
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-[#F5DE98] text-base sm:text-2xl font-bold tracking-widest drop-shadow">
          <span>♫</span>
          <span className="text-xs sm:text-lg">♪</span>
          <span>♬</span>
        </div>
      ),
    },
    wedding: {
      titleColor: 'text-[#6B091B]',
      titleShadow: 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]',
      gradientOverlay: 'from-[#FFF4F4] via-[#FEEBEB]/95 via-40% sm:via-48% to-transparent',
      btnBg: 'bg-gradient-to-br from-[#96152F] via-[#7B1226] to-[#500816] hover:from-[#A81B38] hover:to-[#630A1C]',
      btnRing: 'ring-[#E5B842] border-white/90',
      btnColor: 'text-white',
      topIcon: (
        <svg className="w-6 h-6 sm:w-9 sm:h-9 text-[#7B1226] drop-shadow-sm" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 8c-2.2 4.5-6.5 7.5-11 8 3.5 3.5 8 4.5 9 9 1-4.5 5.5-5.5 9-9-4.5-.5-8.8-3.5-7-8z" />
          <path d="M13 19c-3.5 2.5-6.5 6.5-5.5 11.5 4-.5 8-3.5 9.5-6-1.5-2-3-3.5-4-5.5z" opacity="0.85" />
          <path d="M35 19c-1 2-2.5 3.5-4 5.5 1.5 2.5 5.5 5.5 9.5 6 1-5-2-9-5.5-11.5z" opacity="0.85" />
          <circle cx="24" cy="32" r="2.5" />
        </svg>
      ),
    },
  };

  const events = weddingConfig.events as unknown as EventItem[];

  return (
    <section id="events" className="relative overflow-hidden px-5 py-12 sm:py-16">
      <SpinningMandala className="-left-24 bottom-6 w-52 sm:w-72" />
      <SpinningMandala reverse className="-right-24 top-8 w-52 sm:w-72" />

      <div className="relative mx-auto max-w-5xl">
        <RevealOnScroll className="text-center">
          <p className="eyebrow flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            The Celebrations
            <Sparkles className="h-3.5 w-3.5 text-gold" />
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl text-foreground">
            Order of events
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Tap any celebration card to view venue details, dress code &amp; directions
          </p>
          <div className="rule-gold mx-auto mt-6 w-28" />
        </RevealOnScroll>

        {/* Event Quick Tabs */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {events.map((ev, idx) => (
            <button
              key={ev.name}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-serif text-xs sm:text-sm tracking-wider uppercase font-semibold transition-all duration-300 ${
                activeIndex === idx
                  ? 'bg-gradient-to-r from-[#8B1E3F] via-[#A82548] to-[#8B1E3F] text-white shadow-[0_4px_16px_rgba(212,175,55,0.4)] border border-[#D4AF37] scale-105 ring-1 ring-gold/40'
                  : 'bg-white/80 dark:bg-black/30 text-foreground/80 hover:text-foreground border border-gold/30 hover:border-gold hover:bg-white'
              }`}
            >
              {ev.name}
            </button>
          ))}
        </div>

        {/* 3D Wheel Carousel Stage */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => {
            setIsPaused(true);
            handleTouchStart(e);
          }}
          onTouchEnd={(e) => {
            setIsPaused(false);
            handleTouchEnd(e);
          }}
          className="relative mt-8 sm:mt-10 h-[300px] xs:h-[330px] sm:h-[440px] md:h-[480px] w-full flex items-center justify-center select-none"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {/* Previous Card Navigation Button */}
          <button
            type="button"
            onClick={prevEvent}
            aria-label="Previous celebration"
            className="absolute left-1 sm:left-2 z-40 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/95 text-[#3A0810] shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-[#D4AF37] backdrop-blur-md transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>

          {/* Next Card Navigation Button */}
          <button
            type="button"
            onClick={nextEvent}
            aria-label="Next celebration"
            className="absolute right-1 sm:right-2 z-40 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/95 text-[#3A0810] shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-[#D4AF37] backdrop-blur-md transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>

          {/* Cards on the 3D Wheel */}
          {events.map((event, idx) => {
            const themeKey = event.id || (idx === 0 ? 'haldi' : idx === 1 ? 'sangeet' : 'wedding');
            const theme = cardThemes[themeKey] || cardThemes.haldi;
            const style = getCardTransform(idx, events.length);
            const isCenter = idx === activeIndex;

            return (
              <div
                key={event.name}
                onClick={() => {
                  if (isCenter) {
                    handleOpenEventModal(event);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                style={{
                  ...style,
                  transition:
                    'transform 0.48s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease, box-shadow 0.45s ease',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className={`group absolute top-1/2 left-1/2 w-[92%] xs:w-[90%] sm:w-[86%] md:w-[88%] max-w-5xl h-[260px] xs:h-[290px] sm:h-[400px] md:h-[440px] overflow-hidden rounded-[24px] sm:rounded-[36px] border-[2.5px] sm:border-[3px] border-[#D4AF37] ring-1 ring-[#FFF2B2]/60 shadow-[0_16px_44px_rgba(212,175,55,0.28)] bg-[#1A050A] cursor-pointer ${
                  isCenter ? 'hover:shadow-[0_24px_60px_rgba(212,175,55,0.45)]' : 'hover:opacity-75'
                }`}
              >
                {/* Dark Base Layer */}
                <div className="absolute inset-0 bg-[#080103] z-0" />

                {/* Full HD Background Image - Darkened with Higher Opacity */}
                <img
                  src={event.image}
                  alt={event.name}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-right sm:object-center opacity-75 sm:opacity-85 brightness-[0.40] contrast-[1.18] transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-95"
                  style={{ imageRendering: 'auto' }}
                />

                {/* Subtle dark vignette overlay to make the image darker and text pop */}
                <div className="absolute inset-0 bg-black/45 pointer-events-none z-[5]" />

                {/* Seamless Linear Gradient matching the background image from left to right */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${theme.gradientOverlay} pointer-events-none z-10 transition-opacity duration-300`}
                />

                {/* Gold Flower Outlines in Empty Spaces (Corners away from text) */}
                <img
                  src="/assets/gold-flower-corner.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-28 xs:w-36 sm:w-60 md:w-68 h-auto opacity-65 sm:opacity-75 group-hover:opacity-90 select-none object-contain rotate-180 z-20 transition-all duration-500 group-hover:scale-105"
                />
                <img
                  src="/assets/gold-flower-corner.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-24 xs:w-32 sm:w-52 md:w-56 h-auto opacity-45 sm:opacity-55 group-hover:opacity-75 select-none object-contain z-20 transition-all duration-500 group-hover:scale-105"
                />

                {/* Inner Golden Outline Frame */}
                <div className="pointer-events-none absolute inset-2 sm:inset-3.5 rounded-[18px] sm:rounded-[30px] border border-[#D4AF37]/50 z-20" />

                {/* Left-Aligned Seamless Text & Action Column */}
                <div className="relative z-30 flex h-full items-center pl-4 xs:pl-6 sm:pl-12 md:pl-16">
                  <div className="flex flex-col items-center justify-center text-center w-[150px] xs:w-[175px] sm:w-[260px] md:w-[290px] transition-transform duration-300 group-hover:scale-[1.02]">
                    {/* Top Traditional Motif Icon */}
                    <div className="mb-0.5 sm:mb-2 transition-transform duration-300 group-hover:scale-110">
                      {theme.topIcon}
                    </div>

                    {/* Traditional Stylish Title */}
                    <h3
                      className={`font-traditional italic font-bold text-3xl xs:text-4xl sm:text-6xl md:text-7xl tracking-tight ${theme.titleColor} ${theme.titleShadow}`}
                    >
                      {event.name}
                    </h3>

                    {/* Traditional Gold Filigree Tilak Flourish in Reverse */}
                    <img
                      src="/assets/gold-flourish.png"
                      alt="Auspicious Tilak Flourish"
                      className="w-24 xs:w-28 sm:w-48 h-auto scale-y-[-1] object-contain drop-shadow-sm my-1 xs:my-1.5 sm:my-2.5 brightness-110"
                    />

                    {/* Modern Golden-Bordered Circular Arrow Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEventModal(event);
                      }}
                      aria-label={`View details for ${event.name}`}
                      className={`group/btn relative mt-1 sm:mt-2 flex h-10 w-10 xs:h-11 xs:w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full ${theme.btnBg} ${theme.btnColor} border-[2px] sm:border-[2.5px] ${theme.btnRing} shadow-[0_4px_16px_rgba(0,0,0,0.28),0_0_12px_rgba(212,175,55,0.4)] ring-2 sm:ring-2 ring-gold/80 transition-all duration-300 group-hover:scale-110 group-hover:ring-4 group-hover:ring-gold/90 group-hover:shadow-[0_6px_22px_rgba(0,0,0,0.35),0_0_24px_rgba(212,175,55,0.7)] active:scale-95`}
                    >
                      {/* Modern Glass Sheen Highlight */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/35 pointer-events-none" />
                      <ArrowRight className="relative z-10 h-5 w-5 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Corner Accent Date Badge - High Visibility Ivory & Gold */}
                <div className="absolute right-2.5 top-2.5 sm:right-5 sm:top-5 z-30 flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/95 px-2.5 py-0.5 sm:px-4 sm:py-2 font-serif text-[8.5px] xs:text-[9.5px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-[#3A0810] font-bold backdrop-blur-md border border-[#D4AF37] sm:border-2 shadow-md">
                  <span className="inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#D4AF37]" />
                  {event.day}
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Wheel Dots & Swipe Hint */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2.5">
            {events.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-[#D4AF37]/35 hover:bg-[#D4AF37]/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <p className="font-serif text-[11px] sm:text-xs tracking-wider text-muted-foreground uppercase opacity-75">
            Swipe or click arrows to spin • Tap card for details
          </p>
        </div>
      </div>

      {/* Pop-up Modal Card with Smooth Card Swipe Entrance Animation */}
      {activeModalEvent && (
        <div
          onClick={() => setActiveModalEvent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleModalTouchStart}
            onTouchEnd={handleModalTouchEnd}
            style={{
              willChange: 'transform, opacity',
            }}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] border-2 border-[#D4AF37] bg-card text-card-foreground shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_40px_rgba(212,175,55,0.3)] animate-card-swipe-in"
          >
            {/* Modal Internal Event Switcher Tabs (Swipe or Tap) */}
            <div className="sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 py-2 bg-black/85 backdrop-blur-md border-b border-[#D4AF37]/35">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {events.map((ev, i) => {
                  const isCurrent = ev.name === activeModalEvent.name;
                  return (
                    <button
                      key={ev.name}
                      type="button"
                      onClick={() => switchModalEvent(i)}
                      className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-serif tracking-wider uppercase transition-all duration-300 font-semibold ${
                        isCurrent
                          ? 'bg-[#D4AF37] text-[#2A0810] shadow-[0_2px_8px_rgba(212,175,55,0.4)] scale-105'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {ev.name}
                    </button>
                  );
                })}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalEvent(null)}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content Container with Internal Swipe Animation */}
            <div
              key={activeModalEvent.name}
              className={`transition-all duration-300 ${
                modalSwipeDirection === 'right'
                  ? 'animate-slide-in-right'
                  : modalSwipeDirection === 'left'
                  ? 'animate-slide-in-left'
                  : ''
              }`}
            >
              {/* Modal Header Banner Image */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <img
                  src={activeModalEvent.image}
                  alt={activeModalEvent.name}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                {/* Left & Right Internal Swipe Arrow Controls */}
                <button
                  type="button"
                  onClick={goToPrevModalEvent}
                  aria-label="Previous celebration"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md border border-white/30 hover:bg-black/80 hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNextModalEvent}
                  aria-label="Next celebration"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md border border-white/30 hover:bg-black/80 hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Title & Tagline in Banner */}
                <div className="absolute bottom-4 left-5 right-5 text-paper">
                  <span className="rounded-full bg-gold/90 px-3 py-0.5 font-serif text-[10px] uppercase tracking-[0.25em] text-[#2A0810] font-semibold">
                    Celebration Details
                  </span>
                  <h3 className="mt-2 font-traditional italic text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                    {activeModalEvent.name}
                  </h3>
                  <p className="mt-1 font-title text-xs sm:text-sm text-paper/85">
                    {activeModalEvent.tagline}
                  </p>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 sm:p-7 space-y-5">
                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-muted/50 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-deep">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date</p>
                      <p className="font-title text-sm font-semibold text-foreground">{activeModalEvent.day}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-muted/50 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-deep">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Time</p>
                      <p className="font-title text-sm font-semibold text-foreground">{activeModalEvent.time}</p>
                    </div>
                  </div>
                </div>

                {/* Venue & Location */}
                <div className="rounded-2xl border border-gold/30 bg-muted/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-deep mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Venue &amp; Location</p>
                      <p className="font-display text-lg font-semibold text-foreground mt-0.5">
                        {activeModalEvent.place}
                      </p>
                      {activeModalEvent.address && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {activeModalEvent.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fun Lines / Celebration Note */}
                <div className="rounded-2xl border border-gold/25 bg-amber-50/40 p-4 text-center">
                  <p className="text-xs italic leading-relaxed text-foreground/90 font-serif">
                    &ldquo;{activeModalEvent.funLines}&rdquo;
                  </p>
                </div>

                {/* Preferred Dress Code */}
                <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-muted/40 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-deep">
                    <Shirt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Preferred Dress Code</p>
                    <p className="font-title text-xs sm:text-sm font-medium text-foreground mt-0.5">
                      {activeModalEvent.dressCode}
                    </p>
                  </div>
                </div>

                {/* Get Directions Button */}
                <a
                  href={activeModalEvent.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8B1E3F] via-[#A82548] to-[#8B1E3F] py-3.5 px-6 font-serif text-xs uppercase tracking-[0.25em] text-white shadow-lg border border-gold/40 transition-all duration-300 hover:from-[#A82548] hover:to-[#B83054] hover:shadow-xl active:scale-[0.98]"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
