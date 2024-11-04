import { useEffect, useState, type RefObject } from "react";
import { usePlayerStore } from "src/store/playerStore";

export const usePlayer = (audio: RefObject<HTMLAudioElement>) => {
  const {
    currentMusic,
    isPlaying,
    setIsPlaying,
    setCurrentMusic,
    setPlayerScreenIsOpen,
  } = usePlayerStore((state) => state);

  const [playlistManager, setPlaylistManager] = useState<{
    hasPrevious: boolean;
    hasNext: boolean;
  }>();

  useEffect(() => {
    if (!currentMusic.track || !audio.current) return;

    audio.current.src = currentMusic.track.song_url;
    audio.current.volume = 0.2;
    audio.current.play();

    const indexTrack = currentMusic.tracks?.findIndex(
      (newTrack) => newTrack.id === currentMusic.track?.id
    );

    if ("mediaSession" in navigator && audio.current) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMusic.track.name,
        artist: currentMusic.track.artist?.name,
        album: currentMusic.track.album?.name,
        artwork: [
          {
            src: currentMusic.track.image,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        handlePrevious()
      );
      navigator.mediaSession.setActionHandler("nexttrack", () => handleNext());
    }
    if (indexTrack == null) return;
    setPlaylistManager({
      hasPrevious: indexTrack !== 0,
      hasNext: indexTrack + 1 < currentMusic.tracks!.length,
    });
  }, [currentMusic]);

  useEffect(() => {
    if (!audio.current) return;
    isPlaying ? audio.current.play() : audio.current.pause();
  }, [isPlaying]);

  const openPlayerScreen = () => {
    setPlayerScreenIsOpen(true);
  };

  const handlePrevious = () => {
    if (!currentMusic.tracks || !playlistManager?.hasPrevious) return;

    const indexTrack = currentMusic.tracks.findIndex(
      (track) => track.id === currentMusic.track?.id
    );

    setCurrentMusic({
      track: currentMusic.tracks![indexTrack - 1],
      tracks: currentMusic.tracks,
    });
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (!currentMusic.tracks || !playlistManager?.hasNext) return;

    const indexTrack = currentMusic.tracks.findIndex(
      (track) => track.id === currentMusic.track?.id
    );

    setCurrentMusic({
      track: currentMusic.tracks![indexTrack + 1],
      tracks: currentMusic.tracks,
    });
    setIsPlaying(true);
  };

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  return {
    handlePrevious,
    handleNext,
    handlePlay,
    playlistManager,
    openPlayerScreen,
  };
};
