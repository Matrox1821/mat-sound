import { CoverInfoSkeleton, MainCoverSkeleton, TableSkeleton } from "./components/Skeleton";

export default function Loading() {
  return (
    <section className="w-full z-20 h-full md:relative md:bg-background md:transition-[heigth] md:duration-200 overflow-y-auto focus-visible:outline-0">
      <article className="w-full h-[calc(1/2*100vh)] flex flex-col justify-center px-26 relative">
        <MainCoverSkeleton />
        <CoverInfoSkeleton />
      </article>
      <TableSkeleton />
    </section>
  );
}
