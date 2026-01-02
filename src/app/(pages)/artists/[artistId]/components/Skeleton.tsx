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
    <div className="h-[calc(5/12*100vh)] w-full flex items-end relative z-40">
      <div className="w-full flex flex-col items-start p-8 gap-4">
        <span className="flex justify-center items-center font-bold gap-2">
          <Skeleton className="!rounded-full !h-8 !w-8" />
          <Skeleton className="!h-6 !w-36" />
        </span>
        <div className="flex items-center gap-4">
          <Skeleton className="!rounded-full !h-16 !w-16" />
          <Skeleton className="!h-12 !w-60" />
        </div>
        <Skeleton className="!h-7 !w-90" />
      </div>
    </div>
  );
}
export function ContentSkeleton() {
  return (
    <div className="absolute top-[calc(5/12*100vh)] z-30 left-0 w-full flex flex-col focus:none p-8 gap-8">
      <div className="flex gap-8 max-xl:flex-col lg:flex lg:gap-10 max-lg:w-11/12 max-xl:w-11/12 xl:w-10/12">
        <div className="flex flex-col gap-8 lg:w-11/12 ">
          <Skeleton className="!h-8 !w-32" />
          <div className="flex flex-col gap-6 pl-6 !w-full">
            <Skeleton className="!h-8 !w-full" />
            <Skeleton className="!h-8 !w-full" />
            <Skeleton className="!h-8 !w-full" />
            <Skeleton className="!h-8 !w-full" />
            <Skeleton className="!h-8 !w-full" />
          </div>
        </div>
        <div className="relative flex flex-col gap-4">
          <Skeleton className="!h-8 !w-64" />
          <Skeleton className="!w-[350px] !h-[250px] !rounded-xl" />
        </div>
      </div>
    </div>
  );
}
