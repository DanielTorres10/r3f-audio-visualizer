import { useCallback, useEffect, useState } from "react";
import {
  iOS,
  type AudioSourceControlsProps,
} from "@/components/audio/sourceControls/common";
import { useFileUploadContext } from "@/context/fileUpload";

import "@/components/audio/sourceControls/overlay.css";

/**
 * FileAudioPlayer - Handles file playback coordination
 * Watches FileUploadContext for selected files and plays them on the provided audio element
 */
const FileAudioPlayer = ({ audio }: AudioSourceControlsProps) => {
  try {
    const { config: { file } } = useFileUploadContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [loaded, setLoaded] = useState(false);

    console.log("[FileAudioPlayer] Rendering with audio:", !!audio, "file:", file?.name || "none");

    // Handle file changes - set src and play
    useEffect(() => {
      if (!file) {
        if (audio.src) {
          audio.pause();
          setIsPlaying(false);
        }
        console.log("[FileAudioPlayer] No file selected");
        return;
      }

      console.log("[FileAudioPlayer] File changed:", file.name);
      console.log("[FileAudioPlayer] Audio element:", !!audio, "audio.src before:", audio.src);
      
      // Create object URL from selected file
      const audioUrl = URL.createObjectURL(file);
      
      // Set the source on the analyzer's audio element
      audio.src = audioUrl;
      console.log("[FileAudioPlayer] Set audio.src to:", audioUrl);

      // Try to auto-play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log("[FileAudioPlayer] ✅ Now playing:", file.name);
          })
          .catch((err) => {
            console.warn("[FileAudioPlayer] ⚠️ Auto-play prevented:", err.message);
            setIsPlaying(false);
          });
      }

      return () => {
        console.log("[FileAudioPlayer] Cleanup - revoking URL");
        URL.revokeObjectURL(audioUrl);
      };
    }, [file, audio]);

    // Track when audio can play
    useEffect(() => {
      const handleCanPlay = () => {
        setLoaded(true);
        console.log("[FileAudioPlayer] Audio can play");
      };

      const handleEnded = () => {
        setIsPlaying(false);
        console.log("[FileAudioPlayer] Audio ended");
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      return () => {
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
      };
    }, [audio]);

    // iOS needs a dedicated play button
    const handlePlayClick = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          console.log("[FileAudioPlayer] Playing via button click");
        })
        .catch((err) => {
          console.error("[FileAudioPlayer] Play failed:", err);
        });
    };

    if (iOS()) {
      return (
        <div
          id="info"
          style={{
            top: "1rem",
            left: "1rem",
          }}
          hidden={isPlaying}
        >
          {loaded ? (
            <button disabled={!loaded || isPlaying} onClick={handlePlayClick}>
              Play Audio
            </button>
          ) : (
            <>
              <h2>Load a file</h2>
              <p>Use the controls panel to upload an audio file.</p>
            </>
          )}
        </div>
      );
    }

    return <></>;
  } catch (error) {
    console.error("[FileAudioPlayer] Error:", error);
    return null;
  }
};

export default FileAudioPlayer;
