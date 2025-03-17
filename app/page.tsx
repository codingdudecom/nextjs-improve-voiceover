"use client"

import { useState,useEffect, useRef } from "react";
import { UploadCloud, CirclePlay } from "lucide-react";
import ProgressList from "../components/progress-list"


const voices = [
    {"id":"9BWtsMINqrJLrRacOk9x","name":"Aria","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/9BWtsMINqrJLrRacOk9x/405766b8-1f4e-4d3c-aba1-6f25333823ec.mp3"},{"id":"CwhRBWXzGAHq8TQ4Fs17","name":"Roger","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3"},{"id":"EXAVITQu4vr4xnSDxMaL","name":"Sarah","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3"},{"id":"FGY2WhTYpPnrIDTdsKH5","name":"Laura","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3"},{"id":"IKne3meq5aSn9XLyUdCD","name":"Charlie","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3"},{"id":"JBFqnCBsd6RMkjVDRZzb","name":"George","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3"},{"id":"N2lVS1w4EtoT3dr4eOWO","name":"Callum","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3"},{"id":"SAz9YHcvj6GT2YYXdXww","name":"River","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3"},{"id":"TX3LPaxmHKxFdv7VOQHJ","name":"Liam","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3"},{"id":"XB0fDUnXU5powFXDhCwa","name":"Charlotte","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/XB0fDUnXU5powFXDhCwa/942356dc-f10d-4d89-bda5-4f8505ee038b.mp3"},{"id":"Xb7hH8MSUJpSbSDYk0k2","name":"Alice","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3"},{"id":"XrExE9yKIg1WjnnlVkGX","name":"Matilda","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3"},{"id":"bIHbv24MWmeRgasZH58o","name":"Will","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3"},{"id":"cgSgspJ2msm6clMCkdW9","name":"Jessica","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3"},{"id":"cjVigY5qzO86Huf0OWal","name":"Eric","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/d098fda0-6456-4030-b3d8-63aa048c9070.mp3"},{"id":"iP95p4xoKVk53GoZ742B","name":"Chris","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/iP95p4xoKVk53GoZ742B/3f4bde72-cc48-40dd-829f-57fbf906f4d7.mp3"},{"id":"nPczCjzI2devNBz1zQrb","name":"Brian","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd3e72c-4fd3-42f1-93ea-abc5d4e5aa1d.mp3"},{"id":"onwK4e9ZLuTAKqWW03F9","name":"Daniel","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3"},{"id":"pFZP5JQG7iQjIQuC4Bku","name":"Lily","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3"},{"id":"pqHfZKP75CvOlQylNhV4","name":"Bill","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3"},{"id":"mR1dRpBxfiThJHgub8nr","name":"David Wolfe","preview_url":"https://storage.googleapis.com/eleven-public-prod/database/user/8gcW0mv90WdCm0gWk6EWysBtQFi2/voices/mR1dRpBxfiThJHgub8nr/yVE9tJi8cMoiNxllkIiz.mp3"}
];

//https://storage.googleapis.com/eleven-public-prod/custom/voices/OlBp4oyr3FBAGEAtJOnU/Uub5cEzcyVo34vqgA9cA.mp3

const initialProgress:string[] = [];
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("Your task is to correct any errors, improve grammar and clarity, and ensure the transcript is coherent and accurate. Don't leave out any sentences.");
  const [progress,setProgress] = useState<string[]>(initialProgress)
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voicePreviewRef = useRef<HTMLAudioElement | null>(null);
  const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
  const [selectedPreviewURL, setSelectedPreviewURL] = useState(voices[0].preview_url);

  // setProgress([...progress,"<h2>Speech to text done:</h2><p></p>"]);
  
  
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(event.target.value);
    const previewURL = voices.find(o => o.id === event.target.value)?.preview_url || "";
    setSelectedPreviewURL(previewURL);
  };

  const handlePlayVoicePreview = () =>{
    if (voicePreviewRef.current) { // Ensure ref is not null
      voicePreviewRef.current.load();
      voicePreviewRef.current.play().catch((error) => console.error("Audio play error:", error));
    }
  }

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
      return [...prevProgress,`<h2 class="font-bold">${title}</h2><p class="max-h-24 overflow-y-auto ${description.indexOf("wait...")>=0?"":"border border-gray-300"} p-2 rounded">${description}</p>`]
  });
  }
  const handleStartProcessing = async () => {
    setProgress([]);
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
    formData.append("voice", selectedVoice);
    console.log(selectedVoice);

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
  
          <label htmlFor="instructions" className="text-sm font-medium text-gray-700">
              Text cleanup instructions:
          </label>
          <textarea
            id="instructions"
            placeholder="Enter text instructions (e.g., remove background noise, enhance clarity)"
            className="w-full mb-4 border p-2"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <div className="flex flex-col gap-2 mb-2 relative">
            <label htmlFor="voiceSelect" className="text-sm font-medium text-gray-700">
              Choose a voice:
            </label>
            <button className="absolute bottom-1 left-0 cursor-pointer" onClick={handlePlayVoicePreview}>
              <CirclePlay />
              <audio 
                ref={voicePreviewRef}
                src={selectedPreviewURL}
              >
                Your browser does not support the audio element.
              </audio>
            </button>
            <select
              id="voiceSelect"
              value={selectedVoice}
              onChange={handleChange}
              className="w-sm ml-10 p-2 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm "
            >
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>                   
  
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
