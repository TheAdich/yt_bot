'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import ServerStatusList from '../components/uploading_status/uploading_status';
import Loading from '../components/loader/loading';
import { Navbar } from '../components/Navbar/navbar';
import UploadSuccess from '../components/success_upload/VideoUploadSuccess';
import UploadFailure from '../components/failure_upload/failure_upload';


export default function Upload() {


    

    const recognition = useRef<SpeechRecognition>(null);
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
    const [showUploadFailure, setShowUploadFailure] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>('en-IN');
    const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false);
    const [showInterimTranscript, setShowInterimTranscript] = useState<string>("");








    useEffect(() => {
        const fetchVideoLists = async () => {
            try {
                if (typeof window !== 'undefined') {
                    setLoading(true);
                    //console.log(window_obj?.localStorage.getItem('uuid'));
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cloudinary_resources`, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': window ? window.localStorage.getItem('uuid') || '' : ''
                        },
                    });
                    //console.log(res.data.resources);
                    setVideoList(res.data.resources);
                }

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


    useEffect(() => {
        if (typeof window !== 'undefined') {
            recognition.current = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
            recognition.current.lang = language;
            recognition.current.interimResults = true;
            recognition.current.continuous = true;

            recognition.current!.onresult = function (event) {
                var interim_transcript = '';
                var final_transcript = '';

                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                        //console.log(scriptContent);
                        setScriptContent(prev => prev ? prev + " " + final_transcript : final_transcript);
                        setIsSpeechEnabled(false);
                        setShowInterimTranscript("");
                        recognition.current!.stop();
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                        setShowInterimTranscript(interim_transcript);
                        //setScriptContent(prev => prev ? prev + " " + interim_transcript : interim_transcript);
                    }
                }
                //console.log(interim_transcript, final_transcript);
            };

        }
    }, [])

    


    const handleVideoSelect = (video: { index: Number, display_name: string, url: string }) => {
        setSelectedVideo(video);
    }

    const handleScriptSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (typeof window !== 'undefined') {
                if (selectedVideo === null) {
                    alert("Please select a video first!");
                    return;
                }
                setIsUploading(true);
                const scriptArray = scriptContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                //console.log("Script to submit:", scriptArray);
                //console.log(videoTitle, videoDesc);
                console.log(window?.localStorage.getItem('uuid'));
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add_script`, {
                    scripts: scriptArray,
                    video_url: selectedVideo.url,
                    video_title: videoTitle,
                    video_desc: videoDesc,
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': window ? window.localStorage.getItem('uuid') || '' : ''
                    },

                });
                //console.log("Script submitted successfully:", res.data);
                //console.log("Script to submit:", scriptArray);
                if (res.status === 200) setVideoUploadComponent(true);
            }
        } catch (err) {
            console.error("Error submitting script:", err);
            setShowUploadFailure(true);
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
            if (typeof window !== 'undefined') {
                setIsVideoUploading(true);
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload_to_cloudinary`, formData, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': window ? window.localStorage.getItem('uuid') || '' : ''
                    },
                });
                //console.log("Video uploaded to cloudinary:", res.data);
                if (res.status === 200) setVideoList((prev) => [...prev, { display_name: res.data.display_name, url: res.data.url }]);
            }
        } catch (err) {
            console.log("Error uploading video to cloudinary:", err);
        }
        finally {
            setRefreshVideoList(true);
            setIsVideoUploading(false);
        }
    }

    //console.log(window.speechSynthesis.getVoices());






    function speechToggle(enable: boolean) {
        console.log("Speech recognition enabled:", enable);
        if (!enable) {
            recognition.current!.stop();
        }
        else {
            recognition.current!.start();
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
                            <p className='text-sm font-mono text-[#4A6163]'>Current language : {language === 'en-IN' ? 'English (India)' : 'Hindi (India)'}</p>
                            <button onClick={() => {
                                setLanguage(language === 'en-IN' ? 'hi-IN' : 'en-IN');
                                recognition.current!.lang = language === 'en-IN' ? 'hi-IN' : 'en-IN';
                            }} className='cursor-pointer mt-2  px-3 py-1 bg-[#4A6163] text-white rounded-md'>Change Language</button>
                            <textarea
                                onChange={(e) => setScriptContent(e.target.value)}
                                value={scriptContent + (isSpeechEnabled ? " " + showInterimTranscript : "")}
                                className="mt-2 w-full h-[320px] bg-white border-2 border-[#4A6163] rounded-xl p-4 outline-none 
                                   focus:border-[#F9A66C] focus:shadow-[4px_4px_0px_0px_#F9A66C] 
                                   transition-all resize-none placeholder:text-[#4A6163]/40 font-mono text-sm"
                                placeholder="Write your script here..."
                            />

                        </div>

                        {/* Voice Input Toggle */}
                        <div className="flex items-center gap-4">
                            {isSpeechEnabled ? (
                                <button onClick={() => {
                                    setIsSpeechEnabled(false);
                                    speechToggle(false);
                                }} className='px-5 py-3 bg-[#F17A7E] text-white font-black uppercase tracking-widest rounded-xl
                               border-2 border-transparent hover:bg-[#4A6163] hover:text-[#F9FAF4] hover:border-[#F9FAF4] 
                               hover:shadow-[4px_4px_0px_0px_#4A6163] hover:-translate-y-1 transition-all duration-200'>
                                    Disable Voice Input
                                </button>
                            ) : (
                                <button onClick={() => {
                                    setIsSpeechEnabled(true);
                                    speechToggle(true);
                                }} className='px-5 py-3 bg-[#4A6163] text-[#F9FAF4] font-black uppercase tracking-widest rounded-xl
                               border-2 border-transparent hover:bg-[#F17A7E] hover:text-[#4A6163] hover:border-[#4A6163] 
                               hover:shadow-[4px_4px_0px_0px_#4A6163] hover:-translate-y-1 transition-all duration-200'>
                                    Enable Voice Input
                                </button>
                            )}

                            {/* Submit Button: Solid Dark Slate with Pink Hover */}
                            <button
                                onClick={handleScriptSubmission}
                                disabled={isUploading}
                                className={`px-2 py-3 bg-[#4A6163] text-[#F9FAF4] font-black uppercase tracking-widest rounded-xl 
                               border-2 border-transparent hover:bg-[#F17A7E] hover:text-[#4A6163] hover:border-[#4A6163] 
                               hover:shadow-[4px_4px_0px_0px_#4A6163] hover:-translate-y-1 transition-all duration-200
                               ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isUploading ? "Submitting..." : "Submit Script"}
                            </button>
                        </div>



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
                {showUploadFailure && <UploadFailure />}


            </div>
            {isUploading && <ServerStatusList />}
        </div>
    )
}