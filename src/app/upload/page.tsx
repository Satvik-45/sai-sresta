'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';

const ACCEPTED     = 'image/jpeg,image/png,image/gif,image/webp,image/avif,video/mp4,video/webm';
const ACCEPTED_IMG = 'image/jpeg,image/png,image/webp,image/gif,image/avif';
const SLOTS        = 16;

/* ─── Category grid sub-component ──────────────────────────── */
function CategoryGrid({ type }: { type: 'gold' | 'silver' }) {
  const [files,    setFiles]    = useState<(File | null)[]>(new Array(SLOTS).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(new Array(SLOTS).fill(null));
  const [names,    setNames]    = useState<string[]>(new Array(SLOTS).fill(''));
  const [saving,   setSaving]   = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetch(`/api/upload/categories?type=${type}`)
      .then(r => r.json())
      .then(data => {
        setNames(new Array(SLOTS).fill('').map((_, i) => data[i]?.name || ''));
        setPreviews(new Array(SLOTS).fill(null).map((_, i) =>
          data[i]?.filename ? `/uploads/${data[i].filename}` : null
        ));
      });
  }, [type]);

  const loadFile = (f: File, i: number) => {
    setPreviews(prev => { const n = [...prev]; n[i] = URL.createObjectURL(f); return n; });
    setFiles(prev    => { const n = [...prev]; n[i] = f; return n; });
  };

  const save = async (i: number) => {
    setSaving(`${i}`);
    const fd = new FormData();
    if (files[i]) fd.append('file', files[i]!);
    fd.append('index', String(i));
    fd.append('name', names[i]);
    await fetch(`/api/upload/categories?type=${type}`, { method: 'POST', body: fd });
    setFiles(prev => { const n = [...prev]; n[i] = null; return n; });
    setSaving(null);
  };

  const reset = async (i: number) => {
    if (!confirm(`Reset slot ${i + 1}?`)) return;
    await fetch(`/api/upload/categories?type=${type}&index=${i}`, { method: 'DELETE' });
    setPreviews(prev => { const n = [...prev]; n[i] = null; return n; });
    setFiles(prev    => { const n = [...prev]; n[i] = null; return n; });
    setNames(prev    => { const n = [...prev]; n[i] = ''; return n; });
  };

  const clearAll = async () => {
    if (!confirm(`Clear all ${type} categories?`)) return;
    await fetch(`/api/upload/categories?type=${type}`, { method: 'DELETE' });
    setPreviews(new Array(SLOTS).fill(null));
    setFiles(new Array(SLOTS).fill(null));
    setNames(new Array(SLOTS).fill(''));
  };

  const accent = type === 'gold'
    ? 'from-amber-400 to-yellow-500'
    : 'from-slate-400 to-gray-500';
  const cardBg = type === 'gold' ? 'bg-[#fff5f5]' : 'bg-[#f4f6f9]';

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${accent}`} />
          <h2 className="text-xl font-display font-bold text-navy uppercase tracking-widest">
            {type === 'gold' ? 'Gold' : 'Silver'} Categories
          </h2>
          <span className="text-xs text-gray-300 font-medium">(16 slots)</span>
        </div>
        <button
          onClick={clearAll}
          className="px-5 py-1.5 rounded-full border border-gray-200 text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-50 transition-all"
        >
          Clear All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-x-5 gap-y-10">
        {Array.from({ length: SLOTS }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            {/* Image slot */}
            <div
              onClick={() => inputRefs.current[i]?.click()}
              className={`relative w-full aspect-square rounded-[18px] cursor-pointer overflow-hidden ${cardBg}
                border border-white hover:border-gray-200 transition-all flex items-center justify-center group shadow-sm`}
            >
              <input
                ref={el => { inputRefs.current[i] = el; }}
                type="file" accept={ACCEPTED_IMG} className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f, i); }}
              />
              {previews[i]
                ? <img src={previews[i]!} alt="" className="w-full h-full object-cover" />
                : <span className="text-xl grayscale opacity-10 group-hover:opacity-30 transition-all">✨</span>
              }
              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            </div>

            {/* Name input */}
            <input
              type="text"
              value={names[i]}
              onChange={e => setNames(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
              placeholder="ENTER NAME"
              className="w-full text-center text-[11px] font-black text-navy border-b border-gray-200 focus:border-coral outline-none bg-transparent placeholder:text-gray-300 tracking-tight py-1"
            />

            {/* Actions */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => save(i)}
                className={`text-[10px] bg-gradient-to-r ${accent} text-white px-3 py-1.5 rounded-full font-black shadow-sm active:scale-90 transition-all`}
              >
                {saving === String(i) ? '…' : 'SAVE'}
              </button>
              <button
                onClick={() => reset(i)}
                className="text-[10px] text-gray-300 hover:text-red-400 font-black px-1.5 transition-colors"
              >
                RESET
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main upload page ─────────────────────────────────────── */
export default function UploadPage() {
  const [heroFile,    setHeroFile]    = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroIsVideo, setHeroIsVideo] = useState(false);
  const [heroSaving,  setHeroSaving]  = useState(false);
  const [heroMsg,     setHeroMsg]     = useState('');
  const heroInputRef = useRef<HTMLInputElement>(null);

  const loadHero = (f: File) => {
    if (heroPreview) URL.revokeObjectURL(heroPreview);
    setHeroPreview(URL.createObjectURL(f));
    setHeroIsVideo(f.type.startsWith('video/'));
    setHeroFile(f);
  };

  const publishHero = async () => {
    if (!heroFile) return;
    setHeroSaving(true);
    const fd = new FormData();
    fd.append('file', heroFile);
    await fetch('/api/upload/hero', { method: 'POST', body: fd });
    setHeroFile(null);
    setHeroSaving(false);
    setHeroMsg('Hero published!');
  };

  const resetHero = async () => {
    if (!confirm('Reset hero to default?')) return;
    await fetch('/api/upload/hero', { method: 'DELETE' });
    setHeroPreview(null);
    setHeroFile(null);
    setHeroMsg('Hero reset.');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      <Header />

      <div className="max-w-[1600px] mx-auto px-8 py-12 space-y-20">

        {/* ── HERO ── */}
        <section className="space-y-5">
          <div className="flex items-end justify-between border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-display font-bold text-navy uppercase tracking-widest">Hero Section</h2>
            <div className="flex items-center gap-3">
              {heroMsg && <span className="text-xs text-green-500 font-bold">{heroMsg}</span>}
              <button onClick={resetHero} className="px-5 py-1.5 rounded-full border border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">Reset</button>
              {heroFile && (
                <button onClick={publishHero} disabled={heroSaving}
                  className="px-6 py-1.5 rounded-full bg-coral text-white text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-coralDark transition-all">
                  {heroSaving ? '…' : 'Publish Hero'}
                </button>
              )}
            </div>
          </div>

          <div
            onClick={() => heroInputRef.current?.click()}
            className="relative w-full h-[360px] rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 hover:border-navy/30 bg-gray-50 flex items-center justify-center transition-all group"
          >
            <input ref={heroInputRef} type="file" accept={ACCEPTED} className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadHero(f); }} />
            {heroPreview ? (
              <>
                {heroIsVideo
                  ? <video src={heroPreview} className="w-full h-full object-cover" autoPlay muted loop />
                  : <img src={heroPreview} alt="hero" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <span className="bg-white/90 text-navy px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">CLICK TO REPLACE</span>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-300 group-hover:text-navy/30 transition-colors">
                <p className="font-bold text-sm tracking-widest uppercase">Click to upload Banner</p>
                <p className="text-[10px] mt-1 opacity-60 italic">Recommended: 1920 × 520 px</p>
              </div>
            )}
          </div>
        </section>

        {/* ── GOLD CATEGORIES ── */}
        <CategoryGrid type="gold" />

        {/* ── GOLD OFFER PLAN ── */}
        <PlanEditor type="gold" />

        {/* ── SILVER CATEGORIES ── */}
        <CategoryGrid type="silver" />

        {/* ── SILVER OFFER PLAN ── */}
        <PlanEditor type="silver" />

        {/* ── OFFERS CAROUSEL ── */}
        <OffersEditor />

        {/* ── LATEST COLLECTIONS ── */}
        <CollectionsEditor />

      </div>
    </div>
  );
}

/* ─── Offer Plan Editor ─────────────────────────────────────── */
function PlanEditor({ type }: { type: 'gold' | 'silver' }) {
  const [badge,       setBadge]       = useState(type === 'gold' ? 'Gold Mine' : 'Silver Mine');
  const [installment, setInstallment] = useState('10 + 1');
  const [suffix,      setSuffix]      = useState('Monthly Plan');
  const [desc,        setDesc]        = useState('Pay 10 installments, and get 100% off on the last one!');
  const [btnText,     setBtnText]     = useState('Enroll Now');
  const [btnLink,     setBtnLink]     = useState('#');
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState('');

  useEffect(() => {
    fetch(`/api/upload/offer-plan?type=${type}`).then(r => r.json()).then(d => {
      if (d.badge)       setBadge(d.badge);
      if (d.installment) setInstallment(d.installment);
      if (d.suffix)      setSuffix(d.suffix);
      if (d.desc)        setDesc(d.desc);
      if (d.btnText)     setBtnText(d.btnText);
      if (d.btnLink)     setBtnLink(d.btnLink);
    });
  }, [type]);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/upload/offer-plan?type=${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badge, installment, suffix, desc, btnText, btnLink }),
    });
    setSaving(false);
    setMsg('Saved!');
    setTimeout(() => setMsg(''), 2000);
  };

  const reset = async () => {
    if (!confirm('Reset to default?')) return;
    await fetch(`/api/upload/offer-plan?type=${type}`, { method: 'DELETE' });
    setBadge(type === 'gold' ? 'Gold Mine' : 'Silver Mine');
    setInstallment('10 + 1');
    setSuffix('Monthly Plan');
    setDesc('Pay 10 installments, and get 100% off on the last one!');
    setBtnText('Enroll Now');
    setBtnLink('#');
    setMsg('Reset!');
    setTimeout(() => setMsg(''), 2000);
  };

  const accent = type === 'gold' ? 'from-amber-400 to-yellow-500' : 'from-slate-400 to-gray-500';
  const bannerBg = type === 'gold' ? 'bg-[#fff0f3]' : 'bg-[#f0f3ff]';
  const highlight = type === 'gold' ? 'text-coral' : 'text-slate-400';
  const btnColor  = type === 'gold' ? 'bg-coral' : 'bg-slate-500';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${accent}`} />
          <h2 className="text-xl font-display font-bold text-navy uppercase tracking-widest">
            {type === 'gold' ? 'Gold' : 'Silver'} Offer Plan Banner
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs text-green-500 font-bold">{msg}</span>}
          <button onClick={reset} className="px-5 py-1.5 rounded-full border border-gray-200 text-[10px] font-black text-gray-400 uppercase hover:bg-gray-50">Reset</button>
          <button onClick={save} disabled={saving} className={`px-5 py-1.5 rounded-full bg-gradient-to-r ${accent} text-white text-[10px] font-black uppercase shadow-md`}>
            {saving ? '…' : 'Save Plan'}
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div
        style={type === 'gold' ? {
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
        className="flex items-center justify-center gap-6 w-full py-3.5"
      >
        <p className="text-[13.5px] text-navy">
          <span className="font-bold">{badge} </span>
          <span className={`font-extrabold ${highlight}`}>{installment}</span>
          <span className="font-bold"> {suffix}</span>
          <span className="text-gray-400 font-normal text-[13px] ml-1.5">({desc})</span>
        </p>
        <span className={`shrink-0 px-6 py-2 rounded-lg text-[13px] font-bold text-white shadow-sm ${btnColor}`}>{btnText}</span>
      </div>

      {/* Fields — only editable parts */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Description</label>
          <input value={desc} onChange={e => setDesc(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-coral bg-white w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Button Text</label>
            <input value={btnText} onChange={e => setBtnText(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy font-semibold outline-none focus:border-coral bg-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Button Link</label>
            <input value={btnLink} onChange={e => setBtnLink(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-coral bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Offers Carousel Editor ─────────────────────────────────── */
const OFFER_DEFAULTS = [
  '/images/offers/offer_1.jpg',
  '/images/offers/offer_2.jpg',
  '/images/offers/offer_3.jpg',
  '/images/offers/offer_4.jpg',
];

function OffersEditor() {
  const [files,    setFiles]    = useState<(File | null)[]>(new Array(4).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(new Array(4).fill(null));
  const [saving,   setSaving]   = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetch('/api/upload/offers').then(r => r.json()).then((slots: (string | null)[]) => {
      setPreviews(new Array(4).fill(null).map((_, i) => slots[i] ? `/uploads/${slots[i]}` : null));
    });
  }, []);

  const loadFile = (f: File, i: number) => {
    setPreviews(prev => { const n = [...prev]; n[i] = URL.createObjectURL(f); return n; });
    setFiles(prev    => { const n = [...prev]; n[i] = f; return n; });
  };

  const save = async (i: number) => {
    if (!files[i]) return;
    setSaving(i);
    const fd = new FormData();
    fd.append('file', files[i]!);
    fd.append('index', String(i));
    await fetch('/api/upload/offers', { method: 'POST', body: fd });
    setFiles(prev => { const n = [...prev]; n[i] = null; return n; });
    setSaving(null);
  };

  const reset = async (i: number) => {
    if (!confirm(`Reset offer ${i + 1} to default?`)) return;
    await fetch(`/api/upload/offers?index=${i}`, { method: 'DELETE' });
    setPreviews(prev => { const n = [...prev]; n[i] = null; return n; });
    setFiles(prev    => { const n = [...prev]; n[i] = null; return n; });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
          <h2 className="text-xl font-display font-bold text-navy uppercase tracking-widest">Offers Carousel</h2>
          <span className="text-xs text-gray-300 font-medium">(4 slides)</span>
        </div>
        <button
          onClick={async () => {
            if (!confirm('Reset all offer slides to defaults?')) return;
            await Promise.all([0,1,2,3].map(i => fetch(`/api/upload/offers?index=${i}`, { method: 'DELETE' })));
            setPreviews(new Array(4).fill(null));
            setFiles(new Array(4).fill(null));
          }}
          className="px-4 py-1.5 rounded-full border border-gray-200 text-[10px] font-black text-gray-400 uppercase hover:bg-gray-50"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            {/* Preview */}
            <div
              onClick={() => inputRefs.current[i]?.click()}
              className="relative w-full aspect-[16/9] rounded-xl overflow-hidden cursor-pointer
                bg-gray-50 border-2 border-dashed border-gray-200 hover:border-navy/30 group transition-all flex items-center justify-center"
            >
              <input
                ref={el => { inputRefs.current[i] = el; }}
                type="file" accept={ACCEPTED_IMG} className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f, i); }}
              />
              {previews[i]
                ? <img src={previews[i]!} alt="" className="w-full h-full object-cover" />
                : (
                  <div className="flex flex-col items-center gap-1 text-gray-300">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 15l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Drop image</p>
                  </div>
                )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 bg-black/40 px-3 py-1 rounded-full">REPLACE</span>
              </div>
              <span className="absolute top-2 left-2 bg-black/40 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                SLIDE {i + 1}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => save(i)}
                disabled={!files[i]}
                className="flex-1 text-[10px] bg-gradient-to-r from-rose-400 to-pink-500 text-white py-1.5 rounded-full font-black shadow-sm disabled:opacity-30 transition-all"
              >
                {saving === i ? '…' : 'SAVE'}
              </button>
              <button
                onClick={() => reset(i)}
                className="text-[10px] text-gray-300 hover:text-red-400 font-black px-2 transition-colors"
              >
                RESET
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Latest Collections Editor ─────────────────────────────── */
const COLLECTION_DEFAULTS = [
  '/images/collections/latest_1.webp',
  '/images/collections/latest_2.webp',
  '/images/collections/latest_3.webp',
];
const COLLECTION_LABELS = ['Left Card', 'Center Card (Featured)', 'Right Card'];

function CollectionsEditor() {
  const [files,    setFiles]    = useState<(File | null)[]>(new Array(3).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(new Array(3).fill(null));
  const [btnLink,  setBtnLink]  = useState('#');
  const [saving,   setSaving]   = useState<number | null>(null);
  const [msg,      setMsg]      = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetch('/api/upload/collections').then(r => r.json()).then((d: { slots: (string|null)[], btnLink?: string }) => {
      if (d.slots) setPreviews(new Array(3).fill(null).map((_, i) => d.slots[i] ? `/uploads/${d.slots[i]}` : null));
      if (d.btnLink) setBtnLink(d.btnLink);
    });
  }, []);

  const loadFile = (f: File, i: number) => {
    setPreviews(prev => { const n = [...prev]; n[i] = URL.createObjectURL(f); return n; });
    setFiles(prev    => { const n = [...prev]; n[i] = f; return n; });
  };

  const save = async (i: number) => {
    if (!files[i]) return;
    setSaving(i);
    const fd = new FormData();
    fd.append('file', files[i]!);
    fd.append('index', String(i));
    fd.append('btnLink', btnLink);
    await fetch('/api/upload/collections', { method: 'POST', body: fd });
    setFiles(prev => { const n = [...prev]; n[i] = null; return n; });
    setSaving(null);
    setMsg('Saved!'); setTimeout(() => setMsg(''), 2000);
  };

  const reset = async (i: number) => {
    if (!confirm(`Reset ${COLLECTION_LABELS[i]} to default?`)) return;
    await fetch(`/api/upload/collections?index=${i}`, { method: 'DELETE' });
    setPreviews(prev => { const n = [...prev]; n[i] = null; return n; });
    setFiles(prev    => { const n = [...prev]; n[i] = null; return n; });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-coral to-pink-400" />
          <h2 className="text-xl font-display font-bold text-navy uppercase tracking-widest">Latest Collections</h2>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs text-green-500 font-bold">{msg}</span>}
          <button
            onClick={async () => {
              if (!confirm('Reset all collection slots to defaults?')) return;
              await Promise.all([0,1,2].map(i => fetch(`/api/upload/collections?index=${i}`, { method: 'DELETE' })));
              setPreviews(new Array(3).fill(null));
              setFiles(new Array(3).fill(null));
            }}
            className="px-4 py-1.5 rounded-full border border-gray-200 text-[10px] font-black text-gray-400 uppercase hover:bg-gray-50"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Button link */}
      <div className="flex items-center gap-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider shrink-0">Browse Button Link</label>
        <input value={btnLink} onChange={e => setBtnLink(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-coral bg-white flex-1" />
      </div>

      {/* 3 image slots */}
      <div className="grid grid-cols-3 gap-5 items-end">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{COLLECTION_LABELS[i]}</p>
            <div
              onClick={() => inputRefs.current[i]?.click()}
              className="relative w-full rounded-xl overflow-hidden cursor-pointer bg-gray-50
                border-2 border-dashed border-gray-200 hover:border-coral/50 group transition-all
                flex items-center justify-center"
              style={{ aspectRatio: '16/10' }}
            >
              <input
                ref={el => { inputRefs.current[i] = el; }}
                type="file" accept={ACCEPTED_IMG} className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f, i); }}
              />
              {previews[i]
                ? <img src={previews[i]!} alt="" className="w-full h-full object-cover" />
                : (
                  <div className="flex flex-col items-center gap-1 text-gray-300">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 15l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Drop image</p>
                  </div>
                )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 bg-black/40 px-3 py-1 rounded-full">REPLACE</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => save(i)} disabled={!files[i]}
                className="flex-1 text-[10px] bg-gradient-to-r from-coral to-pink-400 text-white py-1.5 rounded-full font-black shadow-sm disabled:opacity-30 transition-all">
                {saving === i ? '…' : 'SAVE'}
              </button>
              <button onClick={() => reset(i)}
                className="text-[10px] text-gray-300 hover:text-red-400 font-black px-2 transition-colors">
                RESET
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
