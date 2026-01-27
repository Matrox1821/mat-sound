"use client";
import dynamic from "next/dynamic";
import { Suspense, use } from "react";
import { Sample } from "./Sample";
import { NewArtistTrack } from "./NewTrack";
import { About } from "./About";
import { PlayButton } from "./Buttons";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { ArtistServer, ArtistTracks } from "@shared-types/artist.types";
import { FollowButton } from "@components/ui/buttons/Follow";

const PopularTracks = dynamic(() => import("./PopularTracks"));

export default function ArtistContent({
  artistPromise,
  popularTracksPromise,
  newTrackPromise,
  albumsCarousel,
}: {
  artistPromise: Promise<ArtistServer | null>;
  popularTracksPromise: Promise<{
    recommended?: ArtistTracks[] | undefined;
    tracks: ArtistTracks[];
  } | null>;
  newTrackPromise: Promise<{
    recommended?: ArtistTracks[] | undefined;
    tracks: ArtistTracks[];
  } | null>;
  albumsCarousel: React.ReactNode;
}) {
  const artist = use(artistPromise);
  const popularTracks = use(popularTracksPromise);
  const newTrackData = use(newTrackPromise);

  const tracks =
    popularTracks &&
    (popularTracks.tracks?.map((track) => ({
      ...track,
      artists: [{ name: artist?.name, id: artist?.id, avatar: artist?.avatar }],
    })) as ArtistTracks[]);

  const newTrack =
    newTrackData &&
    (newTrackData.tracks?.map((track) => ({
      ...track,
      artists: [{ name: artist?.name, id: artist?.id, avatar: artist?.avatar }],
    })) as ArtistTracks[]);

  const upcoming =
    popularTracks &&
    popularTracks.recommended &&
    (popularTracks.recommended.map((track) => ({
      ...track,
      artists: [{ name: artist?.name, id: artist?.id, avatar: artist?.avatar }],
    })) as ArtistTracks[]);

  const parsedTracks = tracks?.map((track) => parseTrackByPlayer(track));
  return (
    <article className="z-30 top-[calc(1/2*100vh)] left-0 w-full flex flex-col focus:none p-8 gap-8 relative bg-background">
      <section className="flex gap-4 items-center">
        <PlayButton tracksList={tracks} upcomingList={upcoming} artistName={artist?.name || ""} />
        <Sample newTrack={newTrack} />
        <FollowButton artistId={artist!.id} />
      </section>
      <section className="flex gap-8 max-xl:flex-col lg:flex lg:gap-10 max-lg:w-11/12 max-xl:w-11/12 xl:w-10/12">
        <Suspense fallback={<div>Cargando...</div>}>
          <PopularTracks tracks={parsedTracks || null} upcomingList={upcoming} artist={artist} />
        </Suspense>
        <NewArtistTrack
          newTrack={newTrack}
          artistImage={artist?.avatar.sm}
          artistName={artist?.name}
        />
      </section>
      <section className="flex gap-8 w-full">{albumsCarousel}</section>
      <section>
        <About artist={artist} />
      </section>
      <hr className="text-background-700 pb-20 mt-20" />
    </article>
  );
}
