import { useEffect, useState, type RefObject } from "react";
import { usePlayer } from "./usePlayer";

export const useProgress = (audio: RefObject<HTMLAudioElement>) => {
  const { handleNext } = usePlayer(audio);
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
    updatePositionState();
    if (audio.current?.currentTime === audio.current?.duration) handleNext();
  };

  function updatePositionState() {
    navigator.mediaSession.setPositionState({
      duration: audio.current?.duration,
      playbackRate: audio.current?.currentTime,
      position: audio.current?.currentTime,
    });
  }
  return { currentTime };
};
