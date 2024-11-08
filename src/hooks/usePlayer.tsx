import { useEffect, useState, type RefObject } from "react";
import { sortArray } from "src/shared/helpers";

import { usePlayerStore } from "src/store/playerStore";

export const usePlayer = (audio: RefObject<HTMLAudioElement>) => {
  const {
    currentMusic,
    isPlaying,
    setIsPlaying,
    setCurrentMusic,
    setPlayerScreenIsOpen,
    setInLoop,
    inLoop,
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

    const indexTrack = currentMusic.playlist?.findIndex(
      (newTrack) => newTrack.id === currentMusic.track?.id
    );
    if (indexTrack == null) return;
    setPlaylistManager({
      hasPrevious: indexTrack !== 0,
      hasNext: indexTrack + 1 < currentMusic.playlist!.length,
    });
  }, [currentMusic]);

  useEffect(() => {
    if (!audio.current) return;
    isPlaying ? audio.current.play() : audio.current.pause();
  }, [isPlaying]);

  const openPlayerScreen = () => {
    setPlayerScreenIsOpen(true);
    const body = document.querySelector("body");
    if (body) body.style.overflowY = "hidden";
  };

  const handlePrevious = () => {
    if (!currentMusic.playlist || !playlistManager?.hasPrevious) return;

    const indexTrack = currentMusic.playlist.findIndex(
      (track) => track.id === currentMusic.track?.id
    );
    const { playlist, ...rest } = currentMusic;
    setCurrentMusic({
      ...rest,
      track: playlist![indexTrack - 1],
      playlist,
    });
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (!currentMusic.playlist || !playlistManager?.hasNext) return;

    const indexTrack = currentMusic.playlist.findIndex(
      (track) => track.id === currentMusic.track?.id
    );
    const { playlist, ...rest } = currentMusic;

    setCurrentMusic({
      ...rest,
      track: playlist![indexTrack + 1],
      playlist,
    });
    setIsPlaying(true);
  };

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  const handleShuffle = () => {
    const { track, playlist } = currentMusic;
    const newPlaylist = sortArray(playlist);
    setIsPlaying(true);
    setCurrentMusic({
      track: newPlaylist ? newPlaylist[0] : track,
      tracks: newPlaylist,
      playlist: newPlaylist,
      nextTracks: [],
    });
  };

  const handleLoop = () => {
    setInLoop(inLoop === "none" ? "all" : inLoop === "all" ? "one" : "none");
  };

  return {
    handlePrevious,
    handleNext,
    handlePlay,
    playlistManager,
    openPlayerScreen,
    handleShuffle,
    handleLoop,
  };
};
