import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { v4 as uuid } from "uuid";
import { createWriteStream,readFileSync,unlinkSync } from "fs";
import { KokoroTTS, VOICES } from "kokoro-js";

const model_id = "onnx-community/Kokoro-82M-ONNX";
const tts = await KokoroTTS.from_pretrained(model_id, {
  dtype: "q8", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
});


const HF_VOICE_PREVIEW = [{"id":"af_heart","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/S_9tkA75BT_QHKOzSX6S-.wav"},{"id":"af_alloy","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/wiZ3gvlL--p5pRItO4YRE.wav"},{"id":"af_aoede","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/Nv1xMwzjTdF9MR8v0oEEJ.wav"},{"id":"af_bella","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/sWN0rnKU6TlLsVdGqRktF.wav"},{"id":"af_jessica","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/2Oa4wITWAmiCXJ_Q97-7R.wav"},{"id":"af_kore","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/AOIgyspzZWDGpn7oQgwtu.wav"},{"id":"af_nicole","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/EY_V2OGr-hzmtTGrTCTyf.wav"},{"id":"af_nova","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/X-xdEkx3GPlQG5DK8Gsqd.wav"},{"id":"af_river","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/ZqaV2-xGUZdBQmZAF1Xqy.wav"},{"id":"af_sarah","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/xzoJBl1HCvkE8Fl8Xu2R4.wav"},{"id":"af_sky","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/ubebYQoaseyQk-jDLeWX7.wav"},{"id":"am_adam","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/tvauhDVRGvGK98I-4wv3H.wav"},{"id":"am_echo","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/qy_KuUB0hXsu-u8XaJJ_Z.wav"},{"id":"am_eric","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/JhqPjbpMhraUv5nTSPpwD.wav"},{"id":"am_fenrir","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/c0R9caBdBiNjGUUalI_DQ.wav"},{"id":"am_liam","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/DFHvulaLeOjXIDKecvNG3.wav"},{"id":"am_michael","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/IPKhsnjq1tPh3JmHH8nEg.wav"},{"id":"am_onyx","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/ov0pFDfE8NNKZ80LqW6Di.wav"},{"id":"am_puck","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/MOC654sLMHWI64g8HWesV.wav"},{"id":"am_santa","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/LzA6JmHBvQlhOviy8qVfJ.wav"},{"id":"bf_alice","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/9mnYZ3JWq7f6U12plXilA.wav"},{"id":"bf_emma","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/_fvGtKMttRI0cZVGqxMh8.wav"},{"id":"bf_isabella","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/VzlcJpqGEND_Q3duYnhiu.wav"},{"id":"bf_lily","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/qZCoartohiRlVamY8Xpok.wav"},{"id":"bm_daniel","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/Eb0TLnLXHDRYOA3TJQKq3.wav"},{"id":"bm_fable","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/NT9XkmvlezQ0FJ6Th5hoZ.wav"},{"id":"bm_george","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/y6VJbCESszLZGupPoqNkF.wav"},{"id":"bm_lewis","previewURL":"https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/RlB5BRvLt-IFvTjzQNxCh.wav"}];

export async function GET(req:NextRequest){
  var v:any = tts.voices;
  v = Object.keys(v).map(key => {
    return {
      id:key,
      name:v[key].name,
      preview_url: HF_VOICE_PREVIEW.find(item => item.id == key)?.previewURL
    }
  })
  return NextResponse.json(v);
}

export async function POST(req: NextRequest) {
  
  try {
    const formData = await req.formData();
    const input_text = formData.get("input_text") as string;
    const voice = formData.get("voice") as string || "af_heart";

    console.log(voice);
    
    if (!input_text || input_text=="") {
      return NextResponse.json({ error: "No text to transform" }, { status: 400 });
    }



  console.log("---",require.resolve("kokoro-js"));

  const text = input_text;


  const textChunks = splitTextIntoChunks(input_text, 25);
  let audioPieces = [];

  for (const text of textChunks){
    console.log("Text:",text);
    const audio = await tts.generate(text, {
      voice: voice as keyof VOICES
      // Use `tts.list_voices()` to list all available voices
      // voice: "af_heart",
    });
    // audioPieces.push(new Uint8Array(audio.toWav()));
    audioPieces.push(audio);
  }

  
  
  console.log(`We get ${audioPieces.length} audio pieces`);


  const buffer = await joinRawAudioPieces(audioPieces);


  return new Response(buffer, {
    headers: {
      'Content-Type': 'audio/wav',
      'Content-Disposition': `attachment; filename="${uuid()}.wav"`
    }
  });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Processing failed", details: error }, { status: 500 });
  }
}

const joinRawAudioPieces = async (audioPieces:any) => {
  // Validate input
  if (!Array.isArray(audioPieces) || audioPieces.length === 0) {
    throw new Error('Input must be a non-empty array of RawAudio objects');
  }

  // If there's only one piece, just convert it directly
  if (audioPieces.length === 1) {
    const arrayBuffer = await audioPieces[0].toWav();
    return Buffer.from(arrayBuffer);
  }

  // We'll use the WAV format for consistency, then extract the raw PCM data
  const wavBuffers = await Promise.all(audioPieces.map(audio => audio.toWav()));
  
  // Get the WAV headers from the first file to use later
  const firstWavBuffer = Buffer.from(wavBuffers[0]);
  
  // WAV header is typically 44 bytes, we'll extract PCM data after that
  const pcmBuffers = wavBuffers.map(wavArrayBuffer => {
    const wavBuffer = Buffer.from(wavArrayBuffer);
    // Skip the 44-byte WAV header to get just the PCM data
    return wavBuffer.slice(44);
  });
  
  // Concatenate all PCM buffers
  const combinedPCM = Buffer.concat(pcmBuffers);
  
  // Create a new WAV header with the combined length
  const headerBuffer = firstWavBuffer.slice(0, 44);
  
  // Update the file size in the header (4 bytes at position 4)
  const fileSize = combinedPCM.length + 36; // Total size - 8 bytes
  headerBuffer.writeUInt32LE(fileSize, 4);
  
  // Update the data chunk size (4 bytes at position 40)
  headerBuffer.writeUInt32LE(combinedPCM.length, 40);
  
  // Combine the header with the PCM data
  const finalBuffer = Buffer.concat([headerBuffer, combinedPCM]);
  
  return finalBuffer;
};

function splitTextIntoChunks(text: string, maxLength: number = 500): string[] {
    const sentences = text.split(/\./); // Split by spaces
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
            chunks.push(currentChunk.trim()); // Store current chunk
            currentChunk = sentence; // Start a new chunk
        } else {
            currentChunk += (currentChunk ? ". " : "") + sentence;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim()); // Push last chunk
    }

    return chunks;
}