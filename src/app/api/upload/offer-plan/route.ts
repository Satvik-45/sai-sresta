import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

const METADATA_PATH = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');

const DEFAULTS = {
  gold: { badge: 'Gold Mine',   installment: '10 + 1', suffix: 'Monthly Plan', desc: 'Pay 10 installments, and get 100% off on the last one!', btnText: 'Enroll Now', btnLink: '#' },
  silver: { badge: 'Silver Mine', installment: '10 + 1', suffix: 'Monthly Plan', desc: 'Pay 10 installments, and get 100% off on the last one!', btnText: 'Enroll Now', btnLink: '#' },
};

function keyFor(type: string | null) {
  return type === 'silver' ? 'silverPlan' : 'goldPlan';
}

export async function GET(req: NextRequest) {
  const type = new URL(req.url).searchParams.get('type') as 'gold' | 'silver';
  try {
    const meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    return NextResponse.json(meta[keyFor(type)] ?? DEFAULTS[type] ?? DEFAULTS.gold);
  } catch {
    return NextResponse.json(DEFAULTS[type] ?? DEFAULTS.gold);
  }
}

export async function POST(req: NextRequest) {
  const type = new URL(req.url).searchParams.get('type') as 'gold' | 'silver';
  try {
    const body = await req.json();
    const meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    meta[keyFor(type)] = { ...DEFAULTS[type], ...body };
    await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const type = new URL(req.url).searchParams.get('type') as 'gold' | 'silver';
  try {
    const meta = JSON.parse(await readFile(METADATA_PATH, 'utf8'));
    meta[keyFor(type)] = DEFAULTS[type];
    await writeFile(METADATA_PATH, JSON.stringify(meta, null, 2));
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
