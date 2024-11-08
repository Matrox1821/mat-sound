import { useEffect, useState, type RefObject } from "react";
import { usePlayer } from "./usePlayer";
import { usePlayerStore } from "src/store/playerStore";

export const useProgress = (audio: RefObject<HTMLAudioElement>) => {
  const { inLoop, currentMusic, setCurrentMusic } = usePlayerStore(
    (state) => state
  );
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
    if (audio.current?.currentTime === audio.current?.duration) {
      if (inLoop === "none") handleNext();
      if (inLoop === "all") {
        const lastTrackIndex = currentMusic.tracks
          ? currentMusic.tracks.length - 1
          : 0;
        const currentTrackIsLast =
          currentMusic.tracks![lastTrackIndex].id === currentMusic.track?.id;
        if (currentTrackIsLast) {
          const { track, ...rest } = currentMusic;
          setCurrentMusic({ ...rest, track: currentMusic.tracks![0] });
        }
        if (!currentTrackIsLast) handleNext();
      }

      if (inLoop === "one") {
        setCurrentTime(0);
        audio.current?.play();
      }
    }
  };

  function updatePositionState() {
    navigator.mediaSession.setPositionState({
      duration: audio.current?.duration,
      position: currentTime,
    });
  }
  return { currentTime };
};
