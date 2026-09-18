import { CoverInfoSkeleton, MainCoverSkeleton, TableSkeleton } from "./components/Skeleton";

export default function Loading() {
  return (
    <section className="w-full z-20 h-full flex flex-col md:bg-background overflow-y-auto relative">
      <article className="w-full h-[calc(5/12*100vh)] flex flex-col justify-center px-26 relative">
        <MainCoverSkeleton />
        <CoverInfoSkeleton />
      </article>
      <TableSkeleton />
    </section>
  );
}
