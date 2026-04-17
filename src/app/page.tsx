import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Offers from '@/components/Offers';
import LatestCollections from '@/components/LatestCollections';


async function getMeta() {
  try {
    const raw = await readFile(
      path.join(process.cwd(), 'public', 'uploads', 'metadata.json'),
      'utf8'
    );
    return JSON.parse(raw);
  } catch {
    return { hero: null, goldCategories: [], silverCategories: [], offers: [] };
  }
}

export default async function Home() {
  const meta = await getMeta();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories
          goldLive={meta.goldCategories || []}
          silverLive={meta.silverCategories || []}
          goldPlan={meta.goldPlan}
          silverPlan={meta.silverPlan}
        />
        <Offers live={meta.offers || []} />
        <LatestCollections live={meta.collections || []} btnLink={meta.collectionsBtnLink} />


        {/* Brand Promises */}
        <section className="bg-navy text-white py-14">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { icon: '🛡️', title: '100% Certified',    desc: 'Every piece certified by IGI, GIA or BIS international laboratories.' },
              { icon: '🔄', title: 'Lifetime Exchange', desc: 'Upgrade or exchange your jewelry at the prevailing market rate.' },
              { icon: '📦', title: 'Secure Shipping',   desc: 'Insured shipping with discreet packaging delivered to your doorstep.' },
              { icon: '💍', title: 'Free Try-at-Home', desc: 'Select your favourites and try them on in the comfort of your home.' },
            ].map(p => (
              <div key={p.title}>
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-display text-lg font-semibold text-pink-200 mb-2">{p.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-[#fafaf8]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl font-bold text-navy mb-12">What Our Customers Say</h2>
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-dashed border-amber-300">
              <p className="font-display italic text-xl text-gray-700 leading-relaxed mb-6">
                &ldquo;The collection at Sri Sresta is absolutely breathtaking. I bought my wedding set here and the quality of the diamonds and the craftsmanship is unmatched. Truly a premium experience!&rdquo;
              </p>
              <p className="font-semibold text-navy">— Anjali Sharma</p>
            </div>
          </div>
        </section>

        <div className="h-[300px] bg-gradient-to-b from-white to-pink-50 flex items-center justify-center">
          <p className="font-display text-2xl text-gray-300">More Elegant Content Coming Soon…</p>
        </div>
      </main>
    </>
  );
}
