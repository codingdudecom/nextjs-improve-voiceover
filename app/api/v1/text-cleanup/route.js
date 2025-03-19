import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { ChatCompletion } from '@cerebras/cerebras_cloud_sdk/resources/index.mjs';
import { NextRequest, NextResponse } from "next/server";

const cerebras = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY']
  
});

export async function POST(req) {
    const formData = await req.formData();
    const input_text = formData.get("input_text");
    const instructions = formData.get("instructions");

    const stream = await cerebras.chat.completions.create({
    messages: [
        {
            "role": "system",
            "content": `I will provide you with a transcript of a voice recording
            
            # Instructions
            ${instructions}

            Please only return the cleaned up text of the transcript`
        },
        {
          "role": "user",
          "content": `Transcript:
            "${input_text}"
          `
      }
    ],
    model: 'llama3.1-8b',
    stream: true,
    max_completion_tokens: 8096,
    temperature: 0.2,
    top_p: 1
  });

  let reply = ""
  for await (const chunk of stream) {
    reply += chunk.choices[0].delta.content || "";
  }
  return NextResponse.json({text:reply});
}

