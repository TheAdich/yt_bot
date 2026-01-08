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

                <div className="bg-[#4A6163] text-[#F9FAF4]">
                    <Navbar />
                </div>

                <div className="flex-1 p-10">

                    {/* Header Section */}
                    <div className="mb-10">
                        <h1 className="text-6xl font-black tracking-tight uppercase leading-none text-[#F9A66C]">
                            Dash<span className="text-[#4A6163]">board</span>
                        </h1>
                        <p className="text-lg font-medium text-[#4A6163]/70 mt-2">
                            Script → Audio → Video Workflow
                        </p>
                    </div>

                    {/* Steps Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#4A6163] p-12 mb-10 shadow-xl">

                        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#F9A66C] opacity-20 blur-3xl"></div>
                        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-[#F17A7E] opacity-20 blur-3xl"></div>

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-4xl font-bold tracking-tight text-[#F9FAF4]">
                                How It Works
                            </h2>

                            <p className="text-[#F9FAF4]/80 max-w-xl text-lg leading-relaxed">
                                Follow these simple steps to convert your scripts into fully synced videos with voice-over:
                            </p>

                            {/* Workflow Steps Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                                <div className="group p-8 rounded-2xl bg-[#F9A66C] text-[#4A6163] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(74,97,99,0.2)]">
                                    <div className="mb-4 text-3xl font-black opacity-20">01</div>
                                    <h3 className="text-xl font-bold mb-3">Add Your Script</h3>
                                    <p className="text-[#4A6163]/80 font-medium text-sm leading-relaxed">
                                        Write or paste your video script into the editor to start the process.
                                    </p>
                                </div>

                                <div className="group p-8 rounded-2xl bg-[#FFC94B] text-[#4A6163] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(74,97,99,0.2)]">
                                    <div className="mb-4 text-3xl font-black opacity-20">02</div>
                                    <h3 className="text-xl font-bold mb-3">Generate Audio</h3>
                                    <p className="text-[#4A6163]/80 font-medium text-sm leading-relaxed">
                                        Convert your script into a natural-sounding voice-over using the TTS engine.
                                    </p>
                                </div>

                                <div className="group p-8 rounded-2xl bg-[#F17A7E] text-[#4A6163] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(74,97,99,0.2)]">
                                    <div className="mb-4 text-3xl font-black opacity-20">03</div>
                                    <h3 className="text-xl font-bold mb-3">Sync & Export Video</h3>
                                    <p className="text-[#4A6163]/80 font-medium text-sm leading-relaxed">
                                        Integrate the generated audio into your video and export it, ready to share.
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