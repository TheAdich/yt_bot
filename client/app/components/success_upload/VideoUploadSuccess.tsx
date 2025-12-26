import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadSuccess() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/library');
        }, 2500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="fixed inset-0 bg-[#4A6163]/90 backdrop-blur-sm flex items-center justify-center z-50">

            {/* RETRO POP-UP CARD */}
            <div className="relative bg-[#F9FAF4] border-4 border-[#F9A66C] p-10 rounded-3xl 
                    shadow-[12px_12px_0px_0px_#2d3b3c] flex flex-col items-center text-center max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">

                {/* Celebration burst (Pink Ring) */}
                <div className="absolute top-10 w-32 h-32 rounded-full bg-[#F17A7E] opacity-20 animate-ping" />

                {/* Check Icon - Styled as a Sticker */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-[#FFC94B] border-4 border-[#4A6163] 
                        flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#4A6163] animate-bounce">
                    <svg
                        className="w-12 h-12 text-[#4A6163]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4" // Thicker stroke for bold look
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1 className="text-4xl font-black uppercase tracking-tight text-[#4A6163] mb-2">
                    Hurray!
                </h1>

                <p className="text-lg font-bold text-[#4A6163]/80">
                    Video successfully uploaded
                </p>

                {/* Loading/Redirect Indicator */}
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#4A6163]/10 rounded-full">
                    <div className="w-2 h-2 bg-[#F17A7E] rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-[#F9A66C] rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-[#FFC94B] rounded-full animate-pulse delay-150" />
                    <p className="text-xs font-black uppercase tracking-widest text-[#4A6163] ml-2">
                        Redirecting...
                    </p>
                </div>
            </div>
        </div>
    );
}
