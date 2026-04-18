import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

const META   = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
const UPLOAD = path.join(process.cwd(), 'public', 'uploads');

async function readMeta() {
  try { return JSON.parse(await readFile(META, 'utf8')); } catch { return {}; }
}
async function writeMeta(data: object) {
  await writeFile(META, JSON.stringify(data, null, 2));
}

export async function GET() {
  const meta = await readMeta();
  return NextResponse.json({
    images: meta.testimonialsImages ?? new Array(8).fill(null),
    names: meta.testimonialsNames ?? new Array(8).fill(null),
    texts: meta.testimonialsTexts ?? new Array(8).fill(null),
  });
}

export async function POST(req: NextRequest) {
  const form  = await req.formData();
  const index = form.get('index');
  const name  = form.get('name');
  const text  = form.get('text');
  const file  = form.get('file') as File | null;

  const meta = await readMeta();
  const images: (string | null)[] = meta.testimonialsImages ?? new Array(8).fill(null);
  const names: (string | null)[] = meta.testimonialsNames ?? new Array(8).fill(null);
  const texts: (string | null)[] = meta.testimonialsTexts ?? new Array(8).fill(null);

  if (index !== null && !isNaN(Number(index))) {
      const idx = Number(index);
      
      if (name !== null) names[idx] = name as string;
      if (text !== null) texts[idx] = text as string;

      if (file) {
          const ext      = file.name.split('.').pop();
          const filename = `testimonial_${idx}_${Date.now()}.${ext}`;
          const buf      = Buffer.from(await file.arrayBuffer());
          await writeFile(path.join(UPLOAD, filename), buf);
          
          if (images[idx]) {
             try { await unlink(path.join(UPLOAD, images[idx] as string)); } catch {}
          }
          images[idx] = filename;
      }

      meta.testimonialsImages = images;
      meta.testimonialsNames = names;
      meta.testimonialsTexts = texts;
  }

  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const index = req.nextUrl.searchParams.get('index');
  const meta  = await readMeta();

  if (index !== null) {
      const images: (string | null)[] = meta.testimonialsImages ?? new Array(8).fill(null);
      const names: (string | null)[] = meta.testimonialsNames ?? new Array(8).fill(null);
      const texts: (string | null)[] = meta.testimonialsTexts ?? new Array(8).fill(null);
      
      const idx = Number(index);
      const old = images[idx];
      if (old) { try { await unlink(path.join(UPLOAD, old)); } catch {} }
      
      images[idx] = null;
      names[idx]  = null;
      texts[idx]  = null;
      
      meta.testimonialsImages = images;
      meta.testimonialsNames = names;
      meta.testimonialsTexts = texts;
  } else {
      meta.testimonialsImages = new Array(8).fill(null);
      meta.testimonialsNames  = new Array(8).fill(null);
      meta.testimonialsTexts  = new Array(8).fill(null);
  }

  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
