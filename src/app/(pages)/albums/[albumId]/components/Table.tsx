"use client";
import { Pause } from "@/components/UI/Icons/Playback/Pause";
import { Play } from "@/components/UI/Icons/Playback/Play";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { formatTime } from "@/shared/utils/helpers";
import { useUIStore } from "@/store/activeStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { albumPageProps } from "@/types";
import { playerTrackProps } from "@/types/trackProps";
import Link from "next/link";
import { use } from "react";

export default function Table({ albumPromise }: { albumPromise: Promise<albumPageProps | null> }) {
  const album = use(albumPromise);
  const { setTrack, currentTrack, setPlayingFrom } = usePlayerStore((state) => state);
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useUIStore((state) => state);

  if (!album || !album.tracks) return;

  const disks = [...new Set(album.tracks.map((track) => track.disk))].sort((a, b) => a - b);
  const tracksByDisk = disks.map((disk) => {
    const tracksInDisk = album
      .tracks!.filter((track) => track.disk === disk)
      .sort((a, b) => a.order - b.order);
    return { name: `Volumen ${disk}`, tracks: tracksInDisk };
  });

  const tracks = album.tracks.map((newTrack) => parseTrackByPlayer(newTrack));

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
      setPlayingFrom(album.name);
      play();
    }
  };

  return (
    <article className="w-full h-full relative p-8 flex flex-col gap-8 px-26 bg-background">
      {tracksByDisk.map((disk) => {
        if (tracksByDisk.length > 1)
          return (
            <div key={album.id + " " + disk.name}>
              <h2>{disk.name}</h2>
              <DiskTable
                disk={disk}
                currentTrack={currentTrack}
                onClick={playTrack}
                isPlaying={isPlaying}
              />
            </div>
          );

        return (
          <DiskTable
            disk={disk}
            key={album.id + " " + disk.name}
            currentTrack={currentTrack}
            onClick={playTrack}
            isPlaying={isPlaying}
          />
        );
      })}
    </article>
  );
}

function DiskTable({
  disk,
  currentTrack,
  onClick,
  isPlaying,
}: {
  disk: { name: string; tracks: any[] };
  currentTrack: playerTrackProps | null;
  isPlaying: boolean;
  onClick: (e: any, track: playerTrackProps) => void;
}) {
  const tableHead = {
    rowStyle: "uppercase h-12 w-full text-start text-xs font-semibold text-background-400",
    cols: [
      { label: "#", style: "h-full w-12 text-center font-semibold" },
      { label: "Título", style: "h-full w-[40rem] text-start font-semibold" },
      { label: "Artista", style: "h-full w-auto text-start font-semibold" },
      { label: "Dur.", style: "h-full w-25 text-start font-semibold" },
      { label: "", style: "h-full w-10 text-start font-semibold" },
      { label: "", style: "h-full w-15 text-start font-semibold" },
    ],
  };
  return (
    <table className="w-full">
      <thead>
        <tr className={tableHead.rowStyle}>
          {tableHead.cols.map((col, i) => (
            <th className={col.style} key={"th-" + i}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {disk.tracks?.map((track) => (
          <tr
            className={`h-12 ${
              currentTrack?.id === track.id
                ? "[&>td]:bg-background-950/90"
                : "hover:[&>td]:bg-background-950/90"
            } hover:[&>td>.options]:flex hover:[&>td>.playing>.icon]:!flex hover:[&>td>.playing>span]:!hidden`}
            key={track.id}
          >
            <td className="text-center text-sm text-background-400 font-semibold rounded-l-xl ">
              <button
                className="cursor-pointer playing hover:[&>.icon]:!text-content-900"
                onClick={(e) => onClick(e, track)}
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
                    <span className="flex">{track.order}</span>
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
                track.artists.map((artist: any) => (
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
        ))}
      </tbody>
    </table>
  );
}
