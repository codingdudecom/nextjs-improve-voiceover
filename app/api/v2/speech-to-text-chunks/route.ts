import { NextRequest, NextResponse } from "next/server";
import { SpeechClient } from '@google-cloud/speech';
import fs from "fs";
import path from "path";
// const Mp32Wav = require('mp3-to-wav');

const uploadDir = "/tmp/uploads"; // Temporary storage

export const config = { api: { bodyParser: false } }; // Disable default body parser

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type")?.includes("application/json")) {
    // Request to merge file
    const { fileName, merge } = await req.json();
    if (merge) {
      return await processAudio(fileName);
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
    return await sendToGCP(finalPath);
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

  return await sendToGCP(finalPath);
}

function sendToGCP(filePath:string){
  
}
/*
async function sendToGCP(filePath: string) {
  console.log(filePath);
  const apiKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

  const client = new SpeechClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  });
  if (!filePath) return NextResponse.json({ error: "File path missing" }, { status: 400 });

  if (filePath.toLowerCase().indexOf(".mp3") >=0){
      filePath = await convertMP3_to_WAV(filePath);
  }
  try {
    const audio = {
      content: fs.readFileSync(path.resolve(filePath)).toString('base64'),
    };
    
    const config = {
      languageCode: 'en-US',
      model:'default'
    };

    
    const [response] = await client.recognize({ audio, config });
    const text = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    return NextResponse.json({text});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


async function convertMP3_to_WAV(input:string){
  console.log(input);
  const mp3ToWav = new Mp32Wav(input);

  const mp3DecodeRes = await mp3ToWav.decodeMp3(input)
  const wavPath = mp3ToWav.saveForWav(mp3DecodeRes.data, mp3ToWav._output_dir, mp3ToWav._output_file_name, 16000, 1, mp3DecodeRes.float);
  const output = input.replace(".mp3",".wav");
  return output;
}*/