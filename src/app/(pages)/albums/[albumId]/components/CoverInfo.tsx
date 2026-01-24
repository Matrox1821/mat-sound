"use client";
import { formatTime } from "@/shared/utils/helpers";
import Link from "next/link";
import { use } from "react";
import { PlayButton, RandButton } from "./Buttons";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { AlbumById } from "@/types/album.types";
import { TrackById } from "@/types/track.types";

export default function CoverInfo({
  albumPromise,
}: {
  albumPromise: Promise<{
    album: AlbumById;
    recommendedTracks: TrackById[];
  } | null>;
}) {
  const albumResponse = use(albumPromise);
  if (!albumResponse) return null;
  const { album, recommendedTracks } = albumResponse;
  return (
    <section className="flex flex-col justify-end items-start gap-12 z-30 relative h-[calc(1/2*100vh)] pb-4">
      <div className="w-full flex gap-4 relative">
        <SafeImage
          src={album.cover && album.cover.sm}
          alt={album.name}
          width={1080}
          height={1080}
          loading="lazy"
          className="!object-cover !w-60 !h-60 !rounded-md"
        />
        <div className="flex flex-col items-start justify-center gap-3">
          <h2 className="text-3xl font-bold">{album.name}</h2>
          {album.artists &&
            album.artists.map((artist) => (
              <span className="flex items-center gap-2" key={artist.id}>
                <SafeImage
                  src={artist.avatar && artist.avatar.sm}
                  alt={artist.name}
                  width={40}
                  height={40}
                  className="!object-cover !w-6 !h-6 !rounded-full"
                />
                <Link className="hover:underline" href={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              </span>
            ))}
          {album.releaseDate && (
            <span className="flex gap-1">
              <span>Álbum • </span>
              <span>
                {new Date(album.releaseDate).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </span>
          )}
          {album.trackCount > 0 && (
            <span>
              {album.trackCount} canciones • ({formatTime(album.duration)})
            </span>
          )}
          {album.tracks.length === 0 && <span className="text-amber-600">Album no disponible</span>}
        </div>
      </div>
      {album.tracks.length !== 0 ? (
        <div className="flex gap-4">
          <PlayButton
            currently={album?.tracks![0].track || null}
            tracksList={album.tracks.map(({ track }) => track) || null}
            upcoming={recommendedTracks}
          />
          <RandButton
            tracksList={album.tracks.map(({ track }) => track) || null}
            upcoming={recommendedTracks}
          />
        </div>
      ) : (
        <span className="h-10 w-10"></span>
      )}
    </section>
  );
}
