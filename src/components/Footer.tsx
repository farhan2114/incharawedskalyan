import React from 'react';
import { weddingData } from '../data/weddingData';

export const Footer: React.FC = () => {
  const query = `${weddingData.venue} ${weddingData.city}`;
  const mapsSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

  return (
    <footer className="border-t border-gold/30 px-5 py-16 text-center">
      <p className="flex flex-wrap items-center justify-center gap-x-2 font-display text-2xl min-[360px]:text-3xl sm:text-4xl text-gold-foil animate-foil break-words">
        <span>{weddingData.bride}</span>
        <span className="font-title text-base sm:text-2xl text-maroon">&amp;</span>
        <span>{weddingData.groom}</span>
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        {weddingData.dateLabel} · {weddingData.venue}, {weddingData.city}
      </p>
      <a
        className="mt-8 inline-block border border-gold/60 px-7 py-3 text-[0.7rem] uppercase tracking-[0.3em] text-gold-deep transition-colors hover:bg-gold/10"
        href={mapsSearchUrl}
        target="_blank"
        rel="noreferrer"
      >
        Open venue in maps
      </a>
    </footer>
  );
};
