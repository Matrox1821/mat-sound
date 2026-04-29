"use client";
import { PlayButton } from "@/components/ui/buttons/PlayButton";
import { PlaylistImage } from "@/components/ui/images/PlaylistImage";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { MediaCard } from "@/types/content.types";
import { SafeImage } from "@components/ui/images/SafeImage";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use } from "react";

export function Results({ resultsPromise }: { resultsPromise: Promise<MediaCard[] | null> }) {
  const results = use(resultsPromise);
  return (
    <ul className="flex flex-col gap-1">
      {results &&
        results.map((result, i) => {
          const tracks =
            result.type === "tracks"
              ? [parseTrackByPlayer(result)]
              : result.tracks?.map((track) => parseTrackByPlayer(track)) || null;
          return (
            <li
              key={`${result.id} ${i}`}
              className="p-2 hover:bg-background-800/40 rounded-md cursor flex flex-col relative group"
              onClick={() => redirect(`${result.type}/${result.id}`)}
            >
              <div className="flex gap-2">
                <figure className="relative flex items-center justify-center">
                  {result.type === "playlists" ? (
                    <PlaylistImage
                      image={result.image && result.image.sm}
                      trackImages={result.images}
                      className={`!h-16 !w-16 !rounded-sm group-hover:brightness-40`}
                    />
                  ) : (
                    <SafeImage
                      src={result.image && result.image.sm}
                      alt={result.title}
                      width={64}
                      height={64}
                      className={`!h-16 !w-16 group-hover:brightness-40 ${result.type === "artists" ? "!rounded-full" : "!rounded-sm"}`}
                    />
                  )}
                  <PlayButton
                    tracks={tracks}
                    playingFrom={{ from: result.title, href: `${result.type}/${result.id}` }}
                    className="opacity-0 group-hover:opacity-100 w-full h-full flex items-center justify-center"
                    iconStyles="h-7! w-7!"
                  />
                </figure>

                <div className="flex flex-col justify-between">
                  <span>{result.title}</span>
                  <span className="flex">
                    {result.type === "albums" ||
                      (result.type === "tracks" &&
                        result.artists.map((artist) => (
                          <Link
                            href={`artists/${artist.id}`}
                            className="hover:underline z-30 opacity-60"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              redirect(`artists/${artist.id}`);
                            }}
                            key={artist.id}
                          >
                            {artist.name}
                          </Link>
                        )))}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );
}
