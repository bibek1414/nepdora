import { useRef, useState, useEffect } from "react";

interface VoiceMessageProps {
  audioSrc: string;
}

export function VoiceMessage({ audioSrc }: VoiceMessageProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const loaded = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", loaded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", loaded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex w-full items-center gap-3 rounded-3xl bg-blue-500 px-4 py-3 text-white shadow-lg">
      <button
        onClick={togglePlay}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/30 transition hover:bg-white/50"
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative flex h-5 w-full items-center">
          <Waveform isPlaying={isPlaying} progress={progress} />
        </div>

        <div className="mt-1 text-xs text-white/80">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}

interface WaveformProps {
  isPlaying: boolean;
  progress: number;
}

function Waveform({ isPlaying, progress }: WaveformProps) {
  const bars = 20;
  return (
    <div className="relative flex h-5 w-full items-end justify-between">
      {[...Array(bars)].map((_, i) => {
        const height = Math.random() * 8 + 4;
        const delay = i * 0.05;
        return (
          <div
            key={i}
            className={`rounded-full bg-white transition-all duration-300 ease-in-out ${
              isPlaying ? "animate-wave" : ""
            }`}
            style={{
              width: "3px",
              height: `${height}px`,
              animationDelay: `${delay}s`,
              opacity: i / bars < progress / 100 ? 1 : 0.3,
            }}
          />
        );
      })}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.5); }
        }
        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
