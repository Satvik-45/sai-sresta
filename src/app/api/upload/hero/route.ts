import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const METADATA_PATH = path.join(UPLOADS_DIR, 'metadata.json');

function getMediaType(mimeType: string): 'image' | 'video' | 'gif' {
  if (mimeType === 'image/gif') return 'gif';
  if (mimeType.startsWith('video/')) return 'video';
  return 'image';
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
  };
  return map[mimeType] ?? 'bin';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowed = ['image/jpeg','image/png','image/gif','image/webp','image/avif','video/mp4','video/webm','video/ogg'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
    }

    const ext      = getExtension(file.type);
    const filename = `hero.${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // Update metadata
    const meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    meta.hero = {
      filename,
      type: getMediaType(file.type),
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    };
    await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));

    // Revalidate landing page so it picks up the new hero immediately
    revalidatePath('/');

    return NextResponse.json({ success: true, filename, type: meta.hero.type });
  } catch (err) {
    console.error('[upload/hero]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    return NextResponse.json(meta.hero);
  } catch {
    return NextResponse.json({ filename: null, type: null });
  }
}

export async function DELETE() {
  try {
    const meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    meta.hero = {
      filename: null,
      type: null,
      originalName: null,
      uploadedAt: null,
    };
    await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[delete/hero]', err);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
