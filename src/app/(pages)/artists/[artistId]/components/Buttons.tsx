"use client";
import { Pause } from "@/components/ui/icons/playback/Pause";
import { Play } from "@/components/ui/icons/playback/Play";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { useUIStore } from "@/store/activeStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { artistTracksProps } from "@/types";

export function PlayButton({
  tracksList,
  artistName,
}: {
  tracksList: artistTracksProps[] | null;
  artistName: string | null;
}) {
  const { setTrack, currentTrack, setPlayingFrom, playingFrom } = usePlayerStore((state) => state);
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useUIStore((state) => state);

  if (!tracksList) return null;
  const tracks = tracksList.map((newTrack) => parseTrackByPlayer(newTrack));
  const playAlbum = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (!playerBarIsActive) activePlayerBar();
    if (tracks[0].id === currentTrack?.id || artistName === playingFrom) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      setTrack(tracks[0], tracks);
      setPlayingFrom(artistName || "");
      play();
    }
  };

  return (
    <button
      className="rounded-full bg-accent-950 w-14 h-14 cursor-pointer hover:scale-105 hover:bg-accent-900 flex items-center justify-center"
      onClick={playAlbum}
    >
      {artistName === playingFrom && isPlaying ? (
        <Pause className="text-background-950 h-7 w-7" />
      ) : (
        <Play className="text-background-950 h-7 w-7 ml-[1px]" />
      )}
    </button>
  );
}
