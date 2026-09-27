import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { weddingConfig } from '../wedding.config';
import { SpinningMandala, Ornament } from './Ornaments';
import { RevealOnScroll } from './RevealOnScroll';
import { Sparkles, RotateCcw } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const ScratchCountdownSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerCardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [scratchProgress, setScratchProgress] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCounterRef = useRef<number>(0);
  const lastCheckTimeRef = useRef<number>(0);

  // 1. Live Countdown ticker to the wedding date
  useEffect(() => {
    const targetIso = (weddingConfig.date as any).targetIso || '2026-10-30T10:00:00+05:30';
    const targetTime = new Date(targetIso).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Confetti specifically bursting from the CENTER of the timer
  const triggerCenterConfetti = useCallback(() => {
    if (!timerCardRef.current) return;
    const rect = timerCardRef.current.getBoundingClientRect();

    // Exact center coordinates in normalized 0..1 viewport space
    const centerX = (rect.left + rect.width / 2) / window.innerWidth;
    const centerY = (rect.top + rect.height / 2) / window.innerHeight;

    // Burst 1: Radial 360-degree explosive burst from timer center
    confetti({
      particleCount: 130,
      spread: 360,
      startVelocity: 38,
      ticks: 240,
      gravity: 0.75,
      origin: { x: centerX, y: centerY },
      colors: ['#D4AF37', '#FFDF00', '#F3E5AB', '#7B1113', '#E6C280', '#FFFFFF', '#C5A059'],
      shapes: ['circle', 'square'],
      scalar: 1.1,
      zIndex: 99999,
      disableForReducedMotion: true,
    });

    // Burst 2: Concentric sparkle ring 200ms later from center
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 360,
        startVelocity: 24,
        ticks: 180,
        gravity: 0.9,
        origin: { x: centerX, y: centerY },
        colors: ['#FFDF73', '#FFD700', '#FAF7F2', '#D4AF37'],
        scalar: 0.9,
        zIndex: 99999,
        disableForReducedMotion: true,
      });
    }, 200);
  }, []);

  // 3. Initialize / Paint the Scratch Card Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const timerCard = timerCardRef.current;
    if (!canvas || !timerCard) return;

    const rect = timerCard.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(rect.width, 300);
    const height = Math.max(rect.height, 180);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Luxurious gold shimmer gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#7A1828');     // Royal maroon corner
    grad.addColorStop(0.25, '#B38728');  // Rich gold
    grad.addColorStop(0.5, '#FBF5B7');   // Shimmering light gold highlight
    grad.addColorStop(0.75, '#DAA520');  // Warm metallic gold
    grad.addColorStop(1, '#66101F');     // Deep royal maroon edge

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Ornate inner gold frame border
    ctx.strokeStyle = 'rgba(255, 240, 180, 0.75)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.strokeStyle = 'rgba(122, 24, 40, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Subtle decorative stars/sparkles pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    const sparkleCoords = [
      [30, 30], [width - 30, 30], [30, height - 30], [width - 30, height - 30],
      [width * 0.25, 25], [width * 0.75, 25], [width * 0.25, height - 25], [width * 0.75, height - 25],
    ];
    sparkleCoords.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Centered Scratch Call-to-Action Text
    const centerY = height / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(102, 16, 31, 0.9)';
    ctx.fillText('✨  SCRATCH TO REVEAL  ✨', width / 2, centerY - 20);

    // Big Heading
    ctx.font = '600 20px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#2A0810';
    ctx.fillText('The Countdown to Forever', width / 2, centerY + 8);

    // Instruction subtitle
    ctx.font = 'italic 12px "Karla", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(60, 10, 18, 0.75)';
    ctx.fillText('Drag or swipe with finger / mouse', width / 2, centerY + 32);

    setIsRevealed(false);
    setScratchProgress(0);
    lastPointRef.current = null;
    strokeCounterRef.current = 0;
  }, []);

  useEffect(() => {
    const timer = setTimeout(initCanvas, 150);
    window.addEventListener('resize', initCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initCanvas);
    };
  }, [initCanvas]);

  // Calculate percentage of canvas cleared
  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const sampleCols = 24;
    const sampleRows = 16;
    const stepX = canvas.width / sampleCols;
    const stepY = canvas.height / sampleRows;

    let transparentCount = 0;
    const totalSamples = sampleCols * sampleRows;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let r = 0; r < sampleRows; r++) {
      for (let c = 0; c < sampleCols; c++) {
        const x = Math.floor(c * stepX);
        const y = Math.floor(r * stepY);
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        if (alpha < 128) {
          transparentCount++;
        }
      }
    }

    const pct = Math.round((transparentCount / totalSamples) * 100);
    setScratchProgress(pct);

    if (pct >= 28 && !isRevealed) {
      setIsRevealed(true);
      triggerCenterConfetti();
    }
  };

  // Ultra-Smooth Scratch Drawing Function with Continuous Interpolation
  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const currentX = (clientX - rect.left) * dpr;
    const currentY = (clientY - rect.top) * dpr;
    const brushRadius = 32 * dpr;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = brushRadius * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPointRef.current) {
      const prevX = lastPointRef.current.x;
      const prevY = lastPointRef.current.y;
      const dist = Math.hypot(currentX - prevX, currentY - prevY);

      // Fine-grained interpolation so rapid swiping produces a seamless ribbon
      const step = 4 * dpr;
      if (dist > step) {
        const steps = Math.ceil(dist / step);
        for (let i = 1; i <= steps; i++) {
          const ix = prevX + ((currentX - prevX) * i) / steps;
          const iy = prevY + ((currentY - prevY) * i) / steps;
          ctx.beginPath();
          ctx.arc(ix, iy, brushRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(currentX, currentY, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x: currentX, y: currentY };

    // Throttle percentage checks to once every 320ms to keep 60fps/120fps fluid response
    const now = performance.now();
    if (now - lastCheckTimeRef.current > 320) {
      lastCheckTimeRef.current = now;
      checkScratchPercentage();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsScratching(true);
    lastPointRef.current = null;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching || isRevealed) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    setIsScratching(false);
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    handlePointerUp(e);
  };

  const handleManualReveal = () => {
    setIsRevealed(true);
    setScratchProgress(100);
    triggerCenterConfetti();
  };

  const handleReset = () => {
    initCanvas();
  };

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section
      ref={containerRef}
      id="countdown"
      className="relative overflow-hidden px-5 py-10 sm:py-14 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/60 via-background to-background"
    >
      <SpinningMandala reverse className="-left-20 top-1/4 w-44 sm:w-60" />
      <Ornament variant="gold" className="-right-10 top-12 w-28 rotate-12 sm:w-40" />
      <Ornament variant="small" className="left-8 bottom-6 w-24 -rotate-6 sm:w-36" />

      <div className="relative mx-auto max-w-4xl">
        <RevealOnScroll className="text-center">
          <p className="eyebrow flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            The Auspicious Moment
            <Sparkles className="h-3.5 w-3.5 text-gold" />
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl text-foreground">
            Countdown to forever
          </h2>
          <p className="mt-3 font-title text-base sm:text-lg text-muted-foreground">
            {weddingConfig.date.label} &bull; {weddingConfig.date.muhurtham}
          </p>
          <div className="rule-gold mx-auto mt-6 w-28" />
        </RevealOnScroll>

        <div className="relative mx-auto mt-8 max-w-2xl">
          <div
            ref={timerCardRef}
            className="paper-card relative overflow-hidden rounded-2xl border border-gold/40 bg-card/95 p-6 shadow-2xl backdrop-blur-sm sm:p-10"
          >
            <div className="grid grid-cols-4 gap-2.5 sm:gap-6 text-center">
              {timeUnits.map((unit) => (
                <div
                  key={unit.label}
                  className="group relative flex flex-col items-center justify-center rounded-xl border border-gold/25 bg-background/80 px-2 py-4 shadow-sm transition-all duration-300 hover:border-gold/50 hover:shadow-md sm:px-4 sm:py-6"
                >
                  <span className="font-display text-3xl font-bold tracking-tight text-gold tabular-nums transition-transform duration-300 group-hover:scale-105 sm:text-5xl md:text-6xl">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="mt-2 text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground sm:text-xs">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center border-t border-gold/20 pt-6">
              <p className="font-title text-sm tracking-wide text-foreground/80 sm:text-base">
                {weddingConfig.venue.name} &bull; {weddingConfig.venue.city}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Join Sri Naveen Kumar, Sri Devireddy Gangireddy & families in celebrating Inchara & Kalyan
              </p>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{ touchAction: 'none' }}
            className={`absolute inset-0 z-20 cursor-grab rounded-2xl touch-none select-none transition-opacity duration-700 active:cursor-grabbing ${
              isRevealed ? 'pointer-events-none opacity-0' : 'opacity-100 shadow-xl'
            }`}
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-muted-foreground">
            {!isRevealed ? (
              <>
                <span className="flex items-center gap-1.5 font-medium text-gold">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  Scratch card above with finger or mouse ({scratchProgress}% revealed)
                </span>
                <button
                  type="button"
                  onClick={handleManualReveal}
                  className="rounded-full border border-gold/40 px-3 py-1 font-serif text-[11px] uppercase tracking-wider text-foreground hover:bg-gold/10 transition-colors"
                >
                  Reveal Instantly
                </button>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5 font-medium text-gold">
                  ✨ Countdown revealed!
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1 font-serif text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-gold/10 hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Scratch Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
