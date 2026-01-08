import { exec } from 'child_process';
import { writeFile, mkdir, unlink, rm } from 'fs/promises'
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { google } from 'googleapis';
import pg from './db.js'
import jwt from 'jsonwebtoken';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';
import middleware from './middleware.js';
import bcrypt from 'bcrypt'
import { v4 } from 'uuid';


//Setting up the server
dotenv.config();

const app = express();


app.use(cors({
    origin: ['http://localhost:3000', 'https://yt-bot-five.vercel.app'],
    METHODS: ['POST', 'GET'],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))




//setting up the cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.post('/api/register', async (req, res) => {
    try {
        const { user_name, user_password } = req.body;
        //console.log(user_name, user_password);
        if (!user_name || !user_password) {
            return res.status(400).json({ message: "Fill Credentials Completely" });
        }
        const checkUserQuery = `SELECT user_name, jwt_token, user_password from users where user_name=$1`;
        const IfUserExists = await pg.query(checkUserQuery, [user_name]);
        if (IfUserExists.rowCount > 0) {
            return res.status(500).json({ message: "User Already Exists" });
        }
        else {
            //Check password match

            const hashedPassword = await bcrypt.hash(user_password, 10);

            const uniqueId = v4();
            //console.log('Generated Unique ID:', uniqueId);
            const token = jwt.sign({ uniqueId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const insertUserQuery = `INSERT INTO users (user_id,user_name, user_password, jwt_token) VALUES ($1,$2,$3,$4)`;
            const insertUserValues = [uniqueId, user_name, hashedPassword, token];
            const insertUserResult = await pg.query(insertUserQuery, insertUserValues);
            if (insertUserResult.rowCount === 1) {

                return res.status(201).json({ message: "User Registered Successfully", token });
            }
            else {

                return res.status(500).json({ message: "Some Error Occurred" });
            }

        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { user_name, user_password } = req.body;
        if (!user_name || !user_password) {
            return res.status(400).json({ message: "Fill Credentials Completely" });
        }
        const fetchUserQuery = `SELECT user_id, user_name, user_password from users where user_name=$1`;
        const userResult = await pg.query(fetchUserQuery, [user_name]);
        if (userResult.rowCount === 0) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const user = userResult.rows[0];
        const passwordMatch = await bcrypt.compare(user_password, user.user_password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const updateTokenQuery = `UPDATE users SET jwt_token=$1 WHERE user_name=$2`;
        const updateTokenResult = await pg.query(updateTokenQuery, [token, user_name]);
        if (updateTokenResult.rowCount === 1) {
            return res.status(200).json({ message: "Login Successful", token });
        }
        else {
            return res.status(500).json({ message: "Some Error Occurred" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
})



app.get('/', middleware, (req, res) => {
    res.send('Hello World!');
});

// get all the resources in cloudinary
app.get('/api/cloudinary_resources', middleware, async (req, res) => {
    try {


        const user_id = req.user;
        const resources = await cloudinary.api.resources({
            resource_type: 'video',
            type: 'upload',
            prefix: ['youtube/system/uploads', `youtube/uploads/user_${user_id}`],
            max_results: 500
        })
        //console.log('cloudinary resources', resources);
        const filteredResources = resources.resources.map((e) => {
            return {
                display_name: e.display_name,
                url: e.url
            }
        })
        //console.log(filteredResources.length);
        return res.status(200).json({ resources: filteredResources });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unable to fetch videos from server' });
    }
});

app.post('/api/upload_to_cloudinary', middleware, async (req, res) => {
    try {
        if (!req.files || !req.files.user_video_upload) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        //console.log('req.files', req.files);
        const videoFile = req.files.user_video_upload;
        console.log("Received file:", videoFile);



        const user_id = req.user;
        const uploadResult = await cloudinary.uploader.upload(
            videoFile.tempFilePath,
            {
                resource_type: 'video',
                folder: `youtube/uploads/user_${user_id}`
            }
        );

        //console.log(uploadResult);

        return res.status(200).json({
            message: 'File uploaded successfully',
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


//post request to add script to video
app.post('/api/add_script', middleware, async (req, res) => {

    try {
        
        const { scripts, video_url, video_title, video_desc } = req.body;
        //const token = req.cookies.token;
        const user_id = req.user;
        //console.log(scripts);
        const audio_file = await add_voice_to_video(scripts, user_id);
        if (!audio_file) {
            return res.status(500).json({ error: 'Failed to generate audio file' });
        }

        const videoPath = await add_script_to_video(audio_file, video_url, user_id);
        //console.log('videoPath in add_script_function', videoPath);
        if (videoPath) {
            //console.log('Video path:', videoPath);





            const cloudinary_video_upload = await cloudinary.uploader.upload(videoPath, {
                resource_type: 'video',
                folder: `youtube/uploads/created/user_${user_id}`
            });


            const insert_video_query = `INSERT INTO videos (title,description,asset_id,secure_url,playback_url,user_id) VALUES ($1,$2,$3,$4,$5,$6)`;
            const insert_video_values = [video_title, video_desc, cloudinary_video_upload.asset_id, cloudinary_video_upload.secure_url, cloudinary_video_upload.playback_url, user_id];
            const insert_video_res = await pg.query(insert_video_query, insert_video_values);
            if (insert_video_res.rowCount === 0) {
                console.log('Failed to insert video details to database');
                const status_update_query = `UPDATE videos SET video_status=$1 WHERE asset_id=$2`;
                const status_update_values = ['failed', cloudinary_video_upload.asset_id];
                const status_update_res = await pg.query(status_update_query, status_update_values);
                if (status_update_res.rowCount === 0) {
                    console.log('Failed to update video status to failed');
                }
                return res.status(500).json({ error: 'Some error occurred while inserting video details' });
            }
            else {
                const status_update_query = `UPDATE videos SET video_status=$1 WHERE asset_id=$2`;
                const status_update_values = ['success', cloudinary_video_upload.asset_id];
                const status_update_res = await pg.query(status_update_query, status_update_values);
                if (status_update_res.rowCount === 0) {
                    console.log('Failed to update video status to success');
                }
                else {
                    console.log('Video details inserted to database successfully');
                }
            }
            await unlink(videoPath).catch((err) => { console.log('Error deleting video file', err) });
            await unlink(audio_file).catch((err) => { console.log('Error deleting audio file', err) });
            return res.status(200).json({ message: 'Video file edited successfully' });

        }
        else {
            return res.status(500).json({ error: 'Failed to edit video file' });
        }


    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.get('/api/get_user_collections', middleware, async (req, res) => {
    try {

        const user_id = req.user;
        const get_collection_query = `SELECT title,asset_id,playback_url,created_at,video_status FROM videos WHERE user_id=$1 ORDER BY created_at DESC`
        const values = [user_id];
        const get_collection_result = await pg.query(get_collection_query, values);
        if (get_collection_result.rowCount === 0) {
            return res.status(200).json({ collections: [] });
        }
        else {
            return res.status(200).json({ collections: get_collection_result.rows });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})




async function add_voice_to_video(scripts, user_id) {
    try {
        await mkdir('./temp_script_audio', { recursive: true });


        const video_script = scripts.join('\n');
        //console.log('video_script', video_script);
        const piper_res = await fetch('https://piper-tts-v1.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: video_script
            })
        })
        const timestamp = new Date()
            .toISOString()
            .replace(/:/g, '-')
            .replace('T', '_')
            .split('.')[0];
        //console.log('piper_res', piper_res);
        const audioBuffer = await piper_res.arrayBuffer();
        const audio_file = `./temp_script_audio/${timestamp}_${user_id}.wav`;
        await writeFile(audio_file, Buffer.from(audioBuffer));
        return path.resolve(audio_file);
    } catch (err) {
        console.log('Piper TTS test error', err);
        await rm('./temp_script_audio', { recursive: true, force: true });
        //return res.status(500).json({ error: 'Internal Server Error' });
        throw err;
    }
}


const hasAudio = (video) =>
    new Promise((resolve) => {
        exec(
            `ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "${video}"`,
            (err, stdout) => resolve(stdout.trim().length > 0)
        )
    });



async function add_script_to_video(audio_file, video_url, user_id) {
    try {
        //console.log(audio_file);
        // ensure folders
        await mkdir('./results', { recursive: true });
        await mkdir('./temp_script_video', { recursive: true });

        // timestamp
        const timestamp = new Date()
            .toISOString()
            .replace(/:/g, '-')
            .replace('T', '_')
            .split('.')[0];

        const output = `./results/${timestamp}_${user_id}.mp4`;


        // FFmpeg command
        const audioExists = await hasAudio(video_url);
        const ffmpegCommand = audioExists
            ? `ffmpeg -i "${video_url}" -i "${audio_file}" -filter_complex "[0:a][1:a]amix=inputs=2:dropout_transition=0[a]" -map 0:v:0 -map "[a]" -c:v copy -c:a aac "${output}"`
            : `ffmpeg -i "${video_url}" -i "${audio_file}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac "${output}"`;


        console.log('Running FFmpeg...');

        const resolvedPath = await new Promise((resolve, rejects) => {
            exec(ffmpegCommand, async (error, stdout, stderr) => {
                if (error) {
                    console.error('FFmpeg failed');
                    console.error(stderr);
                    rejects(error);
                }



                //console.log('Video created:', output);
                resolve(path.resolve(output));
            });


        })

        return resolvedPath;

    } catch (err) {
        await rm('./results', { recursive: true, force: true });
        await rm('./temp_script_video', { recursive: true, force: true });
        console.log(err);

    }

}

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})


