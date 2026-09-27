import React from 'react';
import { assets } from '../data/assets';
import { weddingConfig } from '../wedding.config';
import { Ornament, SpinningMandala } from './Ornaments';
import { RevealOnScroll } from './RevealOnScroll';

export const GallerySection: React.FC = () => {
  return (
    <section id="gallery" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <SpinningMandala reverse className="-right-20 top-1/3 w-48 sm:w-64" />
      <Ornament className="-left-10 top-16 w-40 rotate-12 sm:w-56" />
      <Ornament variant="small" className="-right-6 bottom-10 w-28 -rotate-12 sm:w-40" />
      <Ornament variant="gold" className="right-4 top-6 w-24 rotate-6 sm:w-36" />

      <div className="relative mx-auto max-w-5xl">
        <RevealOnScroll className="text-center">
          <p className="eyebrow">Moments</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">Our gallery</h2>
          <div className="rule-gold mx-auto mt-8 w-32" />
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="sm:row-span-2">
            <figure className="group relative h-full overflow-hidden border border-gold/30 bg-muted">
              <img
                src={weddingConfig.gallery[0]?.image || assets.gallery1}
                alt={weddingConfig.gallery[0]?.alt || "Gallery image 1"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-3 border border-paper/25" />
            </figure>
          </div>
          <div>
            <figure className="group relative h-full overflow-hidden border border-gold/30 bg-muted">
              <img
                src={weddingConfig.gallery[1]?.image || assets.gallery2}
                alt={weddingConfig.gallery[1]?.alt || "Gallery image 2"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-3 border border-paper/25" />
            </figure>
          </div>
          <div>
            <figure className="group relative h-full overflow-hidden border border-gold/30 bg-muted">
              <img
                src={weddingConfig.gallery[2]?.image || assets.gallery3}
                alt={weddingConfig.gallery[2]?.alt || "Gallery image 3"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-3 border border-paper/25" />
            </figure>
          </div>
          <div className="sm:col-span-2">
            <figure className="group relative h-full overflow-hidden border border-gold/30 bg-muted">
              <img
                src={weddingConfig.gallery[3]?.image || assets.gallery4}
                alt={weddingConfig.gallery[3]?.alt || "Gallery image 4"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-3 border border-paper/25" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
