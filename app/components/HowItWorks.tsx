import React from "react";

const steps = [
  {
    icon: "🧮",
    title: "Input Expression",
    desc: "Type any arithmetic expression using variables, operators, and parentheses.",
  },
  {
    icon: "🤖",
    title: "PDA Validation",
    desc: "A Pushdown Automaton checks the syntax and parenthesis balance in real time.",
  },
  {
    icon: "🌳",
    title: "Parse Tree Generation",
    desc: "See a visual parse tree built from your expression, step by step.",
  },
  {
    icon: "🔍",
    title: "Trace Log",
    desc: "Follow every stack operation and decision with a detailed trace log.",
  },
];

const HowItWorks = () => (
  <section className="relative py-20 bg-transparent" id="how-it-works">
    <div className="max-w-4xl mx-auto px-4 relative z-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-10 animate-fade-in" style={{fontFamily: 'var(--font-main)'}}>How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={step.title} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg border border-blue-100 transition-all hover:scale-105 hover:shadow-2xl animate-slide-in-up" style={{animationDelay: `${i * 0.15 + 0.2}s`}}>
            <div className="text-5xl mb-4 animate-bounce-slow">{step.icon}</div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.desc}</p>
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

export default HowItWorks; 