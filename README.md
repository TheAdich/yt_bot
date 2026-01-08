# 🎬 YT

YT is a simple automation tool that converts scripts into fully synced videos by generating voice-overs and merging them with video files.

## 🔁 Workflow
Script → Audio → Video


## ✨ Features
- Script to voice-over using self-hosted TTS
- Audio and video synchronization with FFmpeg
- Clean, minimal UI
- No uploads, no analytics, platform-agnostic output

## 🛠 Tech Stack
- Next.js, React, Tailwind CSS
- Node.js, Express, PostgreSQL
- FFmpeg, Open-source TTS
- JWT Authentication

## 📌 Status
Active development

## DB Setup
- Using any db your own prod/dev DB Create table command given below
- CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    jwt_token TEXT,
    user_password TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    expiry_date TIMESTAMPTZ DEFAULT (now() + INTERVAL '1 hour')

);
- CREATE TABLE videos (
    asset_id TEXT,
    secure_url TEXT,
    playback_url TEXT,
    user_id TEXT NOT NULL,
    video_status status,
    title TEXT DEFAULT 'Default',
    description TEXT DEFAULT 'Default',
    created_at TIMESTAMP DEFAULT now(),
    err_message TEXT
);


## Backend setup
- cd erver
- Create an .env file
- JWT_SECRET=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
DATABASE_URL=""
- npm install
- nodemon index

- ## Frontend setup
- cd client
- Create an .env file
- NEXT_PUBLIC_BACKEND_URL=""
- npm install
- npm run dev
