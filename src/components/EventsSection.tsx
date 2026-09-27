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
      titleColor: string;
      btnBg: string;
      btnRing: string;
      btnColor: string;
      topIcon: React.ReactNode;
    }
  > = {
    haldi: {
      titleColor: 'text-[#613D00]',
      btnBg: 'bg-[#C4820E] hover:bg-[#AA6D08]',
      btnRing: 'ring-[#B87A0D] border-[#FFF3BD]',
      btnColor: 'text-white',
      topIcon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9 text-[#C4820E] drop-shadow-sm" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 5c-1.8 6-5.5 10.5-10 13 3.5 3 8 5 10 11.5 2-6.5 6.5-8.5 10-11.5-4.5-2.5-8.2-7-10-13z" />
          <path d="M11 18c-4 3.5-8 8.5-6.5 14.5 4.5-1 9-4.5 11-8-2.5-2.5-4-4.5-4.5-6.5z" opacity="0.85" />
          <path d="M37 18c-.5 2-2 4-4.5 6.5 2 3.5 6.5 7 11 8 1.5-6-2.5-11-6.5-14.5z" opacity="0.85" />
          <circle cx="24" cy="35" r="2.8" />
        </svg>
      ),
    },
    sangeet: {
      titleColor: 'text-[#2D0D3B]',
      btnBg: 'bg-[#521343] hover:bg-[#6C1A58]',
      btnRing: 'ring-[#521343] border-[#FCE7F3]',
      btnColor: 'text-[#FBF5D4]',
      topIcon: (
        <div className="flex items-center gap-1.5 text-[#521343] text-xl sm:text-2xl font-bold tracking-widest drop-shadow-sm">
          <span>♫</span>
          <span className="text-base sm:text-lg">♪</span>
          <span>♬</span>
        </div>
      ),
    },
    wedding: {
      titleColor: 'text-[#680C1D]',
      btnBg: 'bg-[#7B1226] hover:bg-[#96152F]',
      btnRing: 'ring-[#7B1226] border-[#FFE4E8]',
      btnColor: 'text-white',
      topIcon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9 text-[#7B1226] drop-shadow-sm" viewBox="0 0 48 48" fill="currentColor">
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

        {/* 3 High-Impact Spacious Cards with Crisp Full-HD Images & Tilak Flourish */}
        <div className="mt-12 space-y-7 sm:space-y-10">
          {events.map((event, idx) => {
            const themeKey = event.id || (idx === 0 ? 'haldi' : idx === 1 ? 'sangeet' : 'wedding');
            const theme = cardThemes[themeKey] || cardThemes.haldi;

            return (
              <RevealOnScroll key={event.name} delay={idx * 0.1}>
                <div
                  onClick={() => setActiveModalEvent(event)}
                  className="group relative h-[300px] sm:h-[360px] md:h-[390px] w-full overflow-hidden rounded-[28px] sm:rounded-[36px] border-[3px] border-[#D4AF37] ring-1 ring-[#FFF2B2]/60 shadow-[0_14px_40px_rgba(212,175,55,0.22)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(212,175,55,0.32)] cursor-pointer"
                >
                  {/* Full HD Pristine Background Image (No color wash, full saturation & clarity) */}
                  <img
                    src={event.image}
                    alt={event.name}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ imageRendering: 'auto' }}
                  />

                  {/* Inner Golden Outline Frame */}
                  <div className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-[22px] sm:rounded-[30px] border border-[#D4AF37]/50 z-10" />

                  {/* Translucent Soft White Card Pod on Left with Auspicious Gold Mandala Outline */}
                  <div className="relative z-20 flex h-full items-center p-3.5 sm:p-7 md:p-10">
                    <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-[24px] sm:rounded-[30px] bg-white/92 sm:bg-white/88 backdrop-blur-lg border-2 border-white/95 px-6 py-6 sm:px-10 sm:py-8 text-center shadow-[0_12px_36px_rgba(0,0,0,0.18)] max-w-[270px] sm:max-w-[330px] md:max-w-[360px] w-full transition-transform duration-300 group-hover:scale-[1.02]">
                      {/* Auspicious Cut Gold Mandala along Top Border (Stationary Arch) */}
                      <img
                        src="/assets/gold-mandala-arch-down.png"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 w-44 sm:w-52 h-auto opacity-45 select-none object-contain drop-shadow-sm"
                      />

                      {/* Auspicious Cut Gold Mandala along Bottom Border (Stationary Arch) */}
                      <img
                        src="/assets/gold-mandala-half.png"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-44 sm:w-52 h-auto opacity-45 select-none object-contain drop-shadow-sm"
                      />

                      {/* Top Traditional Motif Icon */}
                      <div className="relative z-10 mb-1.5 sm:mb-2 transition-transform duration-300 group-hover:scale-110">
                        {theme.topIcon}
                      </div>

                      {/* Traditional Stylish Title */}
                      <h3
                        className={`relative z-10 font-traditional italic font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight ${theme.titleColor} drop-shadow-sm`}
                      >
                        {event.name}
                      </h3>

                      {/* Traditional Gold Filigree Tilak Flourish in Reverse */}
                      <img
                        src="/assets/gold-flourish.png"
                        alt="Auspicious Tilak Flourish"
                        className="relative z-10 w-36 sm:w-48 h-auto scale-y-[-1] object-contain drop-shadow-sm my-2 sm:my-2.5"
                      />

                      {/* Golden-Bordered Circular Arrow Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalEvent(event);
                        }}
                        aria-label={`View details for ${event.name}`}
                        className={`relative z-10 mt-1 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full ${theme.btnBg} ${theme.btnColor} border-[2.5px] ${theme.btnRing} shadow-[0_4px_16px_rgba(0,0,0,0.25)] ring-2 ring-gold/70 transition-all duration-300 group-hover:scale-110 group-hover:ring-4 group-hover:ring-gold active:scale-95`}
                      >
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Corner Accent Date Badge - High Visibility Ivory & Gold */}
                  <div className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 z-20 flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 sm:px-4 sm:py-2 font-serif text-[11px] sm:text-xs uppercase tracking-widest text-[#3A0810] font-bold backdrop-blur-md border-2 border-[#D4AF37] shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
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
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] border-2 border-[#D4AF37] bg-card text-card-foreground shadow-2xl transition-all duration-300 animate-scale-up"
          >
            {/* Modal Header Banner Image */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden">
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
      )}
    </section>
  );
};
