import { Suspense } from "react";
import MainCover from "./components/MainCover";
import CoverInfo from "./components/CoverInfo";
import Table from "./components/Table";
import {
  fetchTrackDataById,
  fetchTracksRecomendedDataById,
} from "@/shared/client/adapters/fetchTrackData";
import { CoverInfoSkeleton, MainCoverSkeleton, TableSkeleton } from "./components/Skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function TrackPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const trackPromise = fetchTrackDataById(trackId, session?.user.id || "");
  const tracksPromise = fetchTracksRecomendedDataById(trackId, 5, session?.user.id || "");

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
        <Table trackPromise={trackPromise} tracksPromise={tracksPromise} />
      </Suspense>
    </section>
  );
}
