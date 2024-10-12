import { useEffect, useState, type RefObject } from "react";

export function ProgressBar({ audio }: { audio: RefObject<HTMLAudioElement> }) {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    if (audio.current) {
      audio.current.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audio.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audio.current, currentTime]);

  const handleTimeUpdate = () => {
    setCurrentTime(audio.current ? audio.current.currentTime : 0);
  };
  const progress =
    audio.current && currentTime
      ? (currentTime * 100) / audio.current.duration
      : 0;

  return (
    <div className="w-[calc(100%-16px)] h-[3px] bg-black/50 rounded-sm mx-2 flex">
      <span
        style={{
          width: `${progress}%`,
        }}
        className="bg-white h-[3px] rounded-sm"
      />
    </div>
  );
}
