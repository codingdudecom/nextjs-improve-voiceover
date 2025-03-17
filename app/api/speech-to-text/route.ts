import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

const stt_model_id = "scribe_v1"
export async function POST(req: NextRequest) {
  // return NextResponse.json({text:"She don't like going to the park because its too far away. I was thinking of going there later but I can't find my shoes. We should of gone together if I had know where they was."});
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const client = new ElevenLabsClient({ apiKey });

    const response = await client.speechToText.convert({
      file,
      model_id: stt_model_id
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Processing failed", details: error }, { status: 500 });
  }
}
