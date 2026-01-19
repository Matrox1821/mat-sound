"use client";
import { formatTime, parseNumberListeners } from "@/shared/utils/helpers";
import { trackPageProps } from "@/types/common.types";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

export default function CoverInfo({
  trackPromise,
}: {
  trackPromise: Promise<trackPageProps | null>;
}) {
  const track = use(trackPromise);
  if (!track) return;
  return (
    <article className="flex items-center gap-4 z-30 relative h-[calc(5/12*100vh)]">
      {track.cover && (
        <Image
          src={track.cover.md}
          alt={track.name}
          width={1080}
          height={1080}
          className="object-cover w-60 h-60 rounded-lg"
        />
      )}
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold">{track.name}</h2>
        {track.artists &&
          track.artists.map((artist) => (
            <span className="flex gap-2" key={artist.id}>
              <Image
                src={artist.avatar.lg}
                alt={track.name}
                width={40}
                height={40}
                className="object-cover w-6 h-6 rounded-full"
              />
              <Link className="hover:underline" href={`/artist/${artist.id}`}>
                {artist.name}
              </Link>
            </span>
          ))}
        <span className="flex flex-col">
          <span className="flex gap-1">
            <span>1 canción </span>
            <span>
              {"("}
              {formatTime(track.duration)}
              {")"}
            </span>
          </span>
          <span>{new Date(track.releaseDate).getFullYear()}</span>
          <span>{parseNumberListeners(track.reproductions)} reproducciones</span>
        </span>
      </div>
    </article>
  );
}
