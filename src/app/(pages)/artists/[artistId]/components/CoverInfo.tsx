"use client";
import { Verified } from "@/components/ui/icons/Verified";
import { artistPageProps } from "@/types/common.types";
import Image from "next/image";
import { use } from "react";

export default function CoverInfo({
  artistPromise,
}: {
  artistPromise: Promise<artistPageProps | null>;
}) {
  const artist = use(artistPromise);
  return (
    <section className="h-[calc(5/12*100vh)] absolute w-full flex items-end  z-40">
      <div className="w-full flex flex-col items-start p-8 gap-4">
        {artist?.isVerified && (
          <span className="flex justify-center items-center font-bold">
            <Verified className="w-8 h-8 text-accent-700 " />
            Artista verificado
          </span>
        )}
        <div className="flex items-center gap-4">
          <Image
            src={artist?.avatar.md || ""}
            alt={artist?.name || ""}
            width={100}
            height={100}
            className="h-16 w-16 rounded-full content-cover"
            priority
          />
          <h1 className="text-5xl font-black">{artist?.name}</h1>
        </div>
        <span className="text-xl font-normal">
          {artist?.listeners.toLocaleString("en-US")} oyentes mensuales
        </span>
      </div>
    </section>
  );
}
