import React from 'react';

export default function Loading() {
    return (
        <div className="flex items-center gap-3 p-2">
            {/* Loader Circle */}
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            {/* Text */}
            <span className="text-sm text-gray-300">Fetching details...</span>
        </div>

    )
}

