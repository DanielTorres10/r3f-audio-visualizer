import { useState, useEffect, useRef } from 'react';

const useLetterReveal = (triggerTime: number, text: string, revealDuration: number) => {
  const [revealedLength, setRevealedLength] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (animationRef.current) clearInterval(animationRef.current);
    
    setRevealedLength(0);

    const checkAndUpdate = () => {
      if (!isMountedRef.current) return;
      
      const audioElement = (window as any).__valentineAudio as HTMLAudioElement;
      if (!audioElement || !audioElement.currentTime) {
        return;
      }

      const currentTime = audioElement.currentTime;
      
      if (currentTime < triggerTime) {
        setRevealedLength(0);
        return;
      }

      const timeSinceTrigger = currentTime - triggerTime;
      const progress = Math.min(timeSinceTrigger / revealDuration, 1);
      const targetLength = Math.floor(progress * text.length);
      
      if (targetLength > revealedLength) {
        // Animate to target length
        if (animationRef.current) clearInterval(animationRef.current);
        
        animationRef.current = setInterval(() => {
          if (!isMountedRef.current) return;
          
          setRevealedLength(prev => {
            if (prev >= targetLength) {
              if (animationRef.current) {
                clearInterval(animationRef.current);
                animationRef.current = null;
              }
              return targetLength;
            }
            return prev + 1;
          });
        }, 50);
      }
    };

    // Check immediately
    checkAndUpdate();
    
    // Set up interval
    intervalRef.current = setInterval(checkAndUpdate, 100);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [triggerTime, revealDuration, text]);

  return text.substring(0, revealedLength);
};

export default useLetterReveal;