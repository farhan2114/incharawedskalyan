import React from 'react';
import { assets } from '../data/assets';
import { weddingData } from '../data/weddingData';
import { Ornament, SpinningMandala } from './Ornaments';
import { RevealOnScroll } from './RevealOnScroll';

const storyImages = [
  assets.storyTrain,
  assets.storyLetters,
  assets.storyTerrace,
  assets.hands,
];

const storyAlts = [
  'Two cups of coffee beside a train window',
  'Handwritten letters tied with a maroon ribbon',
  'A jasmine-decorated terrace at dusk',
  'Traditional wedding details',
];

export const StorySection: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:py-24">
      <SpinningMandala reverse className="-right-24 top-1/3 w-56 sm:w-80" />
      <Ornament variant="leaf" className="-right-10 top-10 w-40 sm:w-56" />
      <Ornament variant="small" className="-left-6 bottom-16 w-28 rotate-12 sm:w-40" />

      <div className="relative mx-auto max-w-4xl">
        <RevealOnScroll className="text-center">
          <p className="eyebrow">Our story</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">How it happened</h2>
        </RevealOnScroll>

        <div className="mt-12 space-y-14 sm:space-y-16">
          {weddingData.story.map((item, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <RevealOnScroll key={item.year} delay={idx * 0.05}>
                <article className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
                  <div className={`relative ${isReversed ? 'md:order-2' : ''}`}>
                    <div className="absolute -inset-3 border border-gold/25" />
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={(item as any).image || storyImages[idx]}
                        alt={(item as any).alt || storyAlts[idx]}
                        loading="lazy"
                        width={900}
                        height={1100}
                        className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className={isReversed ? 'md:order-1 md:text-right' : ''}>
                    <p className="font-title text-sm tracking-[0.3em] text-gold-deep">{item.year}</p>
                    <h3 className="mt-3 font-display text-3xl sm:text-4xl">{item.title}</h3>
                    <div className={`rule-gold mt-4 w-24 ${isReversed ? 'md:ml-auto' : ''}`} />
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};
