import React from "react";

const features = [
  {
    icon: "⚡",
    title: "Real-Time Validation",
    desc: "Instantly checks your expression as you type, highlighting errors and successes.",
  },
  {
    icon: "🌲",
    title: "Parse Tree Visualization",
    desc: "See a live, interactive parse tree for every valid expression.",
  },
  {
    icon: "📚",
    title: "Educational Trace Log",
    desc: "Step through every stack operation and decision for full transparency.",
  },
  {
    icon: "🎨",
    title: "Beautiful UI",
    desc: "Enjoy a sleek, modern interface with smooth animations and effects.",
  },
];

const FeaturesSection = () => (
  <section className="relative py-20 bg-transparent" id="features">
    <div className="max-w-5xl mx-auto px-4 relative z-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-pink-700 mb-10 animate-fade-in" style={{fontFamily: 'var(--font-main)'}}>Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {features.map((feature, i) => (
          <div key={feature.title} className="flex flex-col items-center text-center p-7 bg-white rounded-2xl shadow-lg border border-pink-100 transition-all hover:scale-105 hover:shadow-2xl animate-slide-in-up" style={{animationDelay: `${i * 0.15 + 0.2}s`}}>
            <div className="text-5xl mb-4 animate-bounce-slow">{feature.icon}</div>
            <h3 className="text-lg font-bold text-pink-700 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style jsx>{`
      @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slide-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      .animate-fade-in { animation: fade-in 1s ease-out; }
      .animate-slide-in-up { animation: slide-in-up 1s cubic-bezier(.55,1.4,.38,.95); }
      .animate-bounce-slow { animation: bounce-slow 2.5s infinite; }
    `}</style>
  </section>
);

export default FeaturesSection; 