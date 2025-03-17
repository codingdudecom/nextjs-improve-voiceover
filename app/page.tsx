"use client"

import { useState,useEffect, useRef } from "react";
import { UploadCloud } from "lucide-react";
import ProgressList from "../components/progress-list"


const initialProgress:string[] = [];
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("Your task is to correct any errors, improve grammar and clarity, and ensure the transcript is coherent and accurate.");
  const [progress,setProgress] = useState<string[]>(initialProgress)
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // setProgress([...progress,"<h2>Speech to text done:</h2><p></p>"]);
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    // if (uploadedFile && !["audio/wav", "audio/mp3", "audio/mpeg"].includes(uploadedFile.type)) {
    if (uploadedFile && uploadedFile.type.indexOf("audio/") < 0){
      alert("Only WAV or MP3 files are allowed.");
      return;
    }
    setFile(uploadedFile);
  };

  const addProgress = (title:string,description:string) => {
    
    
    setProgress(prevProgress =>{
      prevProgress = prevProgress.filter(msg => msg.indexOf("wait...") < 0);
      return [...prevProgress,`<h2 class="font-bold">${title}</h2><p class="max-h-24 overflow-y-auto border border-gray-300 p-2 rounded">${description}</p>`]
  });
  }
  const handleStartProcessing = async () => {
    if (!file) {
      alert("Please upload a voice recording.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
  
    addProgress("Extracting text from audio","wait...");

    try {
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to process file");
      }
  
      const data = await response.json();

      addProgress("Script text extracted",data.text);
      await handleScriptCleanup(data.text);
      console.log("Processing result:", data);
    } catch (error) {
      console.error("Error processing the file:", error);
      alert("An error occurred while processing the file.");
    }
  };
  
  const handleScriptCleanup = async (input_text:string) =>{
    addProgress("Cleaning up text","wait...");
    const formData = new FormData();
    formData.append("input_text", input_text);
    formData.append("instructions", instructions);

    try {
      const response = await fetch("/api/text-cleanup", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to cleanup text");
      }
  
      const data = await response.json();

      addProgress("Script cleanup complete",data.text);
      await handleTTS(data.text);
    } catch (error) {
      console.error("Error cleaning up text:", error);
      alert("An error occurred while cleaning up the text.");
    }
  }

  const handleTTS = async (input_text:string) => {
    addProgress("Generating new audio","wait...");

    const formData = new FormData();
    formData.append("input_text", input_text);

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        body: formData,
      });
  
      // if (!response.ok) {
      //   throw new Error("Failed to generate audio");
      // }
  
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    setAudioUrl(url);
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.innerHTML ="result.mp3";
    a.download = "download";
    a.className="ont-medium text-blue-600 dark:text-blue-500 hover:underline";
    a.href = url;
    
    // Set the file name
    a.download = 'result.mp3';
    
    

      addProgress("Audio file generation complete",`Download: ${a.outerHTML}`);
      
    } catch (error) {
      console.error("Error to generate audio:", error);
      alert("An error occurred while generating audio.");
    }
  }
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
            className="w-full mb-4 border p-2"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
  
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg" onClick={handleStartProcessing}>
            Start Processing
          </button>

          <ProgressList progress={[...progress]} />

          {audioUrl && (
            <div className="audio-player mt-10">
              <audio 
                ref={audioRef}
                controls
                src={audioUrl}
                className="audio-element"
              >
                Your browser does not support the audio element.
              </audio>
              
              <div className="audio-controls mt-2">
                <button 
                  onClick={() => audioRef.current?.play()}
                  className="play-button text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mr-1"
                >
                  Play
                </button>
                <button 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = audioUrl;
                    a.download = 'speech.mp3';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="download-button text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
