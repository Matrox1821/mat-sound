"use client";
import { Play as PlayIcon } from "@components/ui/icons/playback/Play";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { useAppUIStore } from "@/store/appUIStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { useProgressStore } from "@/store/progressStore";
import { Pause } from "@/components/ui/icons/playback/Pause";

export function Play({
  playlistName,
  currently,
  tracksList,
  upcoming,
}: {
  playlistName: string;
  currently: any | null;
  tracksList: any[] | null;
  upcoming: any[] | null;
}) {
  const { setTrack, setPlayingFrom, setUpcoming, playingFrom } = usePlayerStore((state) => state);
  const { togglePlay, isPlaying } = usePlaybackStore((state) => state);
  const { setDuration } = useProgressStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);

  if (!currently || !tracksList) return null;

  const track = parseTrackByPlayer(currently);
  const tracks = tracksList.map((newTrack) => parseTrackByPlayer(newTrack));
  const togglePlayPlaylist = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!playerBarIsActive) activePlayerBar();
    if (isPlaying && playingFrom === playlistName) {
      togglePlay();
    } else {
      setTrack(track, tracks);
      setDuration(track.duration);
      setPlayingFrom(playlistName);
      if (upcoming) setUpcoming(upcoming.map((newTrack) => parseTrackByPlayer(newTrack)));
      togglePlay();
    }
  };

  return (
    <button
      className="flex bg-content-900 text-background font-semibold p-4 rounded-full gap-2 cursor-pointer hover:brightness-70 transition-[filter] duration-200"
      onClick={togglePlayPlaylist}
    >
      {isPlaying && playingFrom === playlistName ? (
        <Pause height={34} width={34} />
      ) : (
        <PlayIcon height={34} width={34} />
      )}
    </button>
  );
}
