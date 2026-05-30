import { Suspense } from "react";
import { CoverInfoSkeleton, MainCoverSkeleton, TableSkeleton } from "./components/Skeleton";
import { MainCover } from "./components/MainCover";
import { CoverInfo } from "./components/CoverInfo";
import { SingleTrackTable } from "./components/Table";
import { getTrackById } from "@/shared/server/track/track.repository";

export default async function TrackPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await params;
  const trackPromise = getTrackById({ trackId });

  return (
    <section className="w-full z-20 h-full flex flex-col md:bg-background md:transition-[heigth] md:duration-200 overflow-y-auto overflow-x-hidden focus-visible:outline-0 relative">
      <article className="w-full h-[calc(5/12*100vh)] flex flex-col justify-center px-26 relative">
        <Suspense fallback={<MainCoverSkeleton />}>
          <MainCover trackPromise={trackPromise} />
        </Suspense>
        <Suspense fallback={<CoverInfoSkeleton />}>
          <CoverInfo trackPromise={trackPromise} />
        </Suspense>
      </article>
      <Suspense fallback={<TableSkeleton />}>
        <SingleTrackTable trackPromise={trackPromise} />
      </Suspense>
    </section>
  );
}
