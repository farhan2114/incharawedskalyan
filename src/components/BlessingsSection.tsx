import React, { useState, useEffect } from 'react';
import { Ornament, SpinningMandala } from './Ornaments';
import { RevealOnScroll } from './RevealOnScroll';
import { fetchBlessings, addBlessing, BlessingItem } from '../lib/supabase';

const BlessingStack: React.FC<{ items: BlessingItem[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="paper-card flex min-h-56 items-center justify-center p-6 text-center">
        <p className="font-display text-2xl text-muted-foreground">Be the first to bless the couple.</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-64 max-w-md sm:h-60">
      {items.map((item, idx) => {
        const offset = (idx - currentIndex + items.length) % items.length;
        if (offset > 2) return null;

        return (
          <article
            key={item.id}
            className="paper-card absolute inset-x-0 top-0 px-7 py-8 text-center transition-all duration-700 ease-out"
            style={{
              transform: `translateY(${offset * 14}px) scale(${1 - offset * 0.05}) rotate(${
                offset === 0 ? 0 : offset % 2 === 0 ? 1.4 : -1.4
              }deg)`,
              opacity: offset === 0 ? 1 : 0.55 - offset * 0.15,
              zIndex: 10 - offset,
            }}
          >
            <span className="eyebrow">Blessing</span>
            <p className="mt-5 font-display text-2xl leading-snug sm:text-[1.7rem]">“{item.message}”</p>
            <div className="rule-gold mx-auto mt-6 w-24" />
            <p className="mt-4 font-title text-sm tracking-widest uppercase text-gold-deep">
              {item.name}
              {item.city ? ` · ${item.city}` : ''}
            </p>
          </article>
        );
      })}
    </div>
  );
};

export const BlessingsSection: React.FC = () => {
  const [items, setItems] = useState<BlessingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    const list = await fetchBlessings();
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setFeedback('Please add your name and a blessing.');
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      await addBlessing(name, city, message);
      setName('');
      setCity('');
      setMessage('');
      setFeedback('Your blessing has been added to the cards.');
      await loadData();
    } catch (_) {
      setFeedback("That didn't go through. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full border-b border-gold/40 bg-transparent px-1 py-3 font-sans text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-gold';

  return (
    <section id="blessings" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <SpinningMandala className="-right-20 top-1/2 w-48 sm:w-64" />
      <Ornament variant="gold" className="-left-8 top-14 w-36 rotate-6 sm:w-48" />
      <Ornament variant="leaf" className="-right-10 bottom-10 w-36 -rotate-6 sm:w-52" />

      <div className="relative mx-auto max-w-5xl">
        <RevealOnScroll className="text-center">
          <p className="eyebrow">Aashirvadam</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">Bless the couple</h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Leave a few words for them. Every blessing is printed onto a card and shown here for all the guests to
            read.
          </p>
        </RevealOnScroll>

        <div className="mt-16 grid gap-16 md:grid-cols-2 md:items-start md:gap-12">
          <RevealOnScroll>
            <form className="paper-card px-7 py-9 sm:px-9" onSubmit={handleSubmit}>
              <input
                className={inputClass}
                placeholder="Your name"
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={`${inputClass} mt-6`}
                placeholder="Where you're writing from (optional)"
                maxLength={60}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <textarea
                className={`${inputClass} mt-6 resize-none`}
                placeholder="Your blessing for Aarthi & Nikhil"
                rows={4}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-9 w-full border border-gold/60 py-4 text-[0.7rem] uppercase tracking-[0.3em] text-gold-deep transition-colors hover:bg-gold/10 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send blessing'}
              </button>
              {feedback && (
                <p className="mt-4 text-center font-title text-xs tracking-wider text-maroon">{feedback}</p>
              )}
            </form>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            {loading ? (
              <div className="paper-card flex min-h-56 items-center justify-center">
                <p className="eyebrow">Gathering blessings</p>
              </div>
            ) : (
              <BlessingStack items={items} />
            )}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};
