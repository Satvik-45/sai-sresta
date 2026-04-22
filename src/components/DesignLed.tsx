'use client';

import { useState, useEffect } from 'react';

const ITEMS = [
  {
    largeImg: '/images/design-led/earrings_2.webp',
    smallImg: '/images/design-led/earrings_1.png',
    label:    'Earrings'
  },
  {
    largeImg: '/images/design-led/bangles_2.webp',
    smallImg: '/images/design-led/bangles_1.png',
    label:    'Bangles'
  },
  {
    largeImg: '/images/design-led/necklace_2.webp',
    smallImg: '/images/design-led/necklace_1.png',
    label:    'Necklace'
  }
];

export default function DesignLed() {
  const [overrides, setOverrides] = useState<(string | null)[]>(new Array(6).fill(null));
  const [labelOverrides, setLabelOverrides] = useState<(string | null)[]>(new Array(3).fill(null));

  useEffect(() => {
    fetch('/api/upload/design-led')
      .then(r => r.json())
      .then(d => {
        if (d.images) setOverrides(d.images.map((file: string | null) => file ? `/uploads/${file}` : null));
        if (d.labels) setLabelOverrides(d.labels);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white py-12">
      {/* Title */}
      <h2 className="text-center text-[28px] font-domine text-[#032C5E] tracking-wide mb-10">
        Design Led Jewellery
      </h2>

      {/* Grid container */}
      <div className="w-full px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {ITEMS.map((item, idx) => {
          const largeIndex = idx * 2;
          const smallIndex = idx * 2 + 1;
          const displayLarge = overrides[largeIndex] || item.largeImg;
          const displaySmall = overrides[smallIndex] || item.smallImg;
          const displayLabel = labelOverrides[idx] || item.label;

          return (
            <div key={idx} className="flex flex-col items-center">
              
              {/* Image Box */}
              <div className="relative w-full mb-14 border border-[#f0f0f0] rounded-[16px] shadow-sm bg-[#fafafa]">
                <img 
                  src={displayLarge} 
                  alt={`${displayLabel} worn`} 
                  className="w-full object-cover rounded-[16px]"
                  draggable={false}
                />
                
                {/* Overlapping small container */}
                <div 
                  className="absolute z-10 left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 
                            w-[160px] h-[95px] sm:w-[190px] sm:h-[115px] xl:w-[240px] xl:h-[140px] bg-white rounded-[20px] shadow-[0_12px_40px_rgb(0,0,0,0.15)] 
                            flex items-center justify-center p-1 overflow-hidden"
                >
                  <img 
                    src={displaySmall} 
                    alt={displayLabel} 
                    className="w-full h-full object-cover scale-[1.2] opacity-90 transition-opacity hover:opacity-100" 
                    draggable={false}
                  />
                </div>
              </div>

              {/* Label below */}
              <p className="text-[13px] text-gray-400 font-medium tracking-wide">
                {displayLabel}
              </p>

            </div>
          );
        })}
      </div>
    </section>
  );
}
