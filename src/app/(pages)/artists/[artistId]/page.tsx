import {
  fetchArtistDataById,
  fetchTracksDataByArtistId,
} from "@/shared/client/adapters/fetchArtistData";
import { Suspense } from "react";
import { ContentSkeleton, CoverInfoSkeleton, MainCoverSkeleton } from "./components/Skeleton";
import MainCover from "./components/MainCover";
import CoverInfo from "./components/CoverInfo";
import Content from "./components/Content";

export default async function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = await params;
  const artistPromise = fetchArtistDataById(artistId);
  const popularTracksPromise = fetchTracksDataByArtistId({
    id: artistId,
    query: { sortBy: "reproductions", order: "desc", limit: 10 },
  });
  const newTrackPromise = fetchTracksDataByArtistId({
    id: artistId,
    query: { sortBy: "release_date", order: "desc", limit: 1 },
  });

  return (
    <section className="w-full z-20 h-full flex flex-col relative md:bg-background-950 md:transition-[heigth] md:duration-200 focus-visible:outline-0">
      <Suspense fallback={<MainCoverSkeleton />}>
        <MainCover artistPromise={artistPromise} />
      </Suspense>
      <Suspense fallback={<CoverInfoSkeleton />}>
        <CoverInfo artistPromise={artistPromise} />
      </Suspense>
      <Suspense fallback={<ContentSkeleton />}>
        <Content
          artistPromise={artistPromise}
          popularTracksPromise={popularTracksPromise}
          newTrackPromise={newTrackPromise}
        />
      </Suspense>
    </section>
  );
}
