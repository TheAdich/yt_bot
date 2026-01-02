'use client';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F9FAF4] text-[#4A6163] px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-10">

        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
          Privacy Policy
        </h1>

        <p className="font-bold text-[#4A6163]/70">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">Overview</h2>
          <p className="font-bold text-[#4A6163]/80 leading-relaxed">
            YTShorts Automator by AD is a creator automation tool that helps users upload
            YouTube Shorts, generate voice-overs, and manage audio-video workflows.
            We respect your privacy and are committed to protecting your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">Information We Collect</h2>
          <ul className="list-disc pl-6 font-bold text-[#4A6163]/80 space-y-2">
            <li>Google account email and basic profile information</li>
            <li>YouTube channel access via Google OAuth</li>
            <li>Uploaded video metadata (title, description, visibility)</li>
            <li>Temporary media files for processing</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">How We Use Your Data</h2>
          <ul className="list-disc pl-6 font-bold text-[#4A6163]/80 space-y-2">
            <li>Authenticate users via Google OAuth</li>
            <li>Upload Shorts to your YouTube channel on your behalf</li>
            <li>Generate voice-overs using a self-hosted TTS engine</li>
            <li>Mix audio and video using FFmpeg</li>
            <li>Display upload status and basic analytics</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">Google API Usage</h2>
          <p className="font-bold text-[#4A6163]/80 leading-relaxed">
            YTShorts Automator by AD uses Google APIs strictly to upload videos and manage
            YouTube content. We do not read private user data beyond what is required
            for core functionality. We do not sell, rent, or share Google user data
            with third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">Data Storage & Security</h2>
          <p className="font-bold text-[#4A6163]/80 leading-relaxed">
            Media files are processed temporarily and are not stored permanently.
            Authentication tokens are securely stored and used only during active
            sessions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">User Control</h2>
          <p className="font-bold text-[#4A6163]/80 leading-relaxed">
            You may revoke Google access at any time from your Google Account
            permissions page. Upon revocation, the app will no longer have access
            to your YouTube account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">Contact</h2>
          <p className="font-bold text-[#4A6163]/80">
            If you have questions about this policy, contact the app owner via the
            official project repository or deployment platform.
          </p>
        </section>

      </div>
    </div>
  );
}
