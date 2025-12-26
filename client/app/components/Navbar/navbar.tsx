'use client'
import React from 'react'
import Link from 'next/link'

export function Navbar() {
    return (
        /* CONTAINER: 
           - Background: Dark Slate (#4A6163)
           - Border: Thick Orange (#F9A66C) right border for that "geometric print" look
        */
        <aside className="h-screen w-64 bg-[#4A6163] border-r-4 border-[#F9A66C] p-6 flex flex-col font-sans">
            
            {/* LOGO SECTION */}
            <div className="flex items-center gap-3 mb-12">
                {/* Replaced gradient with solid Yellow (#FFC94B) circle */}
                <div className="w-10 h-10 bg-[#FFC94B] rounded-full flex-shrink-0 border-2 border-[#F9FAF4]" />
                
                <h1 
                    onClick={() => window.location.href = '/'} 
                    className="cursor-pointer text-xl font-black uppercase leading-tight text-[#F9FAF4] tracking-wide"
                >
                    Shorts<br/>Manager
                </h1>
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="flex flex-col gap-4">
                <Link
                    href="/library"
                    /* HOVER STATE:
                       - Background becomes Pink (#F17A7E)
                       - Text becomes Dark Slate (#4A6163)
                       - Slight movement to the right (translate-x-1)
                    */
                    className="px-5 py-3 rounded-xl text-[#F9FAF4] font-bold border-2 border-transparent hover:bg-[#F17A7E] hover:text-[#4A6163] hover:border-[#4A6163] transition-all duration-200 hover:translate-x-1"
                >
                    Library
                </Link>

                <Link
                    href="/upload"
                    className="px-5 py-3 rounded-xl text-[#F9FAF4] font-bold border-2 border-transparent hover:bg-[#F17A7E] hover:text-[#4A6163] hover:border-[#4A6163] transition-all duration-200 hover:translate-x-1"
                >
                    Upload New
                </Link>
            </nav>

            {/* USER PROFILE SECTION - Bottom */}
            {/* Changed to a high-contrast "Card" look: Cream background, Dark Text */}
            <div className="mt-auto flex items-center gap-3 bg-[#F9FAF4] px-4 py-3 rounded-xl shadow-lg transform transition hover:-translate-y-1 cursor-pointer">
                {/* Avatar: Solid Orange */}
                <div className="w-8 h-8 bg-[#F9A66C] rounded-full border-2 border-[#4A6163]" />
                <span className="text-sm font-bold text-[#4A6163]">Alex Creator</span>
            </div>
        </aside>
    )
}