'use client';

import { useRef, useState, useEffect } from 'react';

const REVIEWS = [
  {
    name: 'Akanksha Khanna, 27',
    text: 'Delighted with my engagement ring from Sri Sresta! It’s my dream ring, fits perfectly and is stunning to look at. Thanks, Sri Sresta, for helping us find the perfect symbol of love!',
    img: '/images/curated/layered_necklace.png',
    rotate: 'rotate-2',
    translateY: 'translate-y-04',
  },
  {
    name: 'Diksha Singh, 29',
    text: 'I was worried about finding good quality fine jewellery pieces online, but Sri Sresta’s customer service gave me full assurance and the delivery was super quick. Their jewellery is certified.',
    img: '/images/curated/bracelet_2.png',
    rotate: 'rotate-2',
    translateY: 'translate-y-0',
  },
  {
    name: 'Nutan Mishra, 33',
    text: 'I got a Nazariya for my baby boy from Sri Sresta. It’s so cute seeing it on my little one’s wrist, and it gives me a sense of security knowing it’s there. Thanks, Sri Sresta, for making such lovely pieces!',
    img: '/images/curated/chain_3.png',
    rotate: '-rotate-2',
    translateY: '-translate-y-4',
  },
  {
    name: 'Divya Mishra, 26',
    text: 'On Valentine’s Day, my husband gifted me a necklace from Sri Sresta, and I haven’t taken it off ever since. Everyone asks me where it’s from, and I just LOVE how nice it looks on me.',
    img: '/images/curated/ear_rings_4.png',
    rotate: 'rotate-3',
    translateY: 'translate-y-6',
  },
  {
    name: 'Anuska Ananya, 24',
    text: 'Sri Sresta is my go-to place for jewellery. I love that I can wear their jewellery to work, dates, parties and brunches; it goes with everything and makes my outfits look stylish and trendy.',
    img: '/images/curated/pendant_1.png',
    rotate: '-rotate-6',
    translateY: 'translate-y-2',
  },
  {
    name: 'Priya Singh, 34',
    text: 'I had trouble finding jewellery that suited my minimalist style, but Sri Sresta’s sleek and elegant designs were exactly what I was looking for. They have pieces for every style and occasion.',
    img: '/images/curated/men_jewellery_1.png',
    rotate: 'rotate-1',
    translateY: 'translate-y-10',
  },
  {
    name: 'Avni Sharma, 27',
    text: 'Me and my friends love Sri Sresta’s unique designs, especially their enamel jewellery. I love how their enamel pieces add a pop of colour to my outfits. Their jewellery is stylish, modern.',
    img: '/images/curated/men_jewellery_2.png',
    rotate: '-rotate-3',
    translateY: '-translate-y-2',
  },
  {
    name: 'Sonaalee Semwal, 28',
    text: 'I bought a bracelet from Sri Sresta as a birthday gift from me to me. I love how versatile it is. If you want to buy yourself a gift, Sri Sresta is the place to go!',
    img: '/images/curated/men_jewellery_3.png',
    rotate: 'rotate-3',
    translateY: 'translate-y-4',
  }
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [imagesOverride, setImagesOverride] = useState<(string|null)[]>(new Array(8).fill(null));
  const [namesOverride,  setNamesOverride]  = useState<(string|null)[]>(new Array(8).fill(null));
  const [textsOverride,  setTextsOverride]  = useState<(string|null)[]>(new Array(8).fill(null));

  useEffect(() => {
    fetch('/api/upload/testimonials').then(r => r.json()).then(d => {
      if (d.images) setImagesOverride(d.images.map((f:string|null) => f ? `/uploads/${f}` : null));
      if (d.names)  setNamesOverride(d.names);
      if (d.texts)  setTextsOverride(d.texts);
    }).catch(() => {});
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <section className="bg-white py-16 overflow-hidden relative">
      <div className="w-full mb-12 relative">
        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-10 overflow-x-auto pb-16 pt-10 px-8 lg:px-12 snap-x snap-mandatory z-10 relative scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Wavy Background Path (Now scrolls with content) - COMMENTED OUT AWAITING APPROVAL
          <div className="absolute top-[-10px] left-0 right-0 w-[4150px] overflow-hidden pointer-events-none z-0">
            <svg className="w-full h-[100px]" preserveAspectRatio="none" viewBox="0 0 4150 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-13 50 C 150.5 -15 350.5 110.5 550.5 50 C 750.5 -10.5 950.5 110.5 1150.5 50 C 1350.5 -10.5 1550.5 110.5 1750.5 50 C 1950.5 -10.5 2150.5 110.5 2350.5 50 C 2550.5 -10.5 2750.5 110.5 2950.5 50 C 3150.5 -10.5 3350.5 110.5 3550.5 50 C 3750.5 -10.5 3950.5 110.5 4150.5 50" stroke="#000" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
            </svg>
          </div>
          */}

          {REVIEWS.map((review, idx) => {
            const displayImg = imagesOverride[idx] || review.img;
            const displayName = namesOverride[idx] || review.name;
            const displayText = textsOverride[idx] || review.text;

            return (
              <div 
                key={idx} 
                className={`relative min-w-[280px] w-[280px] shrink-0 snap-center transition-transform hover:scale-105 duration-300 ${review.rotate} ${review.translateY} shadow-lg rounded-sm`}
                style={{ backgroundColor: '#ffeff3' }}
              >
                {/* Pin */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-10 z-20 drop-shadow-sm">
                  <img src="/images/pin.webp" alt="Pin" className="w-full h-full object-contain" />
                </div>

                {/* Polaroid Frame */}
                <div className="p-3 pb-8 h-full flex flex-col">
                  <div className="w-full aspect-[4/3] bg-white mb-4 relative overflow-hidden">
                    <img src={displayImg} alt={displayName} className="w-full h-full object-contain p-2" draggable={false} />
                  </div>
                  
                  <h4 className="text-[#032C5E] font-medium text-[15px] mb-2">{displayName}</h4>
                  <p className="text-gray-400 text-[12px] leading-relaxed italic">
                    {displayText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Styled Scrollbar indicator matching exact Testimonial background color */}
        <div className="max-w-[280px] mx-auto mt-10 relative h-[4px] bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-75"
            style={{ width: `${Math.max(15, scrollProgress)}%`, backgroundColor: '#e29db1' }}
          />
        </div>
      </div>
    </section>
  );
}
