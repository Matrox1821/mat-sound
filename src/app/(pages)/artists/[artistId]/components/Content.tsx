"use client";
import { artistPageProps, artistTracksProps } from "@/types/common.types";
import { Suspense, use } from "react";
import Carousel from "@/components/ui/carousels";
import dynamic from "next/dynamic";
import Sample from "./Sample";
import NewArtistTrack from "./NewTrack";
import About from "./About";
import { PlayButton } from "./Buttons";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";

const PopularTracks = dynamic(() => import("./PopularTracks"));

export default function ArtistContent({
  artistPromise,
  popularTracksPromise,
  newTrackPromise,
}: {
  artistPromise: Promise<artistPageProps | null>;
  popularTracksPromise: Promise<artistTracksProps[] | null>;
  newTrackPromise: Promise<artistTracksProps[] | null>;
}) {
  const artist = use(artistPromise);
  const popularTracks = use(popularTracksPromise);
  const newTrack = use(newTrackPromise);

  const tracks = popularTracks?.map((track) => ({
    ...track,
    artists: [{ name: artist?.name, id: artist?.id, avatar: artist?.avatar }],
  }));
  const parsedTracks = tracks?.map((newTrack) => parseTrackByPlayer(newTrack));
  return (
    <article className="z-30 top-[calc(5/12*100vh)] left-0 w-full flex flex-col focus:none p-8 gap-8 relative bg-background">
      <section className="flex gap-4 items-center">
        <PlayButton tracksList={popularTracks} artistName={artist?.name || ""} />
        <Sample newTrack={newTrack} />
        <button className="rounded-full h-8 px-6 cursor-pointer border-[1px] text-sm font-semibold border-background-200 text-background-50 hover:scale-105 hover:text-content-950 hover:border-content-950 ">
          Seguir
        </button>
      </section>
      <section className="flex gap-8 max-xl:flex-col lg:flex lg:gap-10 max-lg:w-11/12 max-xl:w-11/12 xl:w-10/12">
        <Suspense fallback={<div>Cargando...</div>}>
          <PopularTracks tracks={parsedTracks || null} artist={artist} />
        </Suspense>
        <NewArtistTrack
          newTrack={newTrack}
          artistImage={artist?.avatar.sm}
          artistName={artist?.name}
        />
      </section>
      <section className="flex gap-8 w-full">
        {artist && (
          <Carousel
            title="Álbumes"
            options={{ type: ["albums"] }}
            filter={{ type: "artists", id: artist?.id }}
          />
        )}
      </section>
      <section>
        <About artist={artist} />
      </section>
      <hr className="text-background-700 pb-20 mt-20" />
    </article>
  );
}
