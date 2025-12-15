
import { useState, useEffect, useCallback } from 'react';

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
      }
    }
  }, []);

  const playTone = useCallback((frequency: number, duration = 0.1) => {
    if (!audioContext || !soundEnabled) return;
    
    // Resume context if it's suspended (e.g., due to browser autoplay policies)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [audioContext, soundEnabled]);

  return { playTone, soundEnabled, setSoundEnabled };
};
