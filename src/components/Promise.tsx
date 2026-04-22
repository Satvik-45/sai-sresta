'use client';

const ITEMS = [
  {
    icon: (
      <div className="flex flex-col items-center justify-center leading-none">
        <span className="font-bold text-[22px]">300+</span>
        <span className="text-[8.5px] uppercase tracking-wider mt-1">Stores</span>
      </div>
    ),
    label: '125+ Cities Nationwide',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15l-3-3m0 0l3-3m-3 3h8M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
      </svg>
    ),
    label: '100% Certified Jewellery',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.5 12h15m-15 0l4.5-4.5m-4.5 4.5l4.5 4.5M19.5 12l-4.5-4.5m4.5 4.5l-4.5 4.5"/>
      </svg>
    ),
    label: 'Lifetime Exchange & Buyback',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    label: '30 Days Money Back',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="6"/>
        <path d="M20 20l-4-4"/>
      </svg>
    ),
    label: '100% Transparency',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 10v6h3m3 0h6m3 0h3v-4l-3-3h-4v7m-8 0a2 2 0 104 0m4 0a2 2 0 104 0M3 10V6h11v10"/>
      </svg>
    ),
    label: 'Free Shipping',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
      </svg>
    ),
    label: 'No Compromise On Ethics',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="14" r="5" />
        <path d="M10 9l2-4 2 4M6 14h1m10 0h1" />
      </svg>
    ),
    label: 'A world of designs',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    ),
    label: 'Personalised Video Consultations',
  }
];

export default function SriSrestaPromise() {
  return (
    <section className="bg-[#fffbfa] py-12 md:py-16 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 lg:pl-10 lg:pr-6 w-full flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Titling */}
        <div className="w-full lg:w-[45%] flex justify-start lg:justify-end pr-0 lg:pr-[140px] relative z-10 mb-12 lg:mb-0">
          <h2 className="text-[#032C5E] font-domine text-[42px] sm:text-[48px] lg:text-[80px] leading-[1.05] font-medium text-left lg:text-right relative">
            Sri Sresta<br />
            <span className="relative inline-flex items-center">
              Promis
              <span className="relative">
                e
              </span>
            </span>
          </h2>
        </div>

        {/* Right Info Box */}
        <div className="w-full lg:w-[55%] relative z-0">
          <div className="border border-[#032C5E]/60 rounded-[20px] bg-[#FFFBFA] px-[16px] py-[16px] md:px-[24px] md:py-[24px] lg:px-[28px] lg:py-[28px] relative overflow-hidden">
            
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-[32px] gap-x-[16px] relative z-20">
              {ITEMS.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  {/* Circle Icon - NO SHADOWS, NO ANIMATIONS */}
                  <div className="w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] shrink-0 bg-[#032C5E] text-white rounded-full flex flex-col items-center justify-center mb-4 [&_svg]:w-[32px] [&_svg]:h-[32px]">
                    {item.icon}
                  </div>
                  {/* Label */}
                  <h4 
                    className={`text-[#032C5E]/90 text-[13px] md:text-[14.5px] leading-tight font-medium mx-auto font-sans ${
                      item.label === 'Lifetime Exchange & Buyback' || item.label === 'Personalised Video Consultations' 
                      ? 'max-w-[160px] whitespace-normal' 
                      : 'w-full whitespace-normal lg:whitespace-nowrap'
                    }`}
                  >
                    {item.label}
                  </h4>
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
