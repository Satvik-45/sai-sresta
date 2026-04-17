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

/* GET — return offers array */
export async function GET() {
  const meta = await readMeta();
  return NextResponse.json(meta.offers ?? []);
}

/* POST — upload one image at a given index */
export async function POST(req: NextRequest) {
  const form  = await req.formData();
  const index = Number(form.get('index'));
  const file  = form.get('file') as File | null;
  if (!file || isNaN(index)) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const ext      = file.name.split('.').pop();
  const filename = `offer_${index}.${ext}`;
  const buf      = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD, filename), buf);

  const meta = await readMeta();
  const offers: (string | null)[] = meta.offers ?? new Array(4).fill(null);
  offers[index] = filename;
  meta.offers = offers;
  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true, filename });
}

/* DELETE ?index=N — reset slot to default */
export async function DELETE(req: NextRequest) {
  const index = Number(new URL(req.url).searchParams.get('index'));
  const meta  = await readMeta();
  const offers: (string | null)[] = meta.offers ?? new Array(4).fill(null);

  const old = offers[index];
  if (old) {
    try { await unlink(path.join(UPLOAD, old)); } catch {}
  }
  offers[index] = null;
  meta.offers = offers;
  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
