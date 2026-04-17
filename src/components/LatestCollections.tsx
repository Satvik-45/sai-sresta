'use client';

const DEFAULTS = [
  '/images/collections/latest_1.webp',
  '/images/collections/latest_2.webp',
  '/images/collections/latest_3.webp',
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
      <h2 className="text-center text-[28px] font-semibold text-coral tracking-wide mb-6">
        Browse Latest Jewellery Collections
      </h2>

      {/* Row — bottom-aligned so center card floats up via button pushdown */}
      <div className="flex items-end justify-center gap-4 px-6 max-w-full">

        {/* Left card */}
        <div className="flex-1 w-full max-w-[33%]">
            <div className={CARD}>
              <img src={imgs[0]} alt="Collection 1" className="w-full h-full object-cover" draggable={false} />
            </div>
        </div>

        {/* Center column: card + button below */}
        <div className="flex flex-col items-center gap-3 shrink-0 flex-1 w-full max-w-[33%]">
          <div className={`${CARD}`}>
            <img src={imgs[1]} alt="Collection 2" className="w-full h-full object-cover" draggable={false} />
          </div>
          <a
            href={btnLink}
            className="px-8 py-2.5 rounded-full border border-pink-100 text-[12.5px] font-medium
              text-gray-500 bg-[#fceef4] hover:bg-pink-100 hover:border-pink-200 hover:text-coral
              transition-all duration-200 whitespace-nowrap shadow-sm"
          >
            Browse all Collections
          </a>
        </div>

        {/* Right card */}
        <div className="flex-1 w-full max-w-[33%]">
           <div className={CARD}>
             <img src={imgs[2]} alt="Collection 3" className="w-full h-full object-cover" draggable={false} />
           </div>
        </div>

      </div>
    </section>
  );
}
