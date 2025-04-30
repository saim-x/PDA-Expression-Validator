import React from "react";

const ModernFooter = () => (
  <footer className="relative w-full py-8 bg-transparent text-center animate-fade-in mt-12">
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-blue-900 font-semibold relative z-10">
      <span>&copy; {new Date().getFullYear()} PDA Expression Validator</span>
      <span className="hidden md:inline">|</span>
      <a href="https://github.com/saim-x" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-700 transition-colors">GitHub</a>
      <span className="hidden md:inline">|</span>
      <a href="mailto:k230708@nu.edu.pk" className="hover:underline hover:text-blue-700 transition-colors">Contact</a>
    </div>
    <div className="mt-2 text-xs text-blue-500 relative z-10">Real-world use: compiler frontend syntax validation.</div>
    <style jsx>{`
      @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      .animate-fade-in { animation: fade-in 1.2s ease-out; }
    `}</style>
  </footer>
);

export default ModernFooter; 