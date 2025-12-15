import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState, AudioVolumeState } from '../types';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';
import { MARCO_MODEL_NAME as MODEL_NAME, MARCO_SYSTEM_INSTRUCTION as SYSTEM_INSTRUCTION } from '../marcoConstants';

export const useGeminiLive = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState<AudioVolumeState>({ inputVolume: 0, outputVolume: 0 });

  // Refs for audio handling to avoid re-renders
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const inputGainNodeRef = useRef<GainNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);

  // Initialize Audio Contexts
  const initializeAudio = useCallback(() => {
    if (!inputAudioContextRef.current) {
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    }
    if (!outputAudioContextRef.current) {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      // Create analyser for output visualization
      outputAnalyserRef.current = outputAudioContextRef.current.createAnalyser();
      outputAnalyserRef.current.fftSize = 256;
      outputAnalyserRef.current.connect(outputAudioContextRef.current.destination);
    }
  }, []);

  const cleanup = useCallback(() => {
    // Stop all playing sources
    sourceNodesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourceNodesRef.current.clear();

    // Close media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Close Audio Contexts
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    sessionPromiseRef.current = null;
    nextStartTimeRef.current = 0;
    setConnectionState(ConnectionState.DISCONNECTED);
    setVolume({ inputVolume: 0, outputVolume: 0 });
  }, []);

  const connect = useCallback(async () => {
    try {
      setConnectionState(ConnectionState.CONNECTING);
      setError(null);
      initializeAudio();

      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      console.log('API Key available:', !!apiKey);

      if (!apiKey) {
        throw new Error("API Key not found. Please check your environment configuration.");
      }

      console.log('Initializing Gemini AI...');
      const ai = new GoogleGenAI({ apiKey });

      // Get Microphone Stream
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      mediaStreamRef.current = stream;

      const inputCtx = inputAudioContextRef.current!;
      const source = inputCtx.createMediaStreamSource(stream);
      console.log('Audio context created, sample rate:', inputCtx.sampleRate);
      
      // Analyser for input volume
      const inputAnalyser = inputCtx.createAnalyser();
      inputAnalyser.fftSize = 256;
      source.connect(inputAnalyser);
      
      // ScriptProcessor for streaming audio data
      const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      scriptProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate input volume
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const inputVol = Math.min(rms * 5, 1); // Boost for visibility

        // Get output volume
        let outputVol = 0;
        if (outputAnalyserRef.current) {
             const dataArray = new Uint8Array(outputAnalyserRef.current.frequencyBinCount);
             outputAnalyserRef.current.getByteFrequencyData(dataArray);
             const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
             outputVol = average / 128; // Normalize 0-1 (roughly)
        }

        setVolume({ inputVolume: inputVol, outputVolume: outputVol });

        // Stream to Gemini
        const pcmBlob = createPcmBlob(inputData);
        if (sessionPromiseRef.current) {
          sessionPromiseRef.current.then(session => {
            session.sendRealtimeInput({ media: pcmBlob });
          }).catch(err => {
            console.error("Error sending audio:", err);
          });
        }
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(inputCtx.destination);

      console.log('Connecting to Gemini Live...', MODEL_NAME);
      const sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          }
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live connection opened!');
            setConnectionState(ConnectionState.CONNECTED);
          },
          onmessage: async (message: LiveServerMessage) => {
            console.log('Received message from Gemini:', message);
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              console.log('Playing audio response...');
              const outputCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              const audioBytes = base64ToUint8Array(base64Audio);
              const audioBuffer = await decodeAudioData(audioBytes, outputCtx, 24000, 1);
              
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              
              // Connect to analyser for visualization and then destination
              if (outputAnalyserRef.current) {
                source.connect(outputAnalyserRef.current);
              } else {
                source.connect(outputCtx.destination);
              }
              
              source.addEventListener('ended', () => {
                sourceNodesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourceNodesRef.current.add(source);
            }

            // Handle Interruptions
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              sourceNodesRef.current.forEach(node => {
                try { node.stop(); } catch(e) {}
              });
              sourceNodesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setConnectionState(ConnectionState.DISCONNECTED);
          },
          onerror: (err) => {
            console.error("Gemini Live Error:", err);
            setError("Connection error occurred.");
            setConnectionState(ConnectionState.ERROR);
            cleanup();
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect");
      setConnectionState(ConnectionState.ERROR);
      cleanup();
    }
  }, [initializeAudio, cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return {
    connectionState,
    error,
    volume,
    connect,
    disconnect
  };
};