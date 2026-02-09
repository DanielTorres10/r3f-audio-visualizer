import { useEffect, useState } from "react";
import { type AudioSourceControlsProps } from "@/components/audio/sourceControls/common";
import { useValentineAudioContext } from "@/context/valentineAudio";

/**
 * ValentineAudioPlayer - Handles Valentine audio playback coordination
 * Similar to FileAudioPlayer but watches ValentineAudioContext for URLs instead of files
 */
const ValentineAudioPlayer = ({ audio }: AudioSourceControlsProps) => {
  try {
    const { config: { audioUrl } } = useValentineAudioContext();
    const [isPlaying, setIsPlaying] = useState(false);

    // Handle URL changes - set src and play
    useEffect(() => {
      if (!audioUrl) {
        if (audio.src) {
          audio.pause();
          audio.src = "";
          setIsPlaying(false);
        }
        return;
      }

      // Set the source directly (no need to createObjectURL)
      audio.src = audioUrl;

      // Try to auto-play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            setIsPlaying(false);
          });
      }

      return () => {
        // Cleanup on unmount
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      };
    }, [audioUrl, audio]);

    // Track playback state
    useEffect(() => {
      const handlePlay = () => {
        setIsPlaying(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }, [audio]);

    return <></>;
  } catch (error) {
    return null;
  }
};

export default ValentineAudioPlayer;
