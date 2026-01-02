"use client";
import { Pause } from "@/components/UI/Icons/Playback/Pause";
import { Play } from "@/components/UI/Icons/Playback/Play";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { formatTime } from "@/shared/utils/helpers";
import { useUIStore } from "@/store/activeStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { trackPageProps } from "@/types";
import { playerTrackProps } from "@/types/trackProps";
import Link from "next/link";
import { use } from "react";

export default function Table({
  trackPromise,
  tracksPromise,
}: {
  trackPromise: Promise<trackPageProps | null>;
  tracksPromise: Promise<trackPageProps[] | null>;
}) {
  const trackData = use(trackPromise);
  const tracksData = use(tracksPromise);

  const { setTrack, currentTrack, setPlayingFrom, setUpcoming } = usePlayerStore((state) => state);
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useUIStore((state) => state);
  if (!trackData || !tracksData) return;

  const track = parseTrackByPlayer(trackData);
  const tracks = tracksData.map((newTrack) => parseTrackByPlayer(newTrack));
  const playTrack = (e: any, track: playerTrackProps) => {
    e.stopPropagation();
    e.preventDefault();
    if (!playerBarIsActive) activePlayerBar();
    if (track.id === currentTrack?.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      setTrack(track, []);
      setPlayingFrom(track.name);
      setUpcoming(tracks);
      play();
    }
  };
  return (
    <article className="w-full h-full relative p-8 flex flex-col gap-8 px-26 bg-background">
      <table className="w-full">
        <thead>
          <tr className="uppercase h-16 w-full text-start text-xs font-semibold text-background-400 ">
            <th className="h-full w-12 text-center font-semibold">#</th>
            <th className="h-full w-[40rem] text-start font-semibold">Título</th>
            <th className="h-full w-auto text-start font-semibold">Artista</th>
            <th className="h-full w-25 text-start font-semibold">Dur.</th>
            <th className="h-full w-10 text-start font-semibold"></th>
            <th className="h-full w-15 text-start font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            className={`h-12 ${
              currentTrack?.id === track.id
                ? "[&>td]:bg-background-950/90"
                : "hover:[&>td]:bg-background-950/90"
            } hover:[&>td>.options]:flex hover:[&>td>.playing>.icon]:!flex hover:[&>td>.playing>span]:!hidden`}
          >
            <td className="text-center text-sm text-background-400 font-semibold rounded-l-xl ">
              <button
                className="cursor-pointer playing hover:[&>.icon]:!text-content-900"
                onClick={(e) => playTrack(e, track)}
              >
                {currentTrack?.id === track.id ? (
                  <>
                    {isPlaying ? (
                      <Pause className="hidden icon pt-1 text-accent-900" />
                    ) : (
                      <Play className="hidden icon pt-1 text-accent-900" />
                    )}
                    <span className="pi pi-volume-up !text-accent-900 leading-0 pt-1 flex" />
                  </>
                ) : (
                  <>
                    <Play className="hidden icon pt-1" />
                    <span className="flex">1</span>
                  </>
                )}
              </button>
            </td>
            <td
              className={`text-sm font-semibold ${
                currentTrack?.id === track.id ? "text-accent-900" : ""
              }`}
            >
              {track.name}
            </td>
            <td className="text-sm font-semibold">
              {track.artists &&
                track.artists.map((artist) => (
                  <Link href={`/artists/${artist.id}`} key={artist.id}>
                    {artist.name}
                  </Link>
                ))}
            </td>
            <td className="text-sm font-medium">{formatTime(track.duration)}</td>
            <td className="options">
              <button className="hidden cursor-pointer text-background-300 hover:text-background-50 transition-colors options">
                <i className="pi pi-ellipsis-h"></i>
              </button>
            </td>
            <td className="rounded-r-xl ">
              <div className="flex items-end gap-4 w-full h-full">
                <button className="cursor-pointer text-background-300 hover:text-background-50 transition-colors">
                  <i className="pi pi-heart"></i>
                </button>
                <button className="cursor-pointer text-background-300 hover:text-background-50 transition-colors">
                  <i className="pi pi-plus"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
