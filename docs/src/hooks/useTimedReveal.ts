import { useState, useEffect, useRef } from 'react';

const useTimedReveal = (triggerTime: number, dependencies: any[] = []) => {
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const checkAudioTime = () => {
      // Get audio element from window
      const audioElement = (window as any).__valentineAudio as HTMLAudioElement;
      if (!audioElement || !audioElement.currentTime) {
        return 0;
      }
      return audioElement.currentTime;
    };

    const checkVisibility = () => {
      if (!isMountedRef.current) return;
      
      const currentTime = checkAudioTime();
      setIsVisible(currentTime >= triggerTime);
    };

    // Check initially
    checkVisibility();
    
    // Set up interval to check
    intervalRef.current = setInterval(checkVisibility, 100);
    
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [triggerTime, ...dependencies]);

  return isVisible;
};

export default useTimedReveal;