"use client";
import { SafeImage } from "@components/ui/images/SafeImage";
import { formatTime, parseNumberListeners } from "@/shared/utils/helpers";
import { TrackWithRecommendations } from "@shared-types/track.types";
import Link from "next/link";
import { use } from "react";
import { PlayButton } from "./PlayButton";
import { Send } from "@/components/features/dialogs/Send";
import { LikeButton } from "@/components/ui/buttons/LikeButton";

export function CoverInfo({
  trackPromise,
}: {
  trackPromise: Promise<TrackWithRecommendations[] | null>;
}) {
  const pageTrack = use(trackPromise);
  if (!pageTrack || !pageTrack[0]) return;
  const track = pageTrack[0];
  return (
    <article className="flex flex-col justify-end items-start gap-8 z-30 relative h-[calc(1/2*100vh)] pb-4">
      <section className="w-full flex gap-4 relative">
        <figure className="relative">
          <SafeImage
            src={track.cover && track.cover.md}
            alt={track.name}
            width={1080}
            height={1080}
            className="!object-cover !w-60 !h-60 !rounded-lg"
          />
        </figure>
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold">{track.name}</h2>
          {track.artists &&
            track.artists.map((artist) => (
              <span className="flex gap-2" key={artist.id}>
                <figure className="relative">
                  <SafeImage
                    src={artist.avatar && artist.avatar.lg}
                    alt={track.name}
                    width={40}
                    height={40}
                    className="!object-cover !w-6 !h-6 !rounded-full"
                  />
                </figure>
                <Link className="hover:underline" href={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              </span>
            ))}
          <span className="flex flex-col">
            {track.duration && (
              <span className="flex gap-1">
                <span>1 canción </span>
                <span>
                  {"("}
                  {formatTime(track.duration)}
                  {")"}
                </span>
              </span>
            )}
            {track.releaseDate && <span>{new Date(track.releaseDate).getFullYear()}</span>}
            {track.reproductions && (
              <span>{parseNumberListeners(track.reproductions)} reproducciones</span>
            )}
            {!track.song && <span className="text-amber-600">Canción no disponible</span>}
          </span>
        </div>
      </section>

      {track.song ? (
        <div className="flex gap-4">
          <PlayButton track={track} upcoming={track.recommendedTracks} />
          <LikeButton track={track} className="flex cursor-pointer h-10!" />
          <Send
            link={`tracks/${track.id}`}
            title={`Escucha ${track.name} de ${track.artists[0].name}`}
            className="flex text-content-950 font-semibold cursor-pointer hover:opacity-75 transition-[filter] duration-200 "
            svgClassName="h-10!"
          />
        </div>
      ) : (
        <span className="h-10 w-10"></span>
      )}
    </article>
  );
}
