import { useEffect, useState, useRef } from "react";
import { Suspense } from "react";
import ProposalScreen from "@/components/proposal/ProposalScreen";
import Visual3DCanvas from "@/components/canvas/Visual3D";
import TimedReveals from "@/components/reveals/TimedReveals";
import { APPLICATION_MODE } from "@/lib/applicationModes";
import { useValentineState, useAppStateActions } from "@/lib/appState";
import AudioAnalyzer from "@/components/analyzers/audioAnalyzer";
import { useValentineAudioContext } from "@/context/valentineAudio";
import ValentineControls from "@/components/audio/ValentineControls";
import useVisualizerCycle from "@/hooks/useVisualizerCycle";
import usePaletteCycle from "@/hooks/usePaletteCycle";

export const ValentineApp = ({
  harryStylesAudioPath = "/r3f-audio-visualizer/audio/hs.mp3",
}) => {
  const { currentPhase } = useValentineState();
  const { setValentinePhase, setMode, initValentineMode, updateAudioTime } =
    useAppStateActions();
  const { setAudioUrl } = useValentineAudioContext();
  const audioStartTimeRef = useRef<number | null>(null);

  // Initialize Valentine mode
  useEffect(() => {
    initValentineMode();
    setMode(APPLICATION_MODE.AUDIO);
  }, [initValentineMode, setMode]);

  // Track elapsed time for reveals using a timer instead of audio.currentTime
  useEffect(() => {
    if (currentPhase !== "visual-journey" && currentPhase !== "complete") {
      return;
    }

    const elapsedInterval = setInterval(() => {
      if (audioStartTimeRef.current === null) {
        return;
      }

      const elapsedSeconds =
        (Date.now() - audioStartTimeRef.current) / 1000;
      updateAudioTime(elapsedSeconds);
    }, 100);

    return () => clearInterval(elapsedInterval);
  }, [currentPhase, updateAudioTime]);

  const handleProposalComplete = () => {
    // Record when audio will start playing
    audioStartTimeRef.current = Date.now();
    // Set audio URL in context - ValentineAudioPlayer will handle playback
    setAudioUrl(harryStylesAudioPath);
  };

  // Cycle through visualizers based on hardcoded schedule
  useVisualizerCycle(
    currentPhase === "visual-journey" || currentPhase === "complete"
  );

  // Cycle through color palettes every 15 seconds during visual journey
  usePaletteCycle(
    currentPhase === "visual-journey" || currentPhase === "complete",
    15
  );

  return (
    <main className="relative h-[100dvh] w-[100dvw] bg-black overflow-hidden">
      {/* Phase 1: Proposal Screen */}
      {currentPhase === "proposal" && (
        <ProposalScreen onComplete={handleProposalComplete} />
      )}

      {/* Phase 2 & 3: Visual Journey with Audio and Reveals */}
      {(currentPhase === "visual-journey" || currentPhase === "complete") && (
        <>
          {/* Audio Analyzer */}
          <AudioAnalyzer mode={APPLICATION_MODE.AUDIO} />

          {/* 3D Visualization Canvas */}
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<div className="w-full h-full bg-black" />}>
              <Visual3DCanvas />
            </Suspense>
          </div>

          {/* Timed Text Reveals */}
          <TimedReveals imageUrl="/r3f-audio-visualizer/images/harry-styles-together.png" />

          {/* Audio Controls (Valentine) */}
          <ValentineControls />

        </>
      )}
    </main>
  );
};

export default ValentineApp;
