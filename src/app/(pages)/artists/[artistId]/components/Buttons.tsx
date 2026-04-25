"use client";
import { Pause } from "@components/ui/icons/playback/Pause";
import { Play } from "@components/ui/icons/playback/Play";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { useAppUIStore } from "@/store/appUIStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { ArtistTracks } from "@shared-types/artist.types";

export function PlayButton({
  tracksList,
  upcomingList,
  artistName,
  artistId,
}: {
  tracksList: ArtistTracks[] | null;
  upcomingList?: ArtistTracks[] | null;
  artistName: string;
  artistId: string;
}) {
  const { setTrack, getCurrentTrack, setPlayingFrom, playingFrom, setUpcoming } = usePlayerStore(
    (state) => state,
  );
  const currentTrack = getCurrentTrack();
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);

  if (!tracksList) return null;
  const tracks = tracksList.map((newTrack) => parseTrackByPlayer(newTrack));

  const playAlbum = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (!playerBarIsActive) activePlayerBar();
    if (tracks[0].id === currentTrack?.id || artistName === playingFrom?.from) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      setTrack(tracks[0], tracks);
      setPlayingFrom({ from: artistName, href: `artists/${artistId}` });
      if (upcomingList) {
        const upcoming = upcomingList.map((newTrack) => parseTrackByPlayer(newTrack));
        setUpcoming(upcoming);
      }
      play();
    }
  };

  return (
    <button
      className="rounded-full bg-accent-950 w-14 h-14 cursor-pointer hover:scale-105 hover:bg-accent-900 flex items-center justify-center"
      onClick={playAlbum}
    >
      {playingFrom && artistName === playingFrom.from && isPlaying ? (
        <Pause className="text-background-950 h-7 w-7" />
      ) : (
        <Play className="text-background-950 h-7 w-7 ml-[1px]" />
      )}
    </button>
  );
}
