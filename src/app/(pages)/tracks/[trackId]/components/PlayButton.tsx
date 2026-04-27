import { Play } from "@/components/ui/icons/playback/Play";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { useAppUIStore } from "@/store/appUIStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";

export function PlayButton({ track, upcoming }: { track: any | null; upcoming: any[] | null }) {
  const { setTrack, setPlayingFrom, setUpcoming } = usePlayerStore((state) => state);
  const { play } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);

  if (!track) return null;

  const parsedTrack = parseTrackByPlayer(track);
  const playAlbum = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!playerBarIsActive) activePlayerBar();
    setTrack(parsedTrack, [parsedTrack]);
    setPlayingFrom({ from: parsedTrack.name, href: `tracks/${parsedTrack.id}` });
    if (upcoming) setUpcoming(upcoming.map((newTrack) => parseTrackByPlayer(newTrack)));
    play();
  };

  return (
    <button
      className="flex bg-content-900 text-background font-semibold py-2 pl-3 pr-4 rounded-lg gap-2 cursor-pointer hover:brightness-70 transition-[filter] duration-200"
      onClick={playAlbum}
    >
      <Play />
      Reproducir
    </button>
  );
}
