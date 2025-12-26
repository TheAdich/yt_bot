'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../components/loader/loading'
import { Navbar } from '../components/Navbar/navbar'

export default function Library() {
    const [userVideoList, setUserVideoList] = useState<Array<{
        title: string
        asset_id: string
        youtube_id: string
        playback_url: string
        video_status: string
        created_at: string
    }>>([])

    const [loading, setLoading] = useState<boolean>(false)

    const formateDate = (date: string) => {
        return new Date(date || Date.now()).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        })
    }

    useEffect(() => {
        const fetchUserUploadedVideo = async () => {
            try {
                setLoading(true)
                const res = await axios.get('http://localhost:5000/api/get_user_collections', {
                    withCredentials: true,
                })
                setUserVideoList(res.data.collections)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchUserUploadedVideo()
    }, [])

    return (
        <div className="flex min-h-screen bg-[#F9FAF4] text-[#4A6163] font-sans">

            <Navbar />

            <div className="flex-1 p-10">

                {/* Page Title */}
                <div className="mb-10">
                    <h2 className="text-4xl font-black uppercase tracking-tight text-[#4A6163]">
                        Your <span className="text-[#F17A7E]">Library</span>
                    </h2>
                </div>

                <div className="space-y-4">

                    {/* TABLE HEADER */}
                    <div className="grid grid-cols-12 text-sm font-black text-[#4A6163] uppercase border-b-4 border-[#4A6163] pb-4 tracking-widest">
                        <div className="col-span-1">#</div>
                        <div className="col-span-6">Title</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Preview</div>
                    </div>

                    {/* TABLE CONTENT */}
                    {loading ? (
                        <Loading />
                    ) : (
                        userVideoList.map((item, index) => (
                            <div
                                key={index}
                                /* ROW STYLE: White Card, Border, Hard Shadow on Hover */
                                className="grid grid-cols-12 items-center py-5 px-6 rounded-xl bg-white border-2 border-[#4A6163] 
                                   transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#4A6163] cursor-pointer group"
                            >
                                {/* Index Number - Styled as a bold accent */}
                                <div className="col-span-1 text-[#F9A66C] font-black text-xl opacity-50 group-hover:opacity-100 transition-opacity">
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>

                                {/* Title */}
                                <div className="col-span-6 flex items-center pr-4">
                                    <p className="font-bold text-[#4A6163] text-lg leading-tight group-hover:text-[#F17A7E] transition-colors line-clamp-1">
                                        {item.title}
                                    </p>
                                </div>

                                {/* Date */}
                                <div className="col-span-2 text-sm font-bold text-[#4A6163]/60 uppercase tracking-wide">
                                    {formateDate(item.created_at)}
                                </div>

                                {/* Status Badge - Retro Sticker Style */}
                                <div className="col-span-2">
                                    <span
                                        className={`text-xs font-black uppercase px-3 py-1.5 rounded-lg border-2 border-[#4A6163] shadow-[2px_2px_0px_0px_#4A6163] ${item.video_status === 'Uploaded'
                                                ? 'bg-[#bbf7d0] text-[#4A6163]' // Mint Green
                                                : item.video_status === 'Failed'
                                                    ? 'bg-[#F17A7E] text-white' // Palette Pink
                                                    : 'bg-[#FFC94B] text-[#4A6163]' // Palette Yellow
                                            }`}
                                    >
                                        {item.video_status}
                                    </span>
                                </div>

                                {/* Action Button */}
                                <div className="col-span-1 text-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`https://youtube.com/shorts/${item.youtube_id}`, '_blank');
                                        }}
                                        className="px-4 py-2 bg-[#F9FAF4] border-2 border-[#4A6163] rounded-lg 
                                           text-[#4A6163] font-black text-xs uppercase tracking-wide
                                           hover:bg-[#4A6163] hover:text-[#F9FAF4] transition-colors"
                                    >
                                        Open
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    )
}
