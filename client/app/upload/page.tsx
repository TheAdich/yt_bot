'use client'
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ServerStatusList from '../components/uploading_status/uploading_status';
import Loading from '../components/loader/loading';
import { Navbar } from '../components/Navbar/navbar';
import UploadSuccess from '../components/success_upload/VideoUploadSuccess';

export default function Upload() {
    const [videoList, setVideoList] = useState<Array<{ display_name: string, url: string }>>([]);
    const [selectedVideo, setSelectedVideo] = useState<{ index: Number, display_name: string, url: string } | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [scriptContent, setScriptContent] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDesc, setVideoDesc] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshVideoList, setRefreshVideoList] = useState(false);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [VideoUploadComponent, setVideoUploadComponent] = useState<boolean>(false);
    useEffect(() => {
        const fetchVideoLists = async () => {
            try {
                setLoading(true);
                const res = await axios.get('https://yt-bot-aeit.onrender.com/api/cloudinary_resources', {
                    withCredentials: true,
                });
                console.log(res.data.resources);
                setVideoList(res.data.resources);

            } catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
                setRefreshVideoList(false);
            }
        }
        fetchVideoLists();
    }, [refreshVideoList])

    const handleVideoSelect = (video: { index: Number, display_name: string, url: string }) => {
        setSelectedVideo(video);
    }

    const handleScriptSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedVideo === null) {
                alert("Please select a video first!");
                return;
            }
            setIsUploading(true);
            const scriptArray = scriptContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            //console.log("Script to submit:", scriptArray);
            //console.log(videoTitle, videoDesc);
            const res = await axios.post('https://yt-bot-aeit.onrender.com/api/add_script', {
                scripts: scriptArray,
                video_url: selectedVideo.url,
                video_title: videoTitle,
                video_desc: videoDesc,
            }, {
                withCredentials: true,

            });
            //console.log("Script submitted successfully:", res.data);
            //console.log("Script to submit:", scriptArray);
            setVideoUploadComponent(true);
        } catch (err) {
            console.error("Error submitting script:", err);
        }
        finally {
            setIsUploading(false);
        }
    }

    const uploadVideoToCloudinary = async (file: File) => {
        //console.log(file);
        const formData = new FormData();
        formData.append("user_video_upload", file);
        //console.log(formData);
        try {
            setIsVideoUploading(true);
            const res = await axios.post("https://yt-bot-aeit.onrender.com/api/upload_to_cloudinary", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            //console.log("Video uploaded to cloudinary:", res.data);
            if (res.status === 200) setVideoList((prev) => [...prev, { display_name: res.data.display_name, url: res.data.url }]);
        } catch (err) {
            console.log("Error uploading video to cloudinary:", err);
        }
        finally {
            setRefreshVideoList(true);
            setIsVideoUploading(false);
        }
    }


    return (
        <div className="flex min-h-screen bg-[#F9FAF4] text-[#4A6163] font-sans">

            <Navbar />

            <div className="flex-1 p-10">

                {/* HEADER: Bold & Uppercase */}
                <h2 className="text-4xl font-black uppercase tracking-tight text-[#F9A66C] mb-10">
                    Create a <span className="text-[#4A6163]">New Short</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT COLUMN: Inputs */}
                    <div className="flex flex-col space-y-8">

                        {/* Title Input */}
                        <div className="flex flex-col">
                            <label className="text-sm font-black uppercase tracking-wider text-[#4A6163] mb-2">Title</label>
                            <input
                                type="text"
                                onChange={(e) => setVideoTitle(e.target.value)}
                                className="w-full bg-white border-2 border-[#4A6163] rounded-xl p-4 outline-none 
                                   focus:border-[#F9A66C] focus:shadow-[4px_4px_0px_0px_#F9A66C] 
                                   transition-all placeholder:text-[#4A6163]/40 font-bold"
                                placeholder="ENTER THE TITLE..."
                            />
                        </div>

                        {/* Description Input */}
                        <div className="flex flex-col">
                            <label className="text-sm font-black uppercase tracking-wider text-[#4A6163] mb-2">Description</label>
                            <textarea
                                onChange={(e) => setVideoDesc(e.target.value)}
                                className="w-full h-28 bg-white border-2 border-[#4A6163] rounded-xl p-4 outline-none 
                                   focus:border-[#F9A66C] focus:shadow-[4px_4px_0px_0px_#F9A66C] 
                                   transition-all resize-none placeholder:text-[#4A6163]/40 font-medium"
                                placeholder="Write the description..."
                            />
                        </div>

                        {/* Script Input */}
                        <div className="flex flex-col">
                            <label className="text-sm font-black uppercase tracking-wider text-[#4A6163] mb-2">Script Content (Text to Audio)</label>
                            <textarea
                                onChange={(e) => setScriptContent(e.target.value)}
                                className="w-full h-[320px] bg-white border-2 border-[#4A6163] rounded-xl p-4 outline-none 
                                   focus:border-[#F9A66C] focus:shadow-[4px_4px_0px_0px_#F9A66C] 
                                   transition-all resize-none placeholder:text-[#4A6163]/40 font-mono text-sm"
                                placeholder="Write your script here..."
                            />
                        </div>

                        {/* Submit Button: Solid Dark Slate with Pink Hover */}
                        <button
                            onClick={handleScriptSubmission}
                            disabled={isUploading}
                            className={`mt-2 px-8 py-4 bg-[#4A6163] text-[#F9FAF4] font-black uppercase tracking-widest rounded-xl 
                               border-2 border-transparent hover:bg-[#F17A7E] hover:text-[#4A6163] hover:border-[#4A6163] 
                               hover:shadow-[4px_4px_0px_0px_#4A6163] hover:-translate-y-1 transition-all duration-200
                               ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isUploading ? "Submitting..." : "Submit Script"}
                        </button>

                    </div>

                    {/* RIGHT COLUMN: Video Selection */}
                    <div className="flex flex-col">

                        <label className="text-sm font-black uppercase tracking-wider text-[#4A6163] mb-3">Select Footage</label>

                        {/* Upload Trigger: Bright Yellow Card */}
                        <div className="mb-6">
                            <label className={` ${isVideoUploading ? "opacity-50 cursor-not-allowed" : ""} 
                                      flex items-center gap-3 cursor-pointer px-6 py-4 bg-[#FFC94B] 
                                      border-2 border-[#4A6163] rounded-xl transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#4A6163]`}>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    name='user_video_upload'
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        if (!file) return;
                                        uploadVideoToCloudinary(file);
                                    }}
                                />
                                {/* Icon placeholder if needed */}
                                <div className="w-8 h-8 rounded-full bg-[#4A6163] flex items-center justify-center text-[#FFC94B] font-bold text-xl">+</div>
                                <span className="text-[#4A6163] font-bold uppercase tracking-wide">
                                    {isVideoUploading ? "Uploading..." : "Upload from Device"}
                                </span>
                            </label>
                        </div>

                        {/* Video Grid */}
                        <div className="grid grid-cols-2 gap-5 h-[75vh] overflow-y-auto pr-2 pb-10">
                            {loading ? (
                                <Loading />
                            ) : (
                                videoList.map((vid, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleVideoSelect({ ...vid, index })}
                                        /* CARD STYLE: White bg, border. Selected = Pink Border & Shadow */
                                        className={`group rounded-xl p-3 cursor-pointer h-fit border-2 transition-all duration-200 
                                          ${selectedVideo?.index === index
                                                ? "border-[#F17A7E] bg-white shadow-[6px_6px_0px_0px_#F17A7E] -translate-y-1"
                                                : "border-[#4A6163]/20 bg-white hover:border-[#4A6163] hover:shadow-[4px_4px_0px_0px_#4A6163] hover:-translate-y-1"
                                            }`}
                                    >
                                        <div className="rounded-lg overflow-hidden border border-[#4A6163]/10">
                                            <video autoPlay={true} src={vid.url} muted className="w-full h-44 object-cover" />
                                        </div>

                                        <p className="text-sm font-bold text-[#4A6163] mt-3 truncate">{vid.display_name}</p>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewOpen(true);
                                                handleVideoSelect({ ...vid, index });
                                            }}
                                            className="mt-3 w-full py-2 bg-[#F9FAF4] border-2 border-[#4A6163] 
                                               text-[#4A6163] text-xs font-black uppercase rounded-lg 
                                               hover:bg-[#4A6163] hover:text-[#F9FAF4] transition-colors"
                                        >
                                            Preview
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>

                </div>

                {/* MODAL PREVIEW */}
                {previewOpen && selectedVideo && (
                    <div className="fixed inset-0 bg-[#4A6163]/90 backdrop-blur-sm flex items-center justify-center z-[999]">
                        {/* Modal Content: Cream BG, Thick Borders */}
                        <div className="bg-[#F9FAF4] p-6 rounded-2xl border-4 border-[#F9A66C] shadow-2xl w-[90%] max-w-lg relative">
                            <button
                                onClick={() => setPreviewOpen(false)}
                                className="absolute -top-4 -right-4 bg-[#F17A7E] text-[#4A6163] w-10 h-10 rounded-full 
                                   border-2 border-[#4A6163] font-black hover:scale-110 transition flex items-center justify-center"
                            >
                                ✕
                            </button>

                            <h3 className="text-xl font-black uppercase text-[#4A6163] mb-4">Preview Video</h3>

                            <div className="border-2 border-[#4A6163] rounded-xl overflow-hidden bg-black">
                                <video
                                    src={selectedVideo.url}
                                    controls
                                    autoPlay
                                    className="w-full h-[420px] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {VideoUploadComponent && <UploadSuccess />}


            </div>
            {isUploading && <ServerStatusList />}
        </div>
    )
}