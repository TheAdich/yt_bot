const ServerStatusList = () => {
    
    const steps = [
        "1. Audio Processing (TTS)",
        "2. Video Processing",
        "3. Uploading to CDN",
        "4. Finalizing"
    ];

    return (
        /* POSITIONING: Fixed top-right */
        <div className="fixed top-24 right-10 z-50 w-72">
            
            {/* CARD CONTAINER: Cream BG, Thick Dark Border, Hard Shadow */}
            <div className="bg-[#F9FAF4] border-4 border-[#4A6163] rounded-xl shadow-[8px_8px_0px_0px_rgba(74,97,99,0.3)] overflow-hidden">
                
                {/* HEADER: Orange Background */}
                <div className="bg-[#F9A66C] p-4 border-b-4 border-[#4A6163] flex flex-col gap-1">
                    <h3 className="text-[#4A6163] font-black uppercase text-lg leading-none tracking-tight">
                        Server Tasks
                    </h3>
                    <div className="flex items-center gap-2">
                        {/* Little spinner animation (CSS only) */}
                        <div className="w-3 h-3 border-2 border-[#4A6163] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[#4A6163] font-bold text-xs uppercase tracking-wide animate-pulse">
                            Please wait...
                        </p>
                    </div>
                </div>

                {/* STEPS LIST */}
                <div className="p-5 bg-[#F9FAF4]">
                    <ul className="space-y-3">
                        {steps.map((step, index) => (
                            <li key={index} className="flex items-center gap-3 opacity-80">
                                {/* Geometric Bullet Point */}
                                <div className="w-2 h-2 bg-[#4A6163] transform rotate-45"></div>
                                
                                <span className="text-[#4A6163] text-xs font-bold font-mono uppercase tracking-tight">
                                    {step}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* DECORATIVE FOOTER */}
                <div className="bg-[#4A6163] h-2 w-full"></div>
            </div>
        </div>
    );
};

export default ServerStatusList;