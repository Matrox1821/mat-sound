import { AsideSkeleton, BackgroundSkeleton } from "../components/Skeleton";

export default function Loading() {
  return (
    <section className="w-full z-20 h-full flex relative md:bg-background">
      <BackgroundSkeleton />
      <AsideSkeleton />
      <article className="w-full h-full bg-background p-8">
        <div className="h-full w-full animate-pulse bg-background-900/40 rounded-lg" />
      </article>
    </section>
  );
}
