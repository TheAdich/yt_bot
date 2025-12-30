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
import { json } from 'stream/consumers';


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


//Google Auth Setup
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = `https://yt-bot-aeit.onrender.com/auth/google/callback`;


const OAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
)




const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/userinfo.profile'
]

const authUrl = OAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
})




app.get('/auth/google', async (req, res) => {
    //console.log("REDIRECT_URI USED:", redirectUri);
    console.log("Auth URL:", authUrl);
    res.redirect(authUrl);
})

app.get('/auth/google/callback', async (req, res) => {
    try {
        const code = req.query.code;
        const token_object = await OAuth2Client.getToken(code);
        //console.log('token_object', token_object);
        OAuth2Client.setCredentials(token_object.tokens);
        const user_details = await google.oauth2({
            auth: OAuth2Client,
            version: 'v2',

        }).userinfo.get();
        //console.log('user_details', user_details.data);
        const check_user_query = `SELECT user_id FROM users WHERE user_id=$1`;
        const user_check_res = await pg.query(check_user_query, [user_details.data.id]);
        if (user_check_res.rowCount > 0) {
            //console.log('User already exists');
            const json_web_token = jwt.sign({ user_id: user_details.data.id, user_name: user_details.data.name }, process.env.JWT_SECRET);
            //update the access token and refresh token in the database
            const update_query = `UPDATE users SET access_token=$1, jwt_token=$2, refresh_token=$3, expiry_date=$4 WHERE user_id=$5`;
            const update_values = [token_object.tokens.access_token, json_web_token, token_object.tokens.refresh_token, token_object.tokens.expiry_date, user_details.data.id];
            const update_res = await pg.query(update_query, update_values);
            // return to the server with a success message
            //res.cookie('token', json_web_token, { httpOnly: true, secure: true, sameSite: 'none', path:'/' });
            return res.redirect(`https://yt-bot-five.vercel.app/dashboard?uuid=${json_web_token}`);
        }
        else {
            const insert_query = `INSERT INTO users (user_id,user_name,picture_url,access_token,jwt_token,refresh_token,expiry_date) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
            const values = [user_details.data.id, user_details.data.name, user_details.data.picture, token_object.tokens.access_token, json_web_token, token_object.tokens.refresh_token, token_object.tokens.expiry_date];
            const db_res = await pg.query(insert_query, values);
            if (db_res.rowCount > 0) {
                console.log('User details inserted successfully');
                const json_web_token = jwt.sign({ user_id: user_details.data.id, user_name: user_details.data.name }, process.env.JWT_SECRET);
                // return to the server with a success message
                //res.cookie('token', json_web_token, { httpOnly: true, secure: true, sameSite: 'none', path:'/' });
                return res.redirect(`https://yt-bot-five.vercel.app/dashboard?uuid=${json_web_token}`);
            }
            else {
                console.log('Failed to insert user details');
                throw new Error('Failed to insert user details');
            }
        }

    } catch (err) {
        console.log('Error during authentication', err);
        res.status(500).send('Authentication failed');
    }
})






async function refreshAccessToken(user_id) {
    try {
        const get_refresh_token_query = `SELECT refresh_token, expiry_date FROM users WHERE user_id=$1`;
        const values = [user_id];
        const db_res = await pg.query(get_refresh_token_query, values);
        if (db_res.rowCount === 0) {
            throw new Error('No user found');
        }
        else {
            const refresh_token = db_res.rows[0].refresh_token;
            const expiry_date = db_res.rows[0].expiry_date;
            //console.log(Date.now(), expiry_date,refresh_token);
            if (Date.now() < expiry_date) {
                console.log('Access token is still valid');
                return { access_token: db_res.rows[0].access_token, refresh_token: refresh_token, expiry_date: expiry_date };

            }
            else {
                await OAuth2Client.setCredentials({ refresh_token: refresh_token });
                const new_token = await OAuth2Client.refreshAccessToken();
                const update_query = `UPDATE users SET access_token=$1, expiry_date=$2 WHERE user_id=$3`;
                const update_values = [new_token.credentials.access_token, new_token.credentials.expiry_date, user_id];
                const update_res = await pg.query(update_query, update_values);
                console.log('update_res', update_res);
                if (update_res.rowCount === 0) {
                    throw new Error('Failed to update access token');
                }
                else {
                    return { access_token: new_token.credentials.access_token, refresh_token: refresh_token, expiry_date: new_token.credentials.expiry_date };
                }
            }
        }
    } catch (err) {
        console.log('Error refreshing token', err);
    }
}

app.get('/', middleware,(req, res) => {
    res.send('Hello World!');
});

// get all the resources in cloudinary
app.get('/api/cloudinary_resources', middleware,async (req, res) => {
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

app.post('/api/upload_to_cloudinary', middleware,async (req, res) => {
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
            
           
           
            const { access_token, refresh_token, expiry_date } = await refreshAccessToken(user_id);
            OAuth2Client.setCredentials({ access_token, refresh_token, expiry_date });
            const youtubeInstance = new google.youtube({
                version: 'v3',
            })

            const cloudinary_video_upload = await cloudinary.uploader.upload(videoPath, {
                resource_type: 'video',
                folder: `youtube/uploads/created/user_${user_id}`
            })
            //console.log(cloudinary_video_upload);

            const video_upload_response = await youtubeInstance.videos.insert({
                auth: OAuth2Client,
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: video_title || 'Test Video Upload',
                        description: video_desc || 'This is a test video upload via YouTube API',
                        tags: ['shorts'],
                        categoryId: '22', // People & Blogs
                        defaultLanguage: 'en'
                    },
                    status: {
                        privacyStatus: 'public'
                    }
                },
                media: {
                    body: fs.createReadStream(videoPath)
                }
            })

            //console.log(video_upload_response.data);


            // add all the video details to the database
            const insert_video_query = `INSERT INTO videos (title,description,asset_id,youtube_id,secure_url,playback_url,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
            const insert_video_values = [video_title, video_desc, cloudinary_video_upload.asset_id, video_upload_response.data.id, cloudinary_video_upload.secure_url, cloudinary_video_upload.playback_url, user_id];
            const insert_video_res = await pg.query(insert_video_query, insert_video_values);
            if (insert_video_res.rowCount === 0) {
                console.log('Failed to insert video details to database');
                const status_update_query = `UPDATE videos SET video_status=$1 WHERE youtube_id=$2`;
                const status_update_values = ['failed', video_upload_response.data.id];
                const status_update_res = await pg.query(status_update_query, status_update_values);
                if (status_update_res.rowCount === 0) {
                    console.log('Failed to update video status to failed');
                }
                return res.status(500).json({ error: 'Some error occurred while inserting video details' });
            }
            else {
                const status_update_query = `UPDATE videos SET video_status=$1 WHERE youtube_id=$2`;
                const status_update_values = ['success', video_upload_response.data.id];
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


app.get('/api/get_user_collections',  middleware,async (req, res) => {
    try {
        
        const user_id = req.user;
        const get_collection_query = `SELECT title,asset_id,youtube_id,playback_url,created_at,video_status FROM videos WHERE user_id=$1 ORDER BY created_at DESC`
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
        //return res.status(500).json({ error: 'Internal Server Error' });
        throw err;
    }
}



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
       const ffmpegCommand = `ffmpeg -y -i "${video_url}" -i "${audio_file}" -filter_complex "[0:a]volume=0.3[bg];[1:a]volume=1.8[voice];[bg][voice]amix=inputs=2:dropout_transition=0[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 128k -shortest "${output}"`;






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
        console.log(err);

    }

}



app.listen(5000, () => {
    console.log('Server is running on port 5000');
})


