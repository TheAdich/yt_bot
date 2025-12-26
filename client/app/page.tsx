'use client';
import React from "react";
import axios from "axios";

export default function LandingPage() {


  function handleSubmit() {
    window.location.href = 'https://yt-bot-aeit.onrender.com/auth/google';
  }


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F9FAF4] text-[#4A6163] selection:bg-[#F9A66C] selection:text-[#4A6163] font-sans">

      {/* --- Geometric Background Art --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Right Orange Circle */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-[#F9A66C] opacity-20 blur-3xl" />
        {/* Bottom Left Pink Circle */}
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-[#F17A7E] opacity-20 blur-3xl" />
        {/* Yellow Accent (Abstract Shape) */}
        <div className="absolute top-[40%] right-[10%] w-64 h-64 bg-[#FFC94B] rounded-full opacity-30 blur-2xl animate-pulse" />
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 flex flex-col items-center px-6 py-20">

        {/* Title Section */}
        <div className="max-w-5xl text-center space-y-6">
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9]">
            <span className="block text-[#4A6163]">Shorts</span>
            <span className="block text-[#F9A66C]">Manager</span>
          </h1>

          <p className="text-xl md:text-2xl font-bold text-[#4A6163]/70 leading-relaxed max-w-2xl mx-auto mt-6">
            A tool for the <span className="text-[#F17A7E] underline decoration-4 decoration-[#F17A7E]/30">modern creator</span>.
            Batch upload, track performance, and stream your workflow.
          </p>
        </div>

        {/* Preview Area (Retro Monitor/Card Style) */}
        <div className="mt-20 w-full max-w-4xl h-80 rounded-3xl border-4 border-[#4A6163] bg-[#F9FAF4] shadow-[16px_16px_0px_0px_#4A6163] flex items-center justify-center group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
          {/* Fake UI Elements for "Wireframe" look */}
          <div className="absolute top-0 left-0 w-full h-12 border-b-4 border-[#4A6163] bg-[#FFC94B] flex items-center px-4 gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#4A6163] bg-[#F17A7E]"></div>
            <div className="w-4 h-4 rounded-full border-2 border-[#4A6163] bg-[#F9FAF4]"></div>
            <div className="w-4 h-4 rounded-full border-2 border-[#4A6163] bg-[#F9FAF4]"></div>
          </div>

          <div className="text-center mt-8">
            <div className="w-20 h-20 mx-auto bg-[#4A6163] rounded-full flex items-center justify-center mb-4 text-[#F9FAF4] group-hover:scale-110 transition-transform duration-300 shadow-[4px_4px_0px_0px_#F9A66C]">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <p className="text-[#4A6163] font-black uppercase tracking-widest">Dashboard Preview</p>
          </div>
        </div>

        {/* Features Grid - Pop Art Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
          {[
            {
              title: "Bulk Uploads",
              desc: "Upload 20–30 Shorts consistently just like YouTube Studio bulk tools.",
              color: "bg-[#F9A66C]", // Orange
              num: "01"
            },
            {
              title: "Smart Scheduling",
              desc: "Schedule Shorts publishing exactly like YouTube’s native scheduler.",
              color: "bg-[#FFC94B]", // Yellow
              num: "02"
            },
            {
              title: "Deep Analytics",
              desc: "Track impressions, retention, and engagement in a modern dashboard.",
              color: "bg-[#F17A7E]", // Pink
              num: "03"
            }
          ].map((feature, idx) => (
            <div key={idx} className={`relative p-8 rounded-2xl border-4 border-[#4A6163] ${feature.color} 
                                       text-[#4A6163] transition-all duration-300 hover:-translate-y-2 
                                       hover:shadow-[12px_12px_0px_0px_#4A6163] group`}>

              <div className="absolute -top-6 -left-6 text-6xl font-black text-[#4A6163] opacity-20 group-hover:scale-110 transition-transform">
                {feature.num}
              </div>

              <h3 className="text-2xl font-black uppercase mb-4 relative z-10">{feature.title}</h3>
              <p className="font-bold text-[#4A6163]/80 leading-snug relative z-10">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button onClick={handleSubmit} className="mt-24 px-16 py-6 rounded-2xl bg-[#4A6163] text-[#F9FAF4] 
                                                  font-black text-2xl uppercase tracking-widest border-4 border-transparent
                                                  hover:bg-[#F17A7E] hover:text-[#4A6163] hover:border-[#4A6163]
                                                  hover:shadow-[12px_12px_0px_0px_#4A6163] hover:-translate-y-2 
                                                  transition-all duration-200 cursor-pointer">
          Get Started
        </button>

      </div>

    </div>
  );
} 