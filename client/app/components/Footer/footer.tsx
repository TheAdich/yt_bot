'use client';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#4A6163] bg-[#F9FAF4]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-[#4A6163]">

        <div className="space-y-4">
          <h3 className="text-2xl font-black uppercase">YTShorts Automator</h3>
          <p className="font-bold text-[#4A6163]/70 leading-relaxed">
            Automating YouTube Shorts uploads, voice-overs, and audio-video workflows
            for modern creators.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-black uppercase tracking-widest">Product</h4>
          <ul className="space-y-2 font-bold">
            <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link href="/privacy_policy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-black uppercase tracking-widest">Legal</h4>
          <p className="font-bold text-[#4A6163]/70">
            This app uses Google OAuth for authentication and follows Google API
            Services User Data Policy.
          </p>
        </div>

      </div>

      <div className="border-t-4 border-[#4A6163] font-bold text-[#4A6163]/70 text-center py-6 tracking-widest text-sm">
        © {new Date().getFullYear()} AD — All Rights Reserved
      </div>
    </footer>
  );
}
