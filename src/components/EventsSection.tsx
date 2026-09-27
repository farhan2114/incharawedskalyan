import React, { useState, useEffect } from 'react';
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

export const EventsSection: React.FC = () => {
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);

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
      gradient: string;
      titleColor: string;
      dividerColor: string;
      btnBg: string;
      btnColor: string;
      btnBorder?: string;
      badgeBg: string;
      badgeText: string;
      icon: React.ReactNode;
    }
  > = {
    haldi: {
      gradient:
        'bg-gradient-to-r from-[#FFF6DF] via-[#FFF1CC]/95 via-45% sm:via-42% to-transparent',
      titleColor: 'text-[#6D4708]',
      dividerColor: 'text-[#D08B16]',
      btnBg: 'bg-[#C4820E] hover:bg-[#AB6E08]',
      btnColor: 'text-white',
      badgeBg: 'bg-amber-100/90 border-amber-300',
      badgeText: 'text-amber-900',
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#C4820E]" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 6c-1.5 5.5-5 9.5-9 12 3 2.5 7 4.5 9 10 2-5.5 6-7.5 9-10-4-2.5-7.5-6.5-9-12z" />
          <path d="M12 18c-3.5 3-7 7.5-6 13 4-1 8-4 10-7-2-2-3.5-4-4-6z" opacity="0.8" />
          <path d="M36 18c-.5 2-2 4-4 6 2 3 6 6 10 7 1-5.5-2.5-10-6-13z" opacity="0.8" />
          <circle cx="24" cy="34" r="2.5" />
        </svg>
      ),
    },
    sangeet: {
      gradient:
        'bg-gradient-to-r from-[#170826] via-[#240C3B]/95 via-48% sm:via-45% to-transparent',
      titleColor: 'text-[#FBF5D4]',
      dividerColor: 'text-[#C99E32]',
      btnBg: 'bg-[#4E143E] hover:bg-[#681953]',
      btnColor: 'text-[#FBF5D4]',
      btnBorder: 'border border-gold/40',
      badgeBg: 'bg-purple-950/90 border-purple-700/50',
      badgeText: 'text-purple-200',
      icon: (
        <div className="flex items-center gap-1.5 text-gold text-lg sm:text-xl font-bold tracking-widest opacity-95">
          <span>♫</span>
          <span className="text-sm">♪</span>
          <span>♬</span>
        </div>
      ),
    },
    wedding: {
      gradient:
        'bg-gradient-to-r from-[#FFF0F3] via-[#FFE3E8]/95 via-45% sm:via-42% to-transparent',
      titleColor: 'text-[#7B1226]',
      dividerColor: 'text-[#B82B46]',
      btnBg: 'bg-[#7B1226] hover:bg-[#96152F]',
      btnColor: 'text-white',
      badgeBg: 'bg-rose-100/90 border-rose-300',
      badgeText: 'text-rose-950',
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#7B1226]" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 10c-2 4-6 6.5-10 7 3 3 7 4 8 8 1-4 5-5 8-8-4-.5-8-3-6-7z" />
          <path d="M14 20c-3 2-6 5.5-5 10 3.5-.5 7-3 8.5-5.5-1.5-1.5-2.5-3-3.5-4.5z" opacity="0.8" />
          <path d="M34 20c-1 1.5-2 3-3.5 4.5 1.5 2.5 5 5 8.5 5.5 1-4.5-2-8-5-10z" opacity="0.8" />
          <circle cx="24" cy="30" r="2" />
        </svg>
      ),
    },
  };

  const events = weddingConfig.events as unknown as EventItem[];

  return (
    <section id="events" className="relative overflow-hidden px-5 py-12 sm:py-16">
      <SpinningMandala className="-left-24 bottom-6 w-52 sm:w-72" />
      <SpinningMandala reverse className="-right-24 top-8 w-52 sm:w-72" />

      <div className="relative mx-auto max-w-4xl">
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

        {/* 3 Separate Stacked Horizontal Event Cards matching Reference Image */}
        <div className="mt-12 space-y-6 sm:space-y-8">
          {events.map((event, idx) => {
            const themeKey = event.id || (idx === 0 ? 'haldi' : idx === 1 ? 'sangeet' : 'wedding');
            const theme = cardThemes[themeKey] || cardThemes.haldi;

            return (
              <RevealOnScroll key={event.name} delay={idx * 0.1}>
                <div
                  onClick={() => setActiveModalEvent(event)}
                  className="group relative h-[210px] sm:h-[260px] md:h-[275px] w-full overflow-hidden rounded-[26px] sm:rounded-[32px] border-2 border-gold/70 shadow-[0_12px_36px_rgba(0,0,0,0.14)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)] cursor-pointer"
                >
                  {/* High-Resolution Background Image */}
                  <img
                    src={event.image}
                    alt={event.name}
                    loading="eager"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ imageRendering: 'auto' }}
                  />

                  {/* Left-to-Right Matching Color Linear Gradient */}
                  <div className={`absolute inset-0 ${theme.gradient} transition-opacity duration-300`} />

                  {/* Inner Royal Border Outline Frame */}
                  <div className="pointer-events-none absolute inset-2.5 sm:inset-3 rounded-[20px] sm:rounded-[25px] border border-white/30 z-10" />

                  {/* Left Side Content Column */}
                  <div className="relative z-20 flex h-full w-[60%] sm:w-[48%] md:w-[44%] flex-col items-center justify-center px-4 sm:px-8 text-center">
                    {/* Top Ornate Motif Icon */}
                    <div className="mb-2 sm:mb-2.5 transition-transform duration-300 group-hover:scale-110">
                      {theme.icon}
                    </div>

                    {/* Ornate Event Name */}
                    <h3
                      className={`font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight ${theme.titleColor} drop-shadow-sm`}
                    >
                      {event.name}
                    </h3>

                    {/* Ornate Flourish Divider */}
                    <div className="my-3 sm:my-3.5 flex items-center justify-center gap-1.5 opacity-80">
                      <span className="h-[1px] w-6 sm:w-10 bg-current opacity-40" />
                      <span className="text-xs sm:text-sm">❦</span>
                      <span className="h-[1px] w-6 sm:w-10 bg-current opacity-40" />
                    </div>

                    {/* Circular Arrow Button with Pop-up Trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalEvent(event);
                      }}
                      aria-label={`View details for ${event.name}`}
                      className={`flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full ${theme.btnBg} ${theme.btnColor} ${
                        theme.btnBorder || ''
                      } shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl active:scale-95`}
                    >
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  {/* Corner Accent Date Badge */}
                  <div className="absolute right-4 top-4 z-20 hidden sm:block rounded-full bg-black/45 px-3 py-1 font-serif text-[11px] uppercase tracking-wider text-paper/90 backdrop-blur-md border border-white/20">
                    {event.day}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      {/* Pop-up Modal Card with Full Event Details & Directions */}
      {activeModalEvent && (
        <div
          onClick={() => setActiveModalEvent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] border-2 border-gold/70 bg-card text-card-foreground shadow-2xl transition-all duration-300 animate-scale-up"
          >
            {/* Modal Header Banner Image */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden">
              <img
                src={activeModalEvent.image}
                alt={activeModalEvent.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalEvent(null)}
                aria-label="Close modal"
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-black/80 hover:scale-105 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title & Tagline in Banner */}
              <div className="absolute bottom-4 left-5 right-5 text-paper">
                <span className="rounded-full bg-gold/90 px-3 py-0.5 font-serif text-[10px] uppercase tracking-[0.25em] text-[#2A0810] font-semibold">
                  Celebration Details
                </span>
                <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8B1E3F] via-[#A82548] to-[#8B1E3F] py-3.5 px-6 font-serif text-xs uppercase tracking-[0.25em] text-white shadow-lg transition-all duration-300 hover:from-[#A82548] hover:to-[#B83054] hover:shadow-xl active:scale-[0.98]"
              >
                <Navigation className="h-4 w-4" />
                Get Directions on Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
