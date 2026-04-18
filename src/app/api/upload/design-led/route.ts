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
    images: meta.designLedImages ?? new Array(6).fill(null),
    labels: meta.designLedLabels ?? ['Earrings', 'Bangles', 'Necklace'],
  });
}

export async function POST(req: NextRequest) {
  const form  = await req.formData();
  const index = form.get('index');
  const labelIndex = form.get('labelIndex');
  const labelValue = form.get('label');
  const file  = form.get('file') as File | null;

  const meta = await readMeta();
  const images: (string | null)[] = meta.designLedImages ?? new Array(6).fill(null);
  const labels: string[] = meta.designLedLabels ?? ['Earrings', 'Bangles', 'Necklace'];

  if (labelIndex !== null && labelValue !== null) {
      labels[Number(labelIndex)] = labelValue as string;
      meta.designLedLabels = labels;
  }

  if (file && index !== null && !isNaN(Number(index))) {
      const idx = Number(index);
      const ext      = file.name.split('.').pop();
      const filename = `designled_${idx}.${ext}`;
      const buf      = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOAD, filename), buf);
      images[idx] = filename;
      meta.designLedImages = images;
  }

  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const index = req.nextUrl.searchParams.get('index');
  const meta  = await readMeta();

  if (index !== null) {
      const images: (string | null)[] = meta.designLedImages ?? new Array(6).fill(null);
      const idx = Number(index);
      const old = images[idx];
      if (old) { try { await unlink(path.join(UPLOAD, old)); } catch {} }
      images[idx] = null;
      meta.designLedImages = images;
  } else {
      meta.designLedImages = new Array(6).fill(null);
      meta.designLedLabels = ['Earrings', 'Bangles', 'Necklace'];
  }

  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
