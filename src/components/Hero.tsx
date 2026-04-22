import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

interface HeroMeta {
  filename: string | null;
  type: 'image' | 'video' | 'gif' | null;
  originalName: string | null;
  uploadedAt: string | null;
}

async function getHeroMeta(): Promise<HeroMeta> {
  try {
    const metaPath = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
    const raw = await readFile(metaPath, 'utf8');
    const meta = JSON.parse(raw);
    return meta.hero as HeroMeta;
  } catch {
    return { filename: null, type: null, originalName: null, uploadedAt: null };
  }
}

export default async function Hero() {
  const meta = await getHeroMeta();

  const src = meta.filename ? `/uploads/${meta.filename}` : '/images/hero_banner.png';
  const isVideo = meta.type === 'video';

  return (
    <section className="relative w-full h-[60vh] min-h-[350px] md:min-h-[400px] md:h-[520px] lg:h-[600px] overflow-hidden bg-gray-100">

      {isVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          key={src}
        >
          <source src={src} />
        </video>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt="Sri Sresta Hero Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Subtle vignette — optional, gives depth without covering the image */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
    </section>
  );
}
