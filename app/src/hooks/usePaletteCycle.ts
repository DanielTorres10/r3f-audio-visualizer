import { useEffect, useRef } from "react";
import { useAppState, useAppStateActions } from "@/lib/appState";
import {
  AVAILABLE_COLOR_PALETTES,
  type ColorPaletteType,
} from "@/lib/palettes";

export const usePaletteCycle = (
  enabled: boolean,
  cycleIntervalSeconds: number = 15
) => {
  const audioTime = useAppState((state) => state.valentine.audioTime);
  const currentPalette = useAppState((state) => state.appearance.palette);
  const { setAppearance } = useAppStateActions();
  const lastCycleIndexRef = useRef(-1);

  useEffect(() => {
    if (!enabled) return;

    // Calculate current cycle index
    const cycleIndex = Math.floor(audioTime / cycleIntervalSeconds);

    // Only pick a new random palette when the cycle index changes
    if (cycleIndex !== lastCycleIndexRef.current) {
      lastCycleIndexRef.current = cycleIndex;

      // Pick a random palette
      const randomIndex = Math.floor(
        Math.random() * AVAILABLE_COLOR_PALETTES.length
      );
      const nextPalette = AVAILABLE_COLOR_PALETTES[randomIndex];

      // Update if different from current
      if (nextPalette !== currentPalette) {
        setAppearance({ palette: nextPalette });
      }
    }
  }, [audioTime, cycleIntervalSeconds, enabled, setAppearance, currentPalette]);
};

export default usePaletteCycle;
