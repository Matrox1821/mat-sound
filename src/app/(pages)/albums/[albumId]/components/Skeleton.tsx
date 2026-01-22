import { Skeleton } from "primereact/skeleton";
export function MainCoverSkeleton() {
  return (
    <div className="top-0 right-0 text-start flex gap-2 opacity-80">
      <div className="w-full h-[calc(1/2*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center object-cover">
        <Skeleton width="100%" className="!rounded-none !h-full"></Skeleton>
      </div>
    </div>
  );
}
export function CoverInfoSkeleton() {
  return (
    <div className="flex flex-col justify-end items-start gap-12 z-30 relative h-[calc(1/2*100vh)] pb-4 w-full">
      <div className="w-full flex gap-4">
        <Skeleton className="!w-60 !h-60 !rounded-lg !relative" />
        <div className="flex flex-col gap-3 justify-center">
          <Skeleton className="!h-8 !w-36 !relative" />
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
      <div className="flex gap-4">
        <Skeleton className="!h-10 !w-[150px]" />
        <Skeleton className="!h-10 !w-[135px]" />
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
