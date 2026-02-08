import { useEffect, useRef, useCallback } from "react";
import { Suspense } from "react";
import ProposalScreen from "@/components/proposal/ProposalScreen";
import Visual3DCanvas from "@/components/canvas/Visual3D";
import TimedReveals from "@/components/reveals/TimedReveals";
import { APPLICATION_MODE } from "@/lib/applicationModes";
import { useValentineState, useAppStateActions, useAppearance, useAudio } from "@/lib/appState";
import AudioAnalyzer from "@/components/analyzers/audioAnalyzer";
import { useValentineAudioContext } from "@/context/valentineAudio";
import ValentineControls from "@/components/audio/ValentineControls";
import useVisualizerCycle from "@/hooks/useVisualizerCycle";
import { ControlsPanel } from "./components/controls/main";

export const ValentineApp = ({
  harryStylesAudioPath = "/r3f-audio-visualizer/audio/hs.mp3",
}) => {
  const { currentPhase } = useValentineState();
  const { setMode, initValentineMode } = useAppStateActions();
  const { setAudioUrl } = useValentineAudioContext();
  const audioStartTimeRef = useRef<number | null>(null);
  
  // Track interval for cleanup
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Valentine mode
  useEffect(() => {
    initValentineMode();
    setMode(APPLICATION_MODE.AUDIO);
    
    return () => {
      // Cleanup on unmount
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
    };
  }, [initValentineMode, setMode]);

  const handleProposalComplete = useCallback(() => {
    // Record when audio will start playing
    audioStartTimeRef.current = Date.now();
    // Set audio URL in context - ValentineAudioPlayer will handle playback
    setAudioUrl(harryStylesAudioPath);
  }, [setAudioUrl, harryStylesAudioPath]);

  // Cycle through visualizers based on audio timing
  const isVisualJourney = currentPhase === "visual-journey" || currentPhase === "complete";
  useVisualizerCycle(isVisualJourney);

  return (
    <main className="relative h-[100dvh] w-[100dvw] bg-black overflow-hidden">
      {/* Phase 1: Proposal Screen */}
      {currentPhase === "proposal" && (
        <ProposalScreen onComplete={handleProposalComplete} />
      )}

      {/* Always render the visualizer but control opacity */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${
        isVisualJourney ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <Suspense fallback={
          <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="text-white">Loading 3D visualization...</div>
          </div>
        }>
          <Visual3DCanvas />
        </Suspense>
      </div>

      {/* Phase 2 & 3: Visual Journey with Audio and Reveals */}
      {isVisualJourney && (
        <>
          {/* Audio Analyzer */}
          <AudioAnalyzer mode={APPLICATION_MODE.AUDIO} />

          {/* Timed Text Reveals */}
          <TimedReveals imageUrl="/r3f-audio-visualizer/images/harry-styles-together.png" />

          {/* Audio Controls (Valentine) */}
          <ValentineControls />

          <ControlsPanel />
        </>
      )}
    </main>
  );
};

export default ValentineApp;