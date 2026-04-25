"use client";
import { Play as PlayIcon } from "@components/ui/icons/playback/Play";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { useAppUIStore } from "@/store/appUIStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { useProgressStore } from "@/store/progressStore";
import { Pause } from "@/components/ui/icons/playback/Pause";

export function Play({
  currently,
  tracksList,
  upcoming,
}: {
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
    if (isPlaying && playingFrom?.from === "Favorites") {
      togglePlay();
    } else {
      setTrack(track, tracks);
      setDuration(track.duration);
      setPlayingFrom({ from: "Favorites", href: `user/favorites` });

      if (upcoming) setUpcoming(upcoming.map((newTrack) => parseTrackByPlayer(newTrack)));
      togglePlay();
    }
  };

  return (
    <button
      className="flex bg-linear-200 from-accent-500/90 via-20% via-accent-700/60  to-95% to-contrast-900 text-white font-semibold p-2 rounded-xl gap-1 cursor-pointer hover:brightness-85 transition-[filter] duration-200 items-center shadow-md"
      onClick={togglePlayPlaylist}
    >
      {isPlaying && playingFrom?.from === "Favorites" ? (
        <Pause height={28} width={28} />
      ) : (
        <PlayIcon height={28} width={28} />
      )}
      <span className="">Reproducir Todo</span>
    </button>
  );
}
