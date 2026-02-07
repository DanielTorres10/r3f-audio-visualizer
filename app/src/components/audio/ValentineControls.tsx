import { useEffect, useState, useRef } from "react";
import { useValentineAudioContext } from "@/context/valentineAudio";

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

const ValentineControls = () => {
  const { config } = useValentineAudioContext();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [volume, setVolume] = useState(1);
  const pollingRef = useRef<number | null>(null);

  // find audio element (window.__valentineAudio) and attach listeners
  useEffect(() => {
    const tryFind = () => {
      const a = (window as any).__valentineAudio as HTMLAudioElement | undefined;
      if (a) {
        setAudio(a);
        return true;
      }
      // fallback to any audio in DOM
      const domAudio = document.querySelector("audio") as HTMLAudioElement | null;
      if (domAudio) {
        setAudio(domAudio);
        return true;
      }
      return false;
    };

    if (!tryFind()) {
      pollingRef.current = window.setInterval(() => {
        if (tryFind() && pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }, 250);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [config.audioUrl]);

  useEffect(() => {
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || null);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);

    // sync initial values
    setPlaying(!audio.paused);
    setTime(audio.currentTime || 0);
    setDuration(isFinite(audio.duration) ? audio.duration : null);
    setVolume(audio.volume ?? 1);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [audio]);

  const togglePlay = () => {
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return;
    const v = Number(e.target.value);
    audio.currentTime = v;
    setTime(v);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return;
    const v = Number(e.target.value);
    audio.volume = v;
    setVolume(v);
  };

  if (!config.audioUrl && !audio) return null;

  return (
    <div className="absolute left-4 bottom-6 z-50 pointer-events-auto">
      <div className="bg-black bg-opacity-60 text-white p-3 rounded-md flex items-center gap-3">
        <button onClick={togglePlay} className="px-3 py-1 bg-pink-500 rounded">
          {playing ? "Pause" : "Play"}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm">{formatTime(time)}</span>
          <input
            type="range"
            min={0}
            max={duration ?? 1}
            step={0.1}
            value={time}
            onChange={onSeek}
            className="w-48"
          />
          <span className="text-sm">{duration ? formatTime(duration) : "--:--"}</span>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolume}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default ValentineControls;
