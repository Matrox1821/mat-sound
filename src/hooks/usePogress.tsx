import { useEffect, useState, type RefObject } from "react";

export const useProgress = (audio: RefObject<HTMLAudioElement>) => {
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
  return { currentTime };
};
