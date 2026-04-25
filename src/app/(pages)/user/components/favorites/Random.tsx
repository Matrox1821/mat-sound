"use client";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { useAppUIStore } from "@/store/appUIStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { Shuffle } from "@/components/ui/icons/playback/Shuffle";

export function Random({
  playlistName,
  tracksList,
  upcoming,
}: {
  playlistName: string;
  tracksList: any[] | null;
  upcoming: any[] | null;
}) {
  const { playingFrom, playShufflePlaylistOn } = usePlayerStore((state) => state);
  const { togglePlay, isPlaying } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);

  if (!tracksList) return null;

  const tracks = tracksList.map((newTrack) => parseTrackByPlayer(newTrack));
  const togglePlayPlaylist = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!playerBarIsActive) activePlayerBar();
    if (playingFrom !== playlistName) {
      playShufflePlaylistOn({
        tracks,
        from: playlistName,
        upcoming: upcoming?.map((newTrack) => parseTrackByPlayer(newTrack)),
      });
      if (!isPlaying) togglePlay();
    }
  };

  return (
    <button
      className="flex bg-background-50/25 text-white font-semibold p-2 rounded-xl gap-1 cursor-pointer hover:brightness-85 transition-[filter] duration-200 items-center shadow-md"
      onClick={togglePlayPlaylist}
    >
      <Shuffle height={28} width={28} />
      <span className="uppercase">Aleatorio</span>
    </button>
  );
}
