import { formatTime } from "@/shared/utils/helpers";
import { albumPageProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { PlayButton, RandButton } from "./Buttons";

export default function CoverInfo({
  albumPromise,
}: {
  albumPromise: Promise<albumPageProps | null>;
}) {
  const album = use(albumPromise);
  if (!album) return;

  return (
    <section className="flex flex-col justify-end items-start gap-12 z-30 relative h-[calc(1/2*100vh)] pb-4">
      <div className="w-full flex items-center gap-4">
        {album.cover && (
          <Image
            src={album.cover.sm}
            alt={album.name}
            width={1080}
            height={1080}
            className="object-cover w-60 h-60 rounded-md"
          />
        )}
        <div className="flex flex-col items-start justify-center gap-3">
          <h2 className="text-3xl font-bold">{album.name}</h2>
          {album.artists &&
            album.artists.map((artist) => (
              <span className="flex gap-2" key={artist.id}>
                <Image
                  src={artist.avatar.sm}
                  alt={artist.name}
                  width={40}
                  height={40}
                  className="object-cover w-6 h-6 rounded-full"
                />
                <Link className="hover:underline" href={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              </span>
            ))}
          <span className="flex gap-1">
            <span>Álbum • </span>
            <span>{new Date(album.releaseDate).getFullYear()}</span>
          </span>
          <span>
            {album.tracksCount} canciones • ({formatTime(album.duration)})
          </span>
        </div>
      </div>
      <div className="flex gap-4">
        <PlayButton currently={album?.tracks![0] || null} tracksList={album.tracks || null} />
        <RandButton tracksList={album.tracks || null} />
      </div>
    </section>
  );
}
