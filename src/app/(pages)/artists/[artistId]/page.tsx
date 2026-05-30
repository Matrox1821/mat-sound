import { Suspense } from "react";
import { Carousel } from "@components/ui/carousels/index";
import { ContentSkeleton, CoverInfoSkeleton, MainCoverSkeleton } from "./components/Skeleton";
import { MainCover } from "./components/MainCover";
import { CoverInfo } from "./components/CoverInfo";
import { ArtistContent } from "./components/Content";
import { getArtist, getArtistTracks } from "@/actions/artist";

export default async function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = await params;
  const artistPromise = getArtist(artistId);
  const popularTracksPromise = getArtistTracks({
    id: artistId,
    sort: "reproductions",
    order: "desc",
    limit: 10,
  });
  const newTrackPromise = getArtistTracks({
    id: artistId,
    sort: "releaseDate",
    order: "desc",
    limit: 1,
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
        <ArtistContent
          artistPromise={artistPromise}
          popularTracksPromise={popularTracksPromise}
          newTrackPromise={newTrackPromise}
          albumsCarousel={
            <Carousel
              title="Álbumes"
              options={{ type: ["albums"] }}
              searchBy={{ type: "artist", id: (await artistPromise)?.id || "" }}
            />
          }
        />
      </Suspense>
    </section>
  );
}
