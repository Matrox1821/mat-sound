import { Suspense } from "react";
import { CoverInfoSkeleton, MainCoverSkeleton, TableSkeleton } from "@components/Skeleton";
import MainCover from "@components/MainCover";
import Table from "@components/Table";
import CoverInfo from "@components/CoverInfo";
import { albumApi } from "@/queryFn/client/albumApi";

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const albumPromise = albumApi.getAlbumById(albumId);

  return (
    <section className="w-full z-20 h-full md:relative md:bg-background md:transition-[heigth] md:duration-200 overflow-y-auto focus-visible:outline-0">
      <article className="w-full h-[calc(1/2*100vh)] flex flex-col justify-center px-26 relative">
        <Suspense fallback={<MainCoverSkeleton />}>
          <MainCover albumPromise={albumPromise} />
        </Suspense>
        <Suspense fallback={<CoverInfoSkeleton />}>
          <CoverInfo albumPromise={albumPromise} />
        </Suspense>
      </article>
      <Suspense fallback={<TableSkeleton />}>
        <Table albumPromise={albumPromise} />
      </Suspense>
    </section>
  );
}
