import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { v4 as uuid } from "uuid";
import { createWriteStream } from "fs";

const BRITNEY_VOICE = "kPzsL2i3teMYv0FxEYQ6",
      JERY_VOICE = "XA2bIQ92TabjGbpO2xRr",
      GEORGE_VOICE="JBFqnCBsd6RMkjVDRZzb";
const tts_model = "eleven_multilingual_v2";

export async function POST(req: NextRequest) {
  
  try {
    const formData = await req.formData();
    const input_text = formData.get("input_text") as string;
    const voice = formData.get("voice") as string || GEORGE_VOICE;
    
    if (!input_text || input_text=="") {
      return NextResponse.json({ error: "No text to transform" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const client = new ElevenLabsClient({ apiKey });

    const response = await client.textToSpeech.convert(voice, {
      output_format: "mp3_44100_128",
      text:input_text,
      model_id: tts_model
  });

  
  const fileName = `${uuid()}.mp3`;
      // Convert Node.js stream to buffer
      const chunks = [];
      for await (const chunk of response) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const buffer = Buffer.concat(chunks);
      
      // Return buffer as response
      return new Response(buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${fileName}"`
        }
      });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Processing failed", details: error }, { status: 500 });
  }
}
