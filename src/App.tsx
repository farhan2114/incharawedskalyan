import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { MeetCoupleSection } from './components/MeetCoupleSection';
import { GallerySection } from './components/GallerySection';
import { ParallaxSection } from './components/ParallaxSection';
import { StorySection } from './components/StorySection';
import { EventsSection } from './components/EventsSection';
import { VenueSection } from './components/VenueSection';
import { BlessingsSection } from './components/BlessingsSection';
import { GratitudeSection } from './components/GratitudeSection';
import { Footer } from './components/Footer';
import { MusicButton } from './components/MusicButton';

export const App: React.FC = () => {
  // Smooth scroll initialization with Lenis
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <HeroSection />
      <IntroSection />
      <MeetCoupleSection />
      <GallerySection />
      <ParallaxSection />
      <StorySection />
      <EventsSection />
      <VenueSection />
      <BlessingsSection />
      <GratitudeSection />
      <Footer />
      <MusicButton />
    </main>
  );
};
