import React from "react";

function acceleratedScrollToValidator() {
  const target = document.getElementById("validator");
  if (!target) return;
  const startY = window.scrollY;
  const endY = target.getBoundingClientRect().top + window.scrollY - 24; // 24px offset for padding
  const distance = endY - startY;
  const duration = 900; // ms
  let startTime: number | null = null;

  function easeIn(t: number) {
    return t * t;
  }

  function animateScroll(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeIn(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

const HeroSection = () => (
  <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-50 animate-fade-in">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-pink-50/60 to-yellow-50/80 pointer-events-none" style={{zIndex:0}} />
    <div className="relative z-10 flex flex-col items-center justify-center gap-6 py-16 animate-fade-in" style={{animationDelay: '0.2s'}}>
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-900 drop-shadow-sm animate-slide-in-up cursor-default" style={{fontFamily: 'var(--font-main)', fontWeight: 800}}>PDA Expression Validator</h1>
      <p className="text-lg md:text-2xl text-blue-700 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.3s'}}>A beautiful, interactive tool to validate and visualize arithmetic expressions using a Pushdown Automaton.</p>
      <button
        onClick={acceleratedScrollToValidator}
        className="mt-6 inline-block px-8 py-3 bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-900 transition-all text-lg font-bold animate-bounce focus:outline-none focus:ring-4 focus:ring-blue-300"
        type="button"
      >
        Try It Now ↓
      </button>
    </div>
    {/* Parallax SVG blob */}
    <svg className="absolute -top-24 -left-32 w-[40vw] opacity-30 blur-2xl animate-float-slow" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{zIndex:0}}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <ellipse cx="200" cy="200" rx="200" ry="180" fill="#60a5fa" filter="url(#noise)" />
    </svg>
    {/* Fade-out at bottom for smooth transition */}
    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent to-yellow-50 pointer-events-none" style={{zIndex:2}} />
    <style jsx>{`
      @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slide-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes float-slow { 0% { transform: translateY(0); } 50% { transform: translateY(30px); } 100% { transform: translateY(0); } }
      .animate-fade-in { animation: fade-in 1s ease-out; }
      .animate-slide-in-up { animation: slide-in-up 1s cubic-bezier(.55,1.4,.38,.95); }
      .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
    `}</style>
  </section>
);

export default HeroSection; 