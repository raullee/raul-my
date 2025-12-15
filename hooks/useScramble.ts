import { useState, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=_+[]{}|;:,.<>/?';

export const useScramble = (text: string, options: { speed?: number } = {}) => {
  const { speed = 50 } = options;
  const [currentText, setCurrentText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const scramble = useCallback(() => {
    let iteration = 0;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      const newText = text
        .split('')
        .map((_char, index) => {
          if (index < iteration) {
            return text[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      
      setCurrentText(newText);

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 1 / 3;
    }, speed);
  }, [text, speed]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentText(text);
  }, [text]);

  return {
    text: currentText,
    start: scramble,
    stop: stop
  };
};
