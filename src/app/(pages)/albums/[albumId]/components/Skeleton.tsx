import { Skeleton } from "primereact/skeleton";
export function MainCoverSkeleton() {
  return (
    <div className="top-0 right-0 text-start flex gap-2 opacity-80">
      <div className="w-full h-[calc(5/12*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center object-cover">
        <Skeleton width="100%" className="!rounded-none !h-full"></Skeleton>
      </div>
    </div>
  );
}
export function CoverInfoSkeleton() {
  return (
    <div className="flex items-center gap-4 z-30 relative h-[calc(5/12*100vh)]">
      <Skeleton className="!w-60 !h-60 !rounded-lg !absolute" />
      <div className="w-full flex flex-col gap-3 pl-64">
        <Skeleton className="!h-8 !w-36" />
        <div className="flex gap-2">
          <Skeleton className="!w-6 !h-6 !rounded-full" />
          <Skeleton className="!h-6 !w-20" />
        </div>
        <span className="flex flex-col gap-1">
          <Skeleton className="!h-5 !w-24" />
          <Skeleton className="!h-5 !w-16" />
          <Skeleton className="!h-5 !w-40" />
        </span>
      </div>
    </div>
  );
}
export function TableSkeleton() {
  return (
    <div className="w-full h-full relative p-8 flex flex-col gap-1 px-26">
      <Skeleton className="!h-15 !w-full" />
      <Skeleton className="!h-15 !w-full" />
      <Skeleton className="!h-15 !w-full" />
      <Skeleton className="!h-15 !w-full" />
      <Skeleton className="!h-15 !w-full" />
      <Skeleton className="!h-15 !w-full" />
      <Skeleton className="!h-15 !w-full" />
      <Skeleton className="!h-15 !w-full" />
    </div>
  );
}
