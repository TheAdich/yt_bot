'use client'
import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar/navbar';
import { useSearchParams } from 'next/navigation'


export function DashboardPage() {
    let window_obj = null;
    const searchParams = useSearchParams();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window_obj = window;
            const uuid = searchParams.get('uuid');
            if (uuid) {
                window_obj?.localStorage.setItem('uuid', uuid)
            }
        }
    }, [])

    return (
        <React.Fragment>
            {/* CHANGED: Main background from black to Cream (#F9FAF4). 
               Text color changed to Dark Slate (#4A6163).
            */}
            <div className="flex min-h-screen bg-[#F9FAF4] text-[#4A6163] font-sans selection:bg-[#F9A66C] selection:text-[#4A6163]">

                {/* Navbar Wrapper - Assuming Navbar needs a contrasting background */}
                <div className="bg-[#4A6163] text-[#F9FAF4]">
                    <Navbar />
                </div>

                <div className="flex-1 p-10">

                    {/* Header Section - Added for the big bold typography feel */}
                    <div className="mb-10">
                        <h1 className="text-6xl font-black tracking-tight uppercase leading-none text-[#F9A66C]">
                            Dash<span className="text-[#4A6163]">board</span>
                        </h1>
                        <p className="text-lg font-medium text-[#4A6163]/70 mt-2">
                            Overview & Analytics
                        </p>
                    </div>

                    {/* FEATURE SECTION 
                       CHANGED: Removed dark gradients/borders. 
                       Used the Dark Slate (#4A6163) as the block background for high contrast.
                    */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#4A6163] p-12 mb-10 shadow-xl">

                        {/* Decorative Circle (Abstract Art Vibe) */}
                        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#F9A66C] opacity-20 blur-3xl"></div>
                        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-[#F17A7E] opacity-20 blur-3xl"></div>

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-4xl font-bold tracking-tight text-[#F9FAF4]">
                                Analytics Module <br />
                                <span className="text-[#FFC94B]">Coming Soon</span>
                            </h2>

                            <p className="text-[#F9FAF4]/80 max-w-xl text-lg leading-relaxed">
                                We are preparing detailed insights, audience analytics, performance heatmaps,
                                and automated growth tools. Stay tuned while we finish building this.
                            </p>

                            {/* GRID CARDS
                                CHANGED: Instead of uniform dark cards, I used the palette colors 
                                to create distinct, poster-like cards.
                            */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                                {/* Card 1 - Orange Accent */}
                                <div className="group p-8 rounded-2xl bg-[#F9A66C] text-[#4A6163] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(74,97,99,0.2)]">
                                    <div className="mb-4 text-3xl font-black opacity-20">01</div>
                                    <h3 className="text-xl font-bold mb-3">Upload Insights</h3>
                                    <p className="text-[#4A6163]/80 font-medium text-sm leading-relaxed">
                                        Track your upload performance and engagement metrics.
                                    </p>
                                </div>

                                {/* Card 2 - Yellow Accent */}
                                <div className="group p-8 rounded-2xl bg-[#FFC94B] text-[#4A6163] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(74,97,99,0.2)]">
                                    <div className="mb-4 text-3xl font-black opacity-20">02</div>
                                    <h3 className="text-xl font-bold mb-3">AI Suggest</h3>
                                    <p className="text-[#4A6163]/80 font-medium text-sm leading-relaxed">
                                        Personalized suggestions to grow your channel faster.
                                    </p>
                                </div>

                                {/* Card 3 - Pink Accent */}
                                <div className="group p-8 rounded-2xl bg-[#F17A7E] text-[#4A6163] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(74,97,99,0.2)]">
                                    <div className="mb-4 text-3xl font-black opacity-20">03</div>
                                    <h3 className="text-xl font-bold mb-3">Audience</h3>
                                    <p className="text-[#4A6163]/80 font-medium text-sm leading-relaxed">
                                        Monitor audience retention and viewer behaviors.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
}

export default DashboardPage;