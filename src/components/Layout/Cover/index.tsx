import { Verified } from "@/components/UI/Icons/Verified";
import { artistPageProps } from "@/types";
import Image from "next/image";

export default function Cover({ artist }: { artist: artistPageProps }) {
  return (
    <div className="h-[calc(1/2*100vh)] w-full flex items-end relative z-40">
      <div className="w-full flex flex-col items-start p-8 gap-4">
        {artist.isVerified && (
          <span className="flex justify-center items-center font-bold">
            <Verified className="w-8 h-8 text-accent-700 " />
            Artista verificado
          </span>
        )}
        <div className="flex items-center gap-4">
          <Image
            src={artist.image}
            alt={artist.name}
            width={100}
            height={100}
            className="h-16 w-16 rounded-full content-cover"
          />
          <h1 className="text-5xl font-black">{artist.name}</h1>
        </div>
        <span className="text-xl font-normal">
          {artist.listeners.toLocaleString("en-US")} oyentes mensuales
        </span>
      </div>
    </div>
  );
}
