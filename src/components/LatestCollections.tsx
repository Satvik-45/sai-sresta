'use client';

const DEFAULTS = [
  '/images/collections/resized_image.png',
  '/images/collections/resized_image_2.png',
  '/images/collections/resized_image_3.png',
];

interface Props {
  live: (string | null)[];
  btnLink?: string;
}

export default function LatestCollections({ live, btnLink = '#' }: Props) {
  const imgs = DEFAULTS.map((def, i) => (live[i] ? `/uploads/${live[i]}` : def));

  /* All 3 cards identical size but responsive flex-1 to fill horizontal space.
     Center column = card + button (stacked). Parent is items-end → all columns 
     bottom-align → center card floats up by the height of the button row below it. */
  const CARD = 'w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm shrink-0';

  return (
    <section className="bg-white pt-6 pb-8">
      {/* Title */}
      <h2 className="text-center text-[28px] font-domine text-[#032C5E] tracking-wide mb-6">
        Browse Latest Jewellery Collections
      </h2>

      {/* Row — collapses to column on mobile */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-4 px-6 max-w-7xl mx-auto w-full">

        {/* Left card */}
        <div className="w-full max-w-md md:flex-1 md:max-w-[33%]">
            <div className={CARD}>
              <img src={imgs[0]} alt="Collection 1" className="w-full h-full object-cover" draggable={false} />
            </div>
        </div>

        {/* Center column: card + button below */}
        <div className="flex flex-col items-center gap-3 shrink-0 w-full max-w-md md:flex-1 md:max-w-[33%]">
          <div className={`${CARD}`}>
            <img src={imgs[1]} alt="Collection 2" className="w-full h-full object-cover" draggable={false} />
          </div>
          <a
            href={btnLink}
            className="px-8 py-2.5 rounded-full border border-pink-100 text-[12.5px] font-medium
              text-gray-500 bg-[#fceef4] hover:bg-pink-100 hover:border-pink-200 hover:text-coral
              transition-all duration-200 whitespace-nowrap shadow-sm mt-2 md:mt-0"
          >
            Browse all Collections
          </a>
        </div>

        {/* Right card */}
        <div className="w-full max-w-md md:flex-1 md:max-w-[33%]">
           <div className={CARD}>
             <img src={imgs[2]} alt="Collection 3" className="w-full h-full object-cover" draggable={false} />
           </div>
        </div>

      </div>
    </section>
  );
}
