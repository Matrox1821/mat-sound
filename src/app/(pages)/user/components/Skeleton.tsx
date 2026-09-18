import { Skeleton } from "primereact/skeleton";

export function CarouselSkeleton({
  numVisible = 8,
  withTitle = true,
}: {
  numVisible?: number;
  withTitle?: boolean;
}) {
  return (
    <div className="w-screen overflow-x-visible flex flex-col gap-8">
      {withTitle && <Skeleton className="w-30! h-8!" />}
      <div className="flex gap-6 flex-nowrap w-max h-full">
        {Array.from({ length: numVisible }).map((_, i) => (
          <div className="!w-37.5 flex flex-col gap-2 track rounded-lg relative z-10" key={i}>
            <Skeleton className="w-full aspect-square!" size="auto" />
            <Skeleton className="h-5! w-10/12!" />
            <Skeleton className="h-4! w-7/12!" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileHeroSkeleton() {
  return (
    <>
      <div className="w-full h-[calc(5/12*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center object-cover">
        <Skeleton width="100%" className="!rounded-none !h-full" />
      </div>
      <div className="w-1/2 flex items-center z-30 relative h-[calc(5/12*100vh)]">
        <div className="flex items-center gap-4 left-0">
          <Skeleton className="!w-60 !h-60 !rounded-lg !relative" />
          <span className="flex flex-col gap-3">
            <span className="flex flex-col gap-2">
              <Skeleton className="!h-5 !w-36" />
              <Skeleton className="!h-10 !w-60" />
            </span>
            <span className="flex flex-col gap-2">
              <Skeleton className="!h-5 !w-28" />
              <Skeleton className="!h-5 !w-28" />
            </span>
          </span>
        </div>
      </div>
      <div className="absolute w-10/12 h-full flex flex-col items-center justify-between py-6 z-40 left-1/2 -translate-x-1/2">
        <div className="h-10 w-3" />
        <div className="h-30 w-full mx-12 bg-background/40 backdrop-blur-xl p-3 rounded-xl border border-background-500/40 z-20">
          <Skeleton className="!h-4 !w-full !mb-2" />
          <Skeleton className="!h-4 !w-11/12 !mb-2" />
          <Skeleton className="!h-4 !w-9/12" />
        </div>
        <Skeleton className="!h-15 !w-40 !rounded-full" />
      </div>
    </>
  );
}

export function ProfileContentSkeleton() {
  return (
    <div className="flex flex-col gap-12">
      <CarouselSkeleton numVisible={8} />
      <CarouselSkeleton numVisible={8} />
      <CarouselSkeleton numVisible={8} />
    </div>
  );
}
