import React from "react";
import Image from "next/image";

const team = [
  { name: "Saim", email: "k230708@nu.edu.pk", desc: "Lead Developer & Logic", avatar: "/avatar.jpg" },
  { name: "Fatimah", email: "k230687@nu.edu.pk", desc: "UI/UX & Documentation" },
  { name: "Meghna", email: "k230507@nu.edu.pk", desc: "Testing & Research" },
];

const colors = ["bg-blue-400", "bg-pink-400", "bg-yellow-400"];

const AboutTeamSection = () => (
  <section className="relative py-20 bg-transparent" id="about-team">
    <div className="max-w-3xl mx-auto px-4 relative z-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-700 mb-10 animate-fade-in underline-animate" style={{fontFamily: 'var(--font-main)'}}>Meet the Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, i) => (
          <div key={member.email} className="flex flex-col items-center text-center p-7 bg-white rounded-2xl shadow-lg border-2 border-black transition-all hover:scale-105 hover:shadow-2xl animate-slide-in-up" style={{animationDelay: `${i * 0.18 + 0.2}s`}}>
            {member.avatar ? (
              <div className={`w-auto rounded-full overflow-hidden mb-4 shadow-lg ${member.name === "Saim" ? "cursor-not-allowed" : ""}`}>
                <Image 
                  src={member.avatar}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg ${colors[i % colors.length]}`}>
                {member.name[0]}
              </div>
            )}
            <h3 className="text-xl font-extrabold mb-1 tracking-tight uppercase text-blue-900 underline-animate">{member.name}</h3>
            <a href={`mailto:${member.email}`} className="text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline break-all mb-2">{member.email}</a>
            <span className="text-xs bg-black text-white px-3 py-1 rounded mb-2">{member.desc}</span>
          </div>
        ))}
      </div>
    </div>
    <style jsx>{`
      @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slide-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fade-in 1s ease-out; }
      .animate-slide-in-up { animation: slide-in-up 1s cubic-bezier(.55,1.4,.38,.95); }
    `}</style>
  </section>
);

export default AboutTeamSection;