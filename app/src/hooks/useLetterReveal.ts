import { useEffect, useState } from "react";
import { useAppState } from "@/lib/appState";

export const useLetterReveal = (
  triggerTime: number,
  text: string,
  revealDurationSeconds: number = 30
) => {
  const [revealedLetters, setRevealedLetters] = useState(0);
  const audioTime = useAppState((state) => state.valentine.audioTime);

  useEffect(() => {
    if (audioTime >= triggerTime) {
      // Calculate how many letters to show based on time elapsed since trigger
      const timeElapsed = audioTime - triggerTime;
      // Reveal letters evenly across the reveal duration
      const lettersToShow = Math.floor(
        (timeElapsed / revealDurationSeconds) * text.length
      ) + 1;
      setRevealedLetters(Math.min(lettersToShow, text.length));
    }
  }, [audioTime, triggerTime, text.length, revealDurationSeconds]);

  return text.substring(0, revealedLetters);
};

export default useLetterReveal;
