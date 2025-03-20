"use client"

import { useState,useEffect, useRef } from "react";
import { UploadCloud, CirclePlay, Mic, StopCircle, LoaderCircle } from "lucide-react";
import ProgressList from "../components/progress-list"
import Progress from "../components/progress"



// const voices = [
//     {"id":"9BWtsMINqrJLrRacOk9x","name":"Aria","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/9BWtsMINqrJLrRacOk9x/405766b8-1f4e-4d3c-aba1-6f25333823ec.mp3"},{"id":"CwhRBWXzGAHq8TQ4Fs17","name":"Roger","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3"},{"id":"EXAVITQu4vr4xnSDxMaL","name":"Sarah","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3"},{"id":"FGY2WhTYpPnrIDTdsKH5","name":"Laura","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3"},{"id":"IKne3meq5aSn9XLyUdCD","name":"Charlie","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3"},{"id":"JBFqnCBsd6RMkjVDRZzb","name":"George","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3"},{"id":"N2lVS1w4EtoT3dr4eOWO","name":"Callum","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3"},{"id":"SAz9YHcvj6GT2YYXdXww","name":"River","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3"},{"id":"TX3LPaxmHKxFdv7VOQHJ","name":"Liam","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3"},{"id":"XB0fDUnXU5powFXDhCwa","name":"Charlotte","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/XB0fDUnXU5powFXDhCwa/942356dc-f10d-4d89-bda5-4f8505ee038b.mp3"},{"id":"Xb7hH8MSUJpSbSDYk0k2","name":"Alice","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3"},{"id":"XrExE9yKIg1WjnnlVkGX","name":"Matilda","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3"},{"id":"bIHbv24MWmeRgasZH58o","name":"Will","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3"},{"id":"cgSgspJ2msm6clMCkdW9","name":"Jessica","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3"},{"id":"cjVigY5qzO86Huf0OWal","name":"Eric","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/d098fda0-6456-4030-b3d8-63aa048c9070.mp3"},{"id":"iP95p4xoKVk53GoZ742B","name":"Chris","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/iP95p4xoKVk53GoZ742B/3f4bde72-cc48-40dd-829f-57fbf906f4d7.mp3"},{"id":"nPczCjzI2devNBz1zQrb","name":"Brian","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd3e72c-4fd3-42f1-93ea-abc5d4e5aa1d.mp3"},{"id":"onwK4e9ZLuTAKqWW03F9","name":"Daniel","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3"},{"id":"pFZP5JQG7iQjIQuC4Bku","name":"Lily","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3"},{"id":"pqHfZKP75CvOlQylNhV4","name":"Bill","preview_url":"https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3"},{"id":"mR1dRpBxfiThJHgub8nr","name":"David Wolfe","preview_url":"https://storage.googleapis.com/eleven-public-prod/database/user/8gcW0mv90WdCm0gWk6EWysBtQFi2/voices/mR1dRpBxfiThJHgub8nr/yVE9tJi8cMoiNxllkIiz.mp3"}
// ];

//https://storage.googleapis.com/eleven-public-prod/custom/voices/OlBp4oyr3FBAGEAtJOnU/Uub5cEzcyVo34vqgA9cA.mp3

const API_VERSION = "v3";

const initialProgress:string[] = [];
export default function Home() {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [instructions, setInstructions] = useState("Your task is to correct any errors, improve grammar and clarity, and ensure the transcript is coherent and accurate. Don't leave out any sentences.");
  const [progress,setProgress] = useState<string[]>(initialProgress)
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voicePreviewRef = useRef<HTMLAudioElement | null>(null);
  const [voices,setVoices] = useState<Array<any>>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [selectedPreviewURL, setSelectedPreviewURL] = useState<string>("");

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);


  const [textCleanupComplete, setTextCleanupComplete] = useState(false);


  const [step,setStep] = useState(1);
  const [stepLoading,setStepLoading] = useState(0);
  const [transcript,setTranscript] = useState<string>("");

  // setProgress([...progress,"<h2>Speech to text done:</h2><p></p>"]);
  
  useEffect(() => {
    const fetchVoices = async () => {
          const resp = await fetch(`/api/${API_VERSION}/text-to-speech`, {
          method: "GET"
      });
      const vArr:Array<any> = await resp.json();
      setVoices(vArr);
      setSelectedVoice(vArr[0].id);
      console.log(vArr[0]);
      setSelectedPreviewURL(vArr[0].preview_url);
    };

    fetchVoices();
  },[]);
  
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(event.target.value);
    console.log(event.target.value);
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
    // if (uploadedFile && !["audio/wav", "audio/mp3", "audio/mpeg","audio/webm"].includes(uploadedFile.type)) {
    console.log(uploadedFile?.type.indexOf("webm"));
    if (uploadedFile && uploadedFile.type.indexOf("audio/")  < 0 && (uploadedFile.type.indexOf("webm") < 0)){
      alert("Only WAV, MP3 or WEBM files are allowed.");
      return;
    }
    setFile(uploadedFile);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    console.log(recorder.audioBitsPerSecond);
    recorder.ondataavailable = (event) => {
      const audioBlob = new Blob([event.data], { type: "audio/wav" });
      (audioBlob as any).name = `recording-${new Date().getTime()}.webm`;
      setFile(audioBlob);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const addProgress = (title:string,description:string, editable:boolean=false) => {
    
    
    setProgress(prevProgress =>{
      prevProgress = prevProgress.filter(msg => msg.indexOf("wait...") < 0);
      return [...prevProgress,`<h2 class="font-bold">${title}</h2><p contenteditable="${editable?"true":"false"}" class="max-h-24 overflow-y-auto ${(description.indexOf("wait...")>=0 || !editable)?"":"border border-gray-300"} p-2 rounded">${description}</p>`]
  });
  }
  const handleTranscribe = async () => {
    if (!file) {
      alert("Please upload a voice recording.");
      return;
    }

    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    setStepLoading(1);
    for (let index = 0; index < totalChunks; index++) {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("index", index +"");
      formData.append("totalChunks", totalChunks+"");
      formData.append("fileName", (file as File).name);

      await fetch(`/api/${API_VERSION}/speech-to-text-chunks`, {
        method: "POST",
        body: formData,
      });
    }

    try {
      // Notify server to merge & process
      const response = await fetch(`/api/${API_VERSION}/speech-to-text-chunks`, {
        method: "POST",
        body: JSON.stringify({ fileName: (file as File).name, merge: true }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to process file");
      }
  
      const data = await response.json();

      setTranscript(data.text);
      setStepLoading(0);
    } catch (error) {
      console.error("Error processing the file:", error);
      alert("An error occurred while processing the file.");
    }
  }

  const handleStartProcessing = async () => {
    setProgress([]);
    if (!file) {
      alert("Please upload a voice recording.");
      return;
    }

    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    addProgress("Uploading audio","wait...");

    for (let index = 0; index < totalChunks; index++) {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("index", index +"");
      formData.append("totalChunks", totalChunks+"");
      formData.append("fileName", (file as File).name);

      await fetch(`/api/${API_VERSION}/speech-to-text-chunks`, {
        method: "POST",
        body: formData,
      });
    }
  
    addProgress("Extracting text from audio","wait...");

    try {
      // Notify server to merge & process
      const response = await fetch(`/api/${API_VERSION}/speech-to-text-chunks`, {
        method: "POST",
        body: JSON.stringify({ fileName: (file as File).name, merge: true }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        console.log(response);
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
    
    const formData = new FormData();
    formData.append("input_text", input_text);
    formData.append("instructions", instructions);

    try {
      const response = await fetch(`/api/${API_VERSION}/text-cleanup`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to cleanup text");
      }
  
      const data = await response.json();

      return data;
      // await handleTTS(data.text);
    } catch (error) {
      console.error("Error cleaning up text:", error);
      alert("An error occurred while cleaning up the text.");
    }
  }

  const handleFinishProcessing = async () => {

    const element = Array.from(document.querySelectorAll("p[contenteditable=true]")).pop() as HTMLElement;
    let text = element.innerText;
    setProgress(prevProgress => {
      prevProgress[prevProgress.length - 1] = element?.parentElement?.innerHTML || "";
      return prevProgress;
    })
    console.log(text);
    text = text.length > 5000 ? text.substring(0, 5000) : text;
    await handleTTS(text);
  }
  const handleTTS = async (input_text:string) => {
    const formData = new FormData();
    formData.append("input_text", input_text);
    formData.append("voice", selectedVoice);
    console.log(selectedVoice);

    try {
      const response = await fetch(`/api/${API_VERSION}/text-to-speech`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        if (response.status == 401){
          throw new Error("Audio generation limit exceeded");  
        }
        throw new Error("Failed to generate audio");
      }
  
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
    
    

      
    } catch (error) {
      console.error("Error to generate audio:", error);
      alert("An error occurred while generating audio.");
    }
  }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Improve Your Voiceover</h1>
          <Progress step={step} onStepChange={setStep}/>
          {step == 1 && <span>
            <h2 className="text-md font-bold mb-4 mt-4">Step 1: Upload or Record Audio for Transcription</h2>
            <label className="block mb-4 cursor-pointer border-dashed border-2 border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
              <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
              {file ? (
                <p className="text-gray-700">{(file as File).name}</p>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <UploadCloud className="w-10 h-10 mb-2" />
                  <span>Click to upload voice recording</span>
                </div>
              )}
            </label>
            <span className="flex flex-row gap-2 justify-end">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-white ${recording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {recording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {recording ? "Stop Recording" : "Record Audio"}
            </button>

            <button className="flex gap-2 rounded-lg px-4 py-2 border-blue-500 border border-gray-200 cursor-pointer text-blue-500 hover:bg-blue-100" onClick={handleTranscribe} >
              Transcribe {stepLoading == 1 && <LoaderCircle className="animate-spin" />}
            </button>
            </span>

            {transcript.length > 0 &&
              <>
              <textarea 
                rows={10}
                className="rounded-md border border-gray-200 w-full mt-4"
                name="transcript" 
                id="transcript" 
                value={transcript} onChange={e => setTranscript(e.target.value)}></textarea>
                <span className="flex justify-end gap-2">
                <button className="flex gap-2 rounded-lg px-4 py-2 border-blue-500 border border-gray-200 cursor-pointer text-blue-500 hover:bg-blue-100" onClick={() => setStep(step+1)} >
                  Next
                </button>
                </span>
              </>
            }
            </span>
          }


          {(step == 2) && <span>
            <h2 className="text-md font-bold mb-4 mt-4">Step 2: Clearnup Transcription</h2>
            
            <textarea 
                rows={10}
                className="rounded-md border border-gray-200 w-full mt-4"
                name="transcript" 
                id="transcript" 
                value={transcript} onChange={e => setTranscript(e.target.value)}></textarea>
            <label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                Text cleanup instructions:
            </label>
            <textarea
              id="instructions"
              placeholder="Enter text instructions (e.g., remove background noise, enhance clarity)"
              className="w-full border p-2"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
            <span className="flex justify-end mb-4">
            <button className="flex gap-2 rounded-lg px-4 py-2 text-white bg-blue-500 border-blue-500 border border-gray-200 cursor-pointer text-blue-500 hover:bg-blue-600" 
              onClick={async () => {setStepLoading(2); const data = await handleScriptCleanup(transcript); setTranscript(data.text);setStepLoading(0); }} >
                  Cleanup {stepLoading == 2 && <LoaderCircle className="animate-spin" />}
                </button>
            </span>
                           <>
  
                <span className="flex justify-end gap-2">
                <button className="flex gap-2 rounded-lg px-4 py-2 border-blue-500 border border-gray-200 cursor-pointer text-blue-500 hover:bg-blue-100" onClick={() => setStep(step-1)} >
                  Prev
                </button>
                <button className="flex gap-2 rounded-lg px-4 py-2 border-blue-500 border border-gray-200 cursor-pointer text-blue-500 hover:bg-blue-100" onClick={() => setStep(step+1)} >
                  Next
                </button>
                </span>
              </>
            </span>
          }

          {(step == 3) && <span>
            <h2 className="text-md font-bold mb-4 mt-4">Step 3: Generate Audio</h2>
            <div className="flex flex-col gap-2 mb-2 relative">
              <label htmlFor="voiceSelect" className="text-sm font-medium text-gray-700">
                Choose a voice:
              </label>
              <button className="absolute bottom-1 left-0 cursor-pointer" onClick={handlePlayVoicePreview}>
                <CirclePlay />
                {selectedPreviewURL!= "" && <audio 
                  ref={voicePreviewRef}
                  src={selectedPreviewURL}
                >
                  Your browser does not support the audio element.
                </audio>
                }
              </button>
              <select
                id="voiceSelect"
                value={selectedVoice}
                onChange={handleChange}
                className="w-full-80% ml-10 p-2 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm "
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
              
            </div>     
            <textarea 
                rows={10}
                className="rounded-md border border-gray-200 w-full mt-4"
                name="transcript" 
                id="transcript" 
                value={transcript} onChange={e => setTranscript(e.target.value)}></textarea>
                        <span className="flex justify-end mb-4">
            <button className="flex gap-2 rounded-lg px-4 py-2 text-white bg-blue-500 border-blue-500 border border-gray-200 cursor-pointer text-blue-500 hover:bg-blue-600" 
              onClick={async () => {setStepLoading(3); const data = await handleTTS(transcript); setStepLoading(0); }} >
                  Generate Audio {stepLoading == 3 && <LoaderCircle className="animate-spin" />}
                </button>
            </span>


            {audioUrl && (
                  <div className="flex justify-end gap-2 audio-player mt-10">
                    <audio 
                      ref={audioRef}
                      controls
                      src={audioUrl}
                      className="audio-element basis-full"
                    >
                      Your browser does not support the audio element.
                    </audio>
                    
                    <div className="audio-controls mt-2 flex nowrap">
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

            <>
  
            <span className="flex justify-end gap-2">
            <button className="flex gap-2 rounded-lg px-4 py-2 border-blue-500 border border-gray-200 cursor-pointer text-blue-500 hover:bg-blue-100" onClick={() => setStep(step-1)} >
              Prev
            </button>
            </span>
          </>
            </span>}
          {/*
          <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg" onClick={handleStartProcessing}>
            Start Processing
          </button>
            
          <ProgressList progress={[...progress]} />
          */}



          
        </div>
      </div>
  );
}
