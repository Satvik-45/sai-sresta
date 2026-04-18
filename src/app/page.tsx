import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Offers from '@/components/Offers';
import LatestCollections from '@/components/LatestCollections';
import CuratedStyles from '@/components/CuratedStyles';
import DesignLed from '@/components/DesignLed';
import Testimonials from '@/components/Testimonials';
import PromiseSection from '@/components/Promise';


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
        <CuratedStyles />

        <DesignLed />

        {/* Standalone Banner Section */}
        <section className="w-full">
          <img 
            src={meta.standaloneBanner ? `/uploads/${meta.standaloneBanner}` : "/images/banner_collection.webp"}
            alt="Latest Collection Banner" 
            className="w-full h-auto block" 
            draggable={false}
          />
        </section>

        <Testimonials />
        <PromiseSection />
      </main>
    </>
  );
}
