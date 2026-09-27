import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assets } from '../data/assets';
import { weddingData } from '../data/weddingData';
import { SpinningMandala } from './Ornaments';
import { RevealOnScroll } from './RevealOnScroll';

gsap.registerPlugin(ScrollTrigger);

export const EventsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>('.event-card'));

    const ctx = gsap.context(() => {
      cards.forEach((card, idx) => {
        const nextCard = cards[idx + 1];
        if (nextCard) {
          gsap.to(card, {
            scale: 0.94,
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 75%',
              end: 'top 18%',
              scrub: true,
            },
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="events" className="relative overflow-clip px-5 py-12 sm:py-16">
      <SpinningMandala className="-left-24 bottom-8 w-52 sm:w-72" />
      <img
        src={assets.mandalaGold}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1024}
        height={1024}
        className="pointer-events-none absolute -right-24 top-10 w-72 opacity-25 animate-float-slow"
      />

      <div className="mx-auto max-w-5xl">
        <RevealOnScroll className="text-center">
          <p className="eyebrow">The celebrations</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">Order of events</h2>
        </RevealOnScroll>

        <div className="relative mt-10 pb-2">
          {weddingData.events.slice(0, 3).map((event, idx) => (
            <div
              key={event.name}
              className="event-card sticky top-[12vh] mb-[3vh] origin-top will-change-transform"
              style={{ zIndex: idx + 1 }}
            >
              <article className="paper-card relative mx-auto min-h-[34vh] max-w-3xl overflow-hidden px-6 py-8 text-center sm:min-h-[38vh] sm:px-14 sm:py-10">
                <span className="absolute left-6 top-5 font-display text-7xl text-gold/15 sm:text-9xl">
                  0{idx + 1}
                </span>
                <p className="eyebrow">{event.day}</p>
                <h3 className="mt-5 font-display text-3xl sm:text-5xl">{event.name}</h3>
                <div className="rule-gold mx-auto mt-5 w-24" />
                <p className="mt-5 font-title text-lg sm:text-xl">{event.time}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{event.place}</p>
                <p className="mx-auto mt-5 max-w-md text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {event.note}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
