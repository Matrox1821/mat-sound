"use client";
import { SafeImage } from "@components/ui/images/SafeImage";
import { ArtistServer } from "@shared-types/artist.types";
import { use } from "react";

export default function MainCover({
  artistPromise,
}: {
  artistPromise: Promise<ArtistServer | null>;
}) {
  const artist = use(artistPromise);
  if (!artist) return;
  return (
    <figure className="w-full h-[calc(1/2*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center object-cover">
      <SafeImage
        src={artist.mainCover}
        alt={artist?.name}
        width={2160}
        height={1080}
        className="!opacity-80 !object-cover !w-full !h-full !text-transparent !bg-background"
      />
    </figure>
  );
}
