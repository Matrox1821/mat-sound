"use client";
import { Verified } from "@components/ui/icons/Verified";
import { SafeImage } from "@components/ui/images/SafeImage";
import { ArtistServer } from "@shared-types/artist.types";
import { use } from "react";

export function CoverInfo({ artistPromise }: { artistPromise: Promise<ArtistServer | null> }) {
  const artist = use(artistPromise);
  if (!artist) return null;
  return (
    <section className="h-[calc(1/2*100vh)] absolute w-full flex items-end  z-40">
      <div className="w-full flex flex-col items-start p-8 gap-4">
        {artist?.isVerified && (
          <span className="flex justify-center items-center font-bold">
            <Verified className="w-8 h-8 text-accent-700 " />
            Artista verificado
          </span>
        )}
        <div className="flex items-center gap-4">
          <SafeImage
            src={artist.avatar && artist.avatar.md}
            alt={artist.name}
            width={100}
            height={100}
            className="!h-16 !w-16 !rounded-full !content-cover"
            priority
          />
          <h1 className="text-5xl font-black">{artist.name}</h1>
        </div>
        <span className="text-xl font-normal">
          {artist.listeners.toLocaleString("en-US")} oyentes mensuales
        </span>
      </div>
    </section>
  );
}
