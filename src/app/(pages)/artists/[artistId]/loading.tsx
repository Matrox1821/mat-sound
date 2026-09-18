import { ContentSkeleton, CoverInfoSkeleton, MainCoverSkeleton } from "./components/Skeleton";

export default function Loading() {
  return (
    <section className="w-full z-20 h-full flex flex-col relative md:bg-background overflow-y-auto">
      <MainCoverSkeleton />
      <CoverInfoSkeleton />
      <ContentSkeleton />
    </section>
  );
}
