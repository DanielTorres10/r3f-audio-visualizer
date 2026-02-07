import { useEffect } from "react";
import { useAppState, useAppStateActions } from "@/lib/appState";
import {
  VISUAL_REGISTRY,
  type TVisualId,
} from "@/components/visualizers/registry";

// Define visualizers with their start times (in seconds)
interface VisualizerSchedule {
  id: TVisualId;
  startTime: number;
}

const VISUALIZER_SCHEDULE: VisualizerSchedule[] = [
  { id: "cube", startTime: 0 },
  { id: "grid", startTime: 31 },
  { id: "sphere", startTime: 62 },
  { id: "diffusedRing", startTime: 90 },
  { id: "movingBoxes", startTime: 121 },
  { id: "dna", startTime: 150 },
  { id: "ribbons", startTime: 180 },
  { id: "treadmill", startTime: 210 },
  { id: "swarm", startTime: 240 },
];

export const useVisualizerCycle = (enabled: boolean) => {
  const audioTime = useAppState((state) => state.valentine.audioTime);
  const currentVisualId = useAppState((state) => state.visual.id);
  const { setVisual } = useAppStateActions();

  useEffect(() => {
    if (!enabled) return;

    // Find the visualizer that should be active at the current time
    let nextVisualizerId: TVisualId | null = null;

    for (let i = VISUALIZER_SCHEDULE.length - 1; i >= 0; i--) {
      if (audioTime >= VISUALIZER_SCHEDULE[i].startTime) {
        nextVisualizerId = VISUALIZER_SCHEDULE[i].id;
        break;
      }
    }

    // Only update if a valid visualizer is found and it's different from current
    if (nextVisualizerId && nextVisualizerId !== currentVisualId) {
      setVisual(nextVisualizerId);
    }
  }, [audioTime, enabled, setVisual, currentVisualId]);
};

export default useVisualizerCycle;



