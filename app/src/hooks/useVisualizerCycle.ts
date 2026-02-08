import { useEffect, useRef } from 'react';
import { useAppStateActions } from '@/lib/appState';

type VisualizerId = 
  | "scope" 
  | "grid" 
  | "cube" 
  | "sphere" 
  | "diffusedRing" 
  | "dna" 
  | "movingBoxes" 
  | "ribbons" 
  | "treadmill";

const useVisualizerCycle = (isActive: boolean) => {
  const { setVisual } = useAppStateActions();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastVisualizerRef = useRef<VisualizerId | null>(null);
  
  const schedule: { time: number; visualizer: VisualizerId }[] = [
    { time: 0, visualizer: 'diffusedRing' },
    { time: 31, visualizer: 'cube' },
    { time: 46, visualizer: 'sphere' },
    { time: 61, visualizer: 'cube' },
    { time: 75, visualizer: 'diffusedRing' },
    { time: 76, visualizer: 'grid' },
    { time: 91, visualizer: 'ribbons' },
    { time: 106, visualizer: 'sphere' },
    { time: 121, visualizer: 'movingBoxes' },
    { time: 151, visualizer: 'diffusedRing' },
    { time: 155, visualizer: 'sphere' },
    { time: 159, visualizer: 'diffusedRing' },
    { time: 162, visualizer: 'sphere' },
    { time: 173, visualizer: 'dna' },
    { time: 188, visualizer: 'movingBoxes' },
    { time: 218, visualizer: 'grid' },
    { time: 248, visualizer: 'treadmill' },
    { time: 278, visualizer: 'cube' },
  ];
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastVisualizerRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      const audioElement = (window as any).__valentineAudio as HTMLAudioElement;
      if (!audioElement || !audioElement.currentTime) {
        return;
      }

      const currentTime = audioElement.currentTime;
      let activeVisualizer: VisualizerId | null = null;
      
      const sortedSchedule = [...schedule].sort((a, b) => a.time - b.time);
      
      for (let i = sortedSchedule.length - 1; i >= 0; i--) {
        if (currentTime >= sortedSchedule[i].time) {
          activeVisualizer = sortedSchedule[i].visualizer;
          break;
        }
      }
      
      if (!activeVisualizer && sortedSchedule.length > 0) {
        activeVisualizer = sortedSchedule[0].visualizer;
      }

      if (activeVisualizer && activeVisualizer !== lastVisualizerRef.current) {
        lastVisualizerRef.current = activeVisualizer;
        setVisual(activeVisualizer);
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastVisualizerRef.current = null;
    };
  }, [isActive, setVisual]);

  return null;
};

export default useVisualizerCycle;