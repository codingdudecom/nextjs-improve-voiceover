import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import { promisify } from "util";

const stt_model_id = "scribe_v1";
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
    return await sendToElevenLabs(finalPath);
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
  await new Promise((resolve) => fileStream.on("finish", resolve));
console.log(`Final file path: ${finalPath}`);  // Check the final path
  if (!fs.existsSync(finalPath)) {
    return NextResponse.json({ error: "Merged file not found" }, { status: 500 });
  }

  return await sendToElevenLabs(finalPath);
}

async function sendToElevenLabs(filePath: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

  const client = new ElevenLabsClient({ apiKey });
  // const file = fs.readFileSync(filePath);
  try {
    const response = await client.speechToText.convert({
      file:fs.createReadStream(filePath),
      model_id: stt_model_id,
    });
  console.log(response);
    return NextResponse.json(response);
  } catch (e){
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
