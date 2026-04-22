'use client';

import { useState } from 'react';


const DEFAULTS = [
  '/images/offers/offer_4.jpg',
  '/images/offers/offer_3.jpg',
  '/images/offers/offer_2.jpg',
  '/images/offers/offer_1.jpg',
];

interface Props {
  live: (string | null)[];
}

export default function Offers({ live }: Props) {
  const slides = DEFAULTS.map((def, i) =>
    live[i] ? `/uploads/${live[i]}` : def
  );

  const [current, setCurrent] = useState(0);

  const go = (dir: 1 | -1) =>
    setCurrent(c => (c + dir + slides.length) % slides.length);


  return (
    <section className="w-full bg-white py-2">
      <div className="relative w-full overflow-hidden select-none">

        {/* ── Slides strip ── */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div key={i} className="w-full shrink-0 h-[40vh] min-h-[250px] md:min-h-[350px] lg:h-[480px]">
              <img
                src={src}
                alt={`Offer ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* ── Left arrow ── */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 rounded-full bg-white/80 shadow-md
            flex items-center justify-center
            hover:bg-white transition-all active:scale-90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* ── Right arrow ── */}
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 rounded-full bg-white/80 shadow-md
            flex items-center justify-center
            hover:bg-white transition-all active:scale-90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* ── Dot indicators ── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300
                ${i === current
                  ? 'w-5 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
