"use client";
import { Play } from "@components/ui/icons/playback/Play";
import { Shuffle } from "@components/ui/icons/playback/Shuffle";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { useProgressStore } from "@/store/progressStore";
import { useState } from "react";
import { useAppUIStore } from "@/store/appUIStore";
import { useRefillUpcoming } from "@/shared/client/hooks/player/useRefillUpcoming";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function PlayButton({
  currently,
  tracksList,
  albumName,
  albumId,
}: {
  currently: any | null;
  tracksList: any[] | null;
  albumName: string;
  albumId: string;
}) {
  const { setTrack, setPlayingFrom, refillUpcoming, getCurrentTrack } = usePlayerStore(
    (state) => state,
  );
  const { play } = usePlaybackStore((state) => state);
  const { setDuration } = useProgressStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);
  useRefillUpcoming({ refillUpcoming, currentTrack: !!getCurrentTrack() });

  if (!currently || !tracksList) return null;

  const track = parseTrackByPlayer(currently);
  const tracks = tracksList.map((newTrack) => parseTrackByPlayer(newTrack));
  const playAlbum = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!playerBarIsActive) activePlayerBar();
    setTrack(track, tracks);
    setDuration(track.duration);
    setPlayingFrom({ from: albumName, href: `albums/${albumId}` });
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

export function RandButton({
  tracksList,
  albumName,
  albumId,
}: {
  tracksList: any[] | null;
  albumName: string;
  albumId: string;
}) {
  const { setTrack, setPlayingFrom, refillUpcoming, getCurrentTrack } = usePlayerStore(
    (state) => state,
  );
  const { play } = usePlaybackStore((state) => state);
  const { setDuration } = useProgressStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);
  const [random] = useState(() => Math.random());
  useRefillUpcoming({ refillUpcoming, currentTrack: !!getCurrentTrack() });

  if (!tracksList) return null;

  const parsedTracks = tracksList.map((newTrack) => parseTrackByPlayer(newTrack));
  const track = parsedTracks[Math.floor(random * parsedTracks.length)];
  const tracks = shuffleArray(parsedTracks.filter((t) => track.id !== t.id));

  const playAlbum = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!playerBarIsActive) activePlayerBar();

    setTrack(track, tracks);
    setDuration(track.duration);
    refillUpcoming();
    setPlayingFrom({ from: albumName, href: `album/${albumId}` });
    play();
  };

  return (
    <button
      className="flex bg-background-700 text-content-950 font-semibold py-2 pl-3 pr-4 rounded-lg gap-2 cursor-pointer hover:brightness-130 transition-[filter] duration-200"
      onClick={playAlbum}
    >
      <Shuffle />
      Aleatorio
    </button>
  );
}
