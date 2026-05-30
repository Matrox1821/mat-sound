import { Play } from "@/components/ui/icons/playback/Play";
import { useRefillUpcoming } from "@/shared/client/hooks/player/useRefillUpcoming";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { useAppUIStore } from "@/store/appUIStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";

export function PlayButton({
  track,
  playingFrom: newPlayingFrom,
}: {
  track: any | null;
  playingFrom: { from: string; href: string };
}) {
  const { setTrack, refillUpcoming, getCurrentTrack, setPlayingFrom, reset, playingFrom } =
    usePlayerStore();
  const { isPlaying, play, pause } = usePlaybackStore();
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);
  const currentTrack = getCurrentTrack();
  const { error } = useToast();
  useRefillUpcoming({ refillUpcoming, currentTrack: !!getCurrentTrack() });

  if (!track) return null;

  const parsedTrack = parseTrackByPlayer(track);
  const playAlbum = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!track || !track.song) {
      error("No existe una pista de audio para reproducir.");
      return;
    }
    if (!playerBarIsActive) activePlayerBar();
    if (track.id === currentTrack?.id && playingFrom?.from === newPlayingFrom.from) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      reset();
      setTrack(track, []);
      setPlayingFrom(newPlayingFrom);
      refillUpcoming();
      play();
    }
    setTrack(parsedTrack, [parsedTrack]);
    setPlayingFrom({ from: parsedTrack.name, href: `tracks/${parsedTrack.id}` });
    refillUpcoming();
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
