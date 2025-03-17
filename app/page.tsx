"use client"

import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    if (uploadedFile && !["audio/wav", "audio/mp3"].includes(uploadedFile.type)) {
      alert("Only WAV or MP3 files are allowed.");
      return;
    }
    setFile(uploadedFile);
  };

  const handleStartProcessing = () => {
    if (!file) {
      alert("Please upload a voice recording.");
      return;
    }
    console.log("Processing", { file, instructions });
  };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Improve Your Voiceover</h1>
          
          <label className="block mb-4 cursor-pointer border-dashed border-2 border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
            <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
            {file ? (
              <p className="text-gray-700">{file.name}</p>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <UploadCloud className="w-10 h-10 mb-2" />
                <span>Click to upload voice recording</span>
              </div>
            )}
          </label>
  
          <textarea
            placeholder="Enter text instructions (e.g., remove background noise, enhance clarity)"
            className="w-full mb-4"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
  
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg" onClick={handleStartProcessing}>
            Start Processing
          </button>
        </div>
      </div>
  );
}
