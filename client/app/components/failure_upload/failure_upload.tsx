import { useRouter } from "next/navigation";

export default function UploadFailure() {
    const router = useRouter();

    return (
        <div onClick={() => router.back()} className="fixed inset-0 bg-[#6B2F2F]/90 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="relative bg-[#F9FAF4] border-4 border-[#F17A7E] p-10 rounded-3xl 
                    shadow-[12px_12px_0px_0px_#3b1f1f] flex flex-col items-center text-center max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">

                <div className="absolute top-10 w-32 h-32 rounded-full bg-[#F17A7E] opacity-20 animate-ping" />

                <div className="relative z-10 w-24 h-24 rounded-full bg-[#F17A7E] border-4 border-[#6B2F2F] 
                        flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#6B2F2F] animate-shake">
                    <svg
                        className="w-12 h-12 text-[#6B2F2F]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                <h1 className="text-4xl font-black uppercase tracking-tight text-[#6B2F2F] mb-2">
                    Oops!
                </h1>

                <p className="text-lg font-bold text-[#6B2F2F]/80">
                    Error reported
                </p>

                <p className="text-sm font-semibold text-[#6B2F2F]/70 mt-1">
                    Please try again later
                </p>

                <div className="mt-6 px-5 py-3 bg-[#6B2F2F]/10 rounded-full">
                    <p className="text-xs font-black uppercase tracking-widest text-[#6B2F2F]">
                        Click on this popup to go back...
                    </p>
                </div>
            </div>
        </div>
    );
}
