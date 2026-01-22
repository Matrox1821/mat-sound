"use client";
import { Pause } from "@components/ui/icons/playback/Pause";
import { Play } from "@components/ui/icons/playback/Play";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { formatTime } from "@/shared/utils/helpers";
import { useUIStore } from "@/store/activeStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { playerTrackProps } from "@/types/trackProps";
import Link from "next/link";
import { useState } from "react";
import { ArtistServer } from "@/types/artist.types";
import { SafeImage } from "@/components/ui/images/SafeImage";

export default function PopularTracks({
  tracks,
  artist,
}: {
  tracks: playerTrackProps[] | null;
  artist: ArtistServer | null;
}) {
  const { setTrack, currentTrack, setPlayingFrom } = usePlayerStore((state) => state);
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useUIStore((state) => state);

  const [tracksList, setTracksList] = useState<playerTrackProps[] | null>(
    tracks?.slice(0, 5) || null,
  );

  if (!tracks || !artist || !tracksList || !tracksList.length) return;

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
      setTrack(track, tracks);
      setPlayingFrom(artist.name);
      play();
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:w-11/12 items-start">
      <h2 className="text-2xl font-bold">Popular</h2>
      <table className="w-full">
        <thead>
          <tr className="uppercase h-0 w-full text-start text-xs font-semibold text-background-400">
            <th className="h-flex w-14 text-center font-semibold"></th>
            <th className="h-full w-14 text-start font-semibold"></th>
            <th className="h-full w-7/12 text-start font-semibold"></th>
            <th className="h-full text-start font-semibold"></th>
            <th className="h-full w-13 text-start font-semibold"></th>
            <th className="h-full w-10 text-start font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {tracksList.map((track, i) => {
            return (
              <tr
                key={track.id}
                className={`h-12 ${
                  currentTrack?.id === track.id
                    ? "[&>td]:!bg-background-800/90"
                    : "hover:[&>td]:!bg-background-800/90"
                } hover:[&>td>.options]:flex hover:[&>td>.playing>.icon]:!flex hover:[&>td>.playing>span]:!hidden text-background-300 `}
              >
                <td className="text-center text-sm text-background-400 font-semibold rounded-l-xl px-2">
                  <button
                    className="cursor-pointer playing hover:[&>.icon]:!text-content-900"
                    onClick={(e) => playTrack(e, parseTrackByPlayer(track))}
                  >
                    {currentTrack?.id === track.id ? (
                      <>
                        {isPlaying ? (
                          <Pause className="hidden icon pt-2 text-accent-900" />
                        ) : (
                          <Play className="hidden icon pt-2 text-accent-900" />
                        )}
                        <span className="pi pi-volume-up !text-accent-900 leading-0 pt-1 flex" />
                      </>
                    ) : (
                      <>
                        <Play className="hidden icon pt-1" />
                        <span className="flex">{i + 1}</span>
                      </>
                    )}
                  </button>
                </td>
                <td>
                  <SafeImage
                    src={track.cover && track.cover.sm}
                    alt={track.name}
                    width={100}
                    height={100}
                    className="!w-10 !h-10 !rounded-md"
                  />
                </td>
                <td className="gap-4 ">
                  <div className="w-20 relative h-full">
                    <Link
                      href={`/tracks/${track.id}`}
                      className={`font-medium text-sm overflow-ellipsis text-nowrap hover:underline ${
                        currentTrack?.id === track.id ? "text-accent-900" : "text-content-950"
                      }`}
                    >
                      {track.name}
                    </Link>
                  </div>
                </td>
                <td className="font-semibold text-base text-background-300 max-sm:hidden">
                  {track.reproductions.toLocaleString("En-US")}
                </td>
                <td className="font-semibold text-sm text-background-300">
                  {formatTime(track.duration)}
                </td>
                <td className="options rounded-r-xl">
                  <button className="hidden cursor-pointer text-background-300 hover:text-background-50 transition-colors options">
                    <i className="pi pi-ellipsis-h"></i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tracksList.length > 5 && (
        <button
          onClick={() => {
            if (tracksList.length === 5) setTracksList(tracks);
            if (tracksList.length === 10) setTracksList(tracksList.slice(0, 5) || null);
          }}
          className="pl-6 cursor-pointer text-sm font-bold text-background-50 hover:text-content-950"
        >
          {tracksList.length === 5 ? "Ver más" : "Ver menos"}
        </button>
      )}
    </div>
  );
}
