import { NextRequest, NextResponse } from "next/server";
import { pipeline, read_audio } from "@huggingface/transformers";
import {WaveFile} from 'wavefile';
const { AudioContext, OfflineAudioContext } = require('node-web-audio-api');


import { nodewhisper } from 'nodejs-whisper'
import fs from "fs";
import path from "path";

import Groq from "groq-sdk";

const uploadDir = "/tmp/uploads"; // Temporary storage

export const config = { api: { bodyParser: false } }; // Disable default body parser

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type")?.includes("application/json")) {
    // Request to merge file
    const { fileName, merge } = await req.json();
    if (merge) {
      return NextResponse.json(await processAudio(fileName));
    }
  }

  // Handle chunk upload
  return await handleChunkUpload(req);
}

// Handle chunked file uploads
async function handleChunkUpload(req: NextRequest) {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const formData = await req.formData();
  const chunk = formData.get("chunk") as Blob;
  const fileName = formData.get("fileName") as string;
  const index = formData.get("index") as string;

  if (!chunk || !fileName || index === undefined) {
    return NextResponse.json({ error: "Missing chunk data" }, { status: 400 });
  }

  const chunkPath = path.join(uploadDir, `${fileName}.part${index}`);
  const buffer = Buffer.from(await chunk.arrayBuffer());

  fs.writeFileSync(chunkPath, buffer);
  return NextResponse.json({ message: `Chunk ${index} received` });
}

async function processAudio(fileName: string) {
  const finalPath = path.join(uploadDir, fileName);
  if (fs.existsSync(finalPath)) {
    return await transcribeWithGroq(finalPath);
  }
  const chunks = fs.readdirSync(uploadDir)
    .filter(f => f.startsWith(fileName))
    .sort((a, b) => parseInt(a.split(".part")[1]) - parseInt(b.split(".part")[1]));

  
  const fileStream = fs.createWriteStream(finalPath);

  chunks.forEach(chunk => {
    fileStream.write(fs.readFileSync(path.join(uploadDir, chunk)));
    fs.unlinkSync(path.join(uploadDir, chunk)); // Delete chunk after merging
  });

  fileStream.end();

  // Ensure the file is fully closed before proceeding
  await new Promise<void>((resolve) => fileStream.on("finish",  resolve));
console.log(`Final file path: ${finalPath}`);  // Check the final path
  if (!fs.existsSync(finalPath)) {
    return NextResponse.json({ error: "Merged file not found" }, { status: 500 });
  }

  return await transcribeWithGroq(finalPath);
}

async function transcribeWithGroq(filePath:string){
  // Initialize the Groq client
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  // Create a translation job
  const translation = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath), // Required path to audio file - replace with your audio file!
    model: "whisper-large-v3-turbo", // Required model to use for translation
    // prompt: "Specify context or spelling", // Optional
    language: "en", // Optional ('en' only)
    response_format: "json", // Optional
    temperature: 0.0, // Optional
  });
  // Log the transcribed text
  console.log(translation.text);
  return translation;
}


async function startTranscribe(filePath: string) {
  try{
    const transcriber = await pipeline("automatic-speech-recognition", "onnx-community/moonshine-tiny-ONNX");
    const output = await transcriber(await audioFileToData(filePath));
    // console.log(output);
    return NextResponse.json(output);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Helper function to convert Buffer to ArrayBuffer
function bufferToArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}
async function audioFileToData(filePath:string) {
  let fileBuffer = fs.readFileSync(filePath)
  // Create an AudioContext to decode the audio
  const audioContext = new AudioContext();

  // Ensure fileBuffer is an ArrayBuffer
  const arrayBuffer = Buffer.isBuffer(fileBuffer) ? bufferToArrayBuffer(fileBuffer) : fileBuffer;

  // Decode the input file buffer (supports WAV, MP3, WebM)
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const targetSampleRate = 16000;
  let audioData;

  // Resample if the sample rate isn't 16000 Hz
  if (audioBuffer.sampleRate !== targetSampleRate) {
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: audioBuffer.numberOfChannels,
      length: Math.ceil(audioBuffer.length * targetSampleRate / audioBuffer.sampleRate),
      sampleRate: targetSampleRate,
    });
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();
    audioData = await offlineContext.startRendering();
  } else {
    audioData = audioBuffer;
  }

  // Merge channels to mono if multi-channel
  if (audioData.numberOfChannels > 1) {
    const merged = new Float32Array(audioData.length);
    const scalingFactor = Math.sqrt(2); // Optional: for energy preservation
    for (let i = 0; i < audioData.length; i++) {
      let sum = 0;
      for (let channel = 0; channel < audioData.numberOfChannels; channel++) {
        sum += audioData.getChannelData(channel)[i];
      }
      merged[i] = (scalingFactor * sum) / audioData.numberOfChannels;
    }
    return merged;
  } else {
    return audioData.getChannelData(0);
  }
}

function audioFileToData1(filePath:string){

  let buffer = fs.readFileSync(filePath)

  // Read .wav file and convert it to required format
  let wav = new WaveFile(buffer);
  wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
  wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
  let audioData = wav.getSamples();
  if (Array.isArray(audioData)) {
    if (audioData.length > 1) {
      const SCALING_FACTOR = Math.sqrt(2);

      // Merge channels (into first channel to save memory)
      for (let i = 0; i < audioData[0].length; ++i) {
        audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
      }
    }

    // Select first channel
    audioData = audioData[0];
  }
  return audioData;
}