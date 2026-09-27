import React from 'react';
import { weddingConfig, weddingData } from '../wedding.config';
import { Ornament, SpinningMandala } from './Ornaments';
import { RevealOnScroll } from './RevealOnScroll';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-5 py-24 text-center sm:py-32">
      <SpinningMandala className="-left-20 top-1/2 w-52 -translate-y-1/2 sm:w-72" />
      <Ornament variant="gold" className="-left-6 top-8 w-32 rotate-12 sm:w-44" />
      <Ornament variant="gold" className="-right-6 bottom-8 w-32 -rotate-12 sm:w-44" />

      <RevealOnScroll>
        <p className="eyebrow">{weddingConfig.invitation.sanskritMantra || 'Om Sri Ganeshaya Namaha'}</p>
        <p className="mx-auto mt-8 max-w-2xl whitespace-pre-line font-display text-3xl leading-snug sm:text-5xl">
          {weddingData.familyLine}
        </p>
        <div className="rule-gold mx-auto mt-10 w-40" />
        <p className="mt-6 font-title tracking-[0.25em] uppercase text-sm text-gold-deep">
          {weddingData.hashtag}
        </p>
      </RevealOnScroll>
    </section>
  );
};
