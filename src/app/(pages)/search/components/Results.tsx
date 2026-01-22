"use client";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { ImageSizes } from "@/types/common.types";
import { APITrack } from "@/types/trackProps";
import Link from "next/link";
import { use } from "react";

export default function Results({
  resultsPromise,
}: {
  resultsPromise: Promise<
    | {
        id: string;
        name: string;
        image: ImageSizes;
        type?: "track" | "album" | "artist";
        artists?: {
          id: string;
          name: string;
        }[];
        tracks?: APITrack[];
      }[]
    | null
  >;
}) {
  const results = use(resultsPromise);
  return (
    <ul className="flex flex-col gap-1">
      {results &&
        results.map((result, i) => (
          <li
            key={`${result.id} ${i}`}
            className="p-2 hover:bg-background-800/40 rounded-md cursor flex flex-col relative"
          >
            <div className="flex gap-2">
              <SafeImage
                src={result.image && result.image.sm}
                alt={result.name}
                width={64}
                height={64}
                className={`!h-16 !w-16 ${result.type === "artist" ? "!rounded-full" : "!rounded-sm"}`}
              />
              <div>
                <span>{result.name}</span>
                <Link href={`${result.type}s/${result.id}`} className="absolute inset-0 z-0" />
                <span className="flex">
                  {result.artists?.map((artist) => (
                    <Link
                      href={`artists/${artist.id}`}
                      className="hover:underline z-10"
                      key={artist.id}
                    >
                      {artist.name}
                    </Link>
                  ))}
                </span>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}
