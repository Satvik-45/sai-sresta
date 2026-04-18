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
    banner: meta.standaloneBanner ?? null,
  });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });

  const ext      = file.name.split('.').pop();
  const filename = `standalone_banner_${Date.now()}.${ext}`;
  const buf      = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD, filename), buf);

  const meta = await readMeta();
  const old = meta.standaloneBanner;
  if (old) { try { await unlink(path.join(UPLOAD, old)); } catch {} }

  meta.standaloneBanner = filename;
  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true, filename });
}

export async function DELETE() {
  const meta = await readMeta();
  const old = meta.standaloneBanner;
  if (old) { try { await unlink(path.join(UPLOAD, old)); } catch {} }

  meta.standaloneBanner = null;
  await writeMeta(meta);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
