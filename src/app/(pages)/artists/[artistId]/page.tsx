import { Suspense } from "react";
import { ContentSkeleton, CoverInfoSkeleton, MainCoverSkeleton } from "./components/Skeleton";
import MainCover from "./components/MainCover";
import CoverInfo from "./components/CoverInfo";
import Content from "./components/Content";
import Carousel from "@/components/ui/carousels";
import { artistApi } from "@/queryFn/client/artistApi";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const artistPromise = artistApi.getArtistById(artistId, session?.user.id);

  const popularTracksPromise = artistApi.getTracksByArtistId({
    id: artistId,
    userId: session?.user.id,
    query: { sortBy: "reproductions", order: "desc", limit: 10 },
  });
  const newTrackPromise = artistApi.getTracksByArtistId({
    id: artistId,
    userId: session?.user.id,
    query: { sortBy: "releaseDate", order: "desc", limit: 1 },
  });
  return (
    <section className="w-full z-20 h-full flex flex-col relative md:bg-background md:transition-[heigth] md:duration-200 focus-visible:outline-0">
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
          albumsCarousel={
            <Carousel
              title="Álbumes"
              options={{ type: ["albums"] }}
              filter={{ type: "artists", id: (await artistPromise)?.id || "" }}
            />
          }
        />
      </Suspense>
    </section>
  );
}
