'use client';

import { useState } from 'react';

/* ─── Default assets baked in — overridden if client uploads via /upload ─── */
const GOLD_DEFAULTS = [
  { name: 'Solitaires',       img: '/images/category/solitaire_gold.png' },
  { name: 'Watch Jewellery',  img: '/images/category/watch_jewellery_gold.png' },
  { name: "Men's Jewellery",  img: '/images/category/mens_jewellery_gold.png' },
  { name: 'Mangalsutras',     img: '/images/category/mangalsutra_gold.png' },
  { name: 'Nose Pins',        img: '/images/category/nose_pin_gold.png' },
  { name: 'Kids Jewellery',   img: '/images/category/kids_jewellery_gold.png' },
  { name: 'Gold Coins',       img: '/images/category/gold_coins.png' },
  { name: 'Anklets',          img: '/images/category/gold_anklet.png' },
  { name: 'Pendants',         img: '/images/category/gold_pendant.png' },
  { name: 'Rings',            img: '/images/category/gold_rings.png' },
  { name: 'Necklaces',        img: '/images/category/gold_neckalce.png' },
  { name: 'Earrings',         img: '/images/category/gold_earrings.png' },
  { name: 'Bangles',          img: '/images/category/gold_bangles.png' },
  { name: 'Bracelets',        img: '/images/category/gold_bracelet.png' },
  { name: 'Gold Chains',      img: '/images/category/gold_chain.png' },
  { name: 'Kada',             img: '/images/category/gold_kada.png' },
];

const SILVER_DEFAULTS = [
  { name: 'Solitaires',       img: '/images/category/solitaire_silver.png' },
  { name: 'Watch Jewellery',  img: '/images/category/watch_jewellery_silver.png' },
  { name: "Men's Jewellery",  img: '/images/category/mens_jewellery_silver.png' },
  { name: 'Mangalsutras',     img: '/images/category/mangalsutra_silver.png' },
  { name: 'Nose Pins',        img: '/images/category/nose_pin_silver.png' },
  { name: 'Kids Jewellery',   img: '/images/category/kids_jewellery_silver.png' },
  { name: 'Silver Coins',     img: '/images/category/silver_coins.png' },
  { name: 'Anklets',          img: '/images/category/silver_anklet.png' },
  { name: 'Pendants',         img: '/images/category/silver_image.png' },
  { name: 'Rings',            img: '/images/category/silver_ring.png' },
  { name: 'Necklaces',        img: '/images/category/silver_neckalce.png' },
  { name: 'Earrings',         img: '/images/category/silver_earrings.png' },
  { name: 'Bangles',          img: '/images/category/silver_bangle.png' },
  { name: 'Bracelets',        img: '/images/category/silver_bracelet.png' },
  { name: 'Silver Chains',    img: '/images/category/silver_chain.png' },
  { name: 'Kada',             img: '/images/category/silver_kada.png' },
];

interface PlanData {
  badge: string;
  installment: string;
  suffix: string;
  desc: string;
  btnText: string;
  btnLink: string;
}

const GOLD_PLAN_DEFAULT: PlanData = {
  badge: 'Gold Mine', installment: '10 + 1', suffix: 'Monthly Plan',
  desc: 'Pay 10 installments, and get 100% off on the last one!',
  btnText: 'Enroll Now', btnLink: '#',
};

const SILVER_PLAN_DEFAULT: PlanData = {
  badge: 'Silver Mine', installment: '10 + 1', suffix: 'Monthly Plan',
  desc: 'Pay 10 installments, and get 100% off on the last one!',
  btnText: 'Enroll Now', btnLink: '#',
};

interface CategoryItem { name: string; img?: string; filename?: string | null; }

function buildItems(
  defaults: typeof GOLD_DEFAULTS,
  live: Array<{ name?: string; filename?: string | null } | null>
): CategoryItem[] {
  if (!live || live.length === 0) return defaults;
  return defaults.map((def, i) => {
    const o = live[i];
    if (!o) return def;
    return { name: o.name || def.name, img: o.filename ? `/uploads/${o.filename}` : def.img };
  });
}

interface Props {
  goldLive: Array<{ name?: string; filename?: string | null } | null>;
  silverLive: Array<{ name?: string; filename?: string | null } | null>;
  goldPlan?: Partial<PlanData>;
  silverPlan?: Partial<PlanData>;
}

export default function Categories({ goldLive, silverLive, goldPlan, silverPlan }: Props) {
  const [tab, setTab] = useState<'gold' | 'silver'>('gold');

  const goldItems   = buildItems(GOLD_DEFAULTS,   goldLive);
  const silverItems = buildItems(SILVER_DEFAULTS, silverLive);
  const items       = tab === 'gold' ? goldItems : silverItems;

  const plan: PlanData = tab === 'gold'
    ? { ...GOLD_PLAN_DEFAULT, ...goldPlan }
    : { ...SILVER_PLAN_DEFAULT, ...silverPlan };

  return (
    <section className="bg-white py-10">
      <div className="w-full px-6">

        {/* ── Gold / Silver toggle ── */}
        <div className="flex items-center justify-center mb-10">
          <div className="relative inline-flex rounded-full bg-gray-100 p-1">
            <span
              className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-in-out
                ${tab === 'gold'
                  ? 'left-1 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-md'
                  : 'left-[calc(50%+3px)] bg-gradient-to-r from-slate-400 to-gray-500 shadow-md'
                }`}
            />
            <button
              onClick={() => setTab('gold')}
              className={`relative z-10 px-10 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors duration-300
                ${tab === 'gold' ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Gold
            </button>
            <button
              onClick={() => setTab('silver')}
              className={`relative z-10 px-10 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors duration-300
                ${tab === 'silver' ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Silver
            </button>
          </div>
        </div>

        {/* ── 2-row × 8-col grid ── */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-x-4 md:gap-y-8">
          {items.map((cat, i) => (
            <div
              key={`${tab}-${i}`}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className={`w-full aspect-square rounded-[22px] overflow-hidden flex items-center justify-center
                transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl
                ${tab === 'gold' ? 'bg-[#fff5f5] group-hover:bg-[#ffeef0]' : 'bg-[#f4f6f9] group-hover:bg-[#eaeff7]'}`}
              >
                <img src={cat.img} alt={cat.name} className="w-[78%] h-[78%] object-contain" />
              </div>
              <p className={`text-[12px] font-medium text-center leading-tight transition-colors
                ${tab === 'gold' ? 'text-gray-400 group-hover:text-amber-600' : 'text-gray-400 group-hover:text-slate-600'}`}>
                {cat.name}
              </p>
            </div>
          ))}
        </div>

        {/* ── Offer Plan Banner — after grid ── */}
        <div
          style={tab === 'gold' ? {
            backgroundImage: [
              'linear-gradient(to right, transparent 0%, rgba(180,110,140,0.25) 30%, rgba(180,110,140,0.25) 70%, transparent 100%)',
              'linear-gradient(to right, transparent 0%, rgba(180,110,140,0.25) 30%, rgba(180,110,140,0.25) 70%, transparent 100%)',
              'linear-gradient(to right, #ffffff 0%, #fffafa 20%, #fff5f5 50%, #fffafa 80%, #ffffff 100%)',
            ].join(','),
            backgroundSize:     '100% 1px, 100% 1px, 100% 100%',
            backgroundPosition: 'top, bottom, center',
            backgroundRepeat:   'no-repeat',
          } : {
            backgroundImage: [
              'linear-gradient(to right, transparent 0%, rgba(100,120,155,0.2) 30%, rgba(100,120,155,0.2) 70%, transparent 100%)',
              'linear-gradient(to right, transparent 0%, rgba(100,120,155,0.2) 30%, rgba(100,120,155,0.2) 70%, transparent 100%)',
              'linear-gradient(to right, #f8fafc 0%, #f2f5f9 20%, #e8eef5 50%, #f2f5f9 80%, #f8fafc 100%)',
            ].join(','),
            backgroundSize:     '100% 1px, 100% 1px, 100% 100%',
            backgroundPosition: 'top, bottom, center',
            backgroundRepeat:   'no-repeat',
          }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full py-5 md:py-3.5 mt-10 md:mt-16 text-center md:text-left"
        >
          <p className="text-[12px] md:text-[13.5px] text-navy">
            <span className="font-bold block sm:inline">{plan.badge} </span>
            <span className={`font-extrabold ${tab === 'gold' ? 'text-coral' : 'text-slate-500'}`}>
              {plan.installment}
            </span>
            <span className="font-bold"> {plan.suffix}</span>
            <span className="text-gray-400 font-normal text-[11px] md:text-[13px] block sm:inline sm:ml-1.5 mt-1 sm:mt-0">({plan.desc})</span>
          </p>
          <a
            href={plan.btnLink}
            className={`shrink-0 px-6 py-2 rounded-lg text-[13px] font-bold text-white
              transition-all hover:opacity-90 active:scale-95 shadow-sm
              ${tab === 'gold' ? 'bg-coral' : 'bg-slate-500'}`}
          >
            {plan.btnText}
          </a>
        </div>

      </div>
    </section>
  );
}
