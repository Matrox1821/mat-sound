import { Skeleton } from "primereact/skeleton";

export function AsideSkeleton() {
  return (
    <aside className="w-3/7 h-full bg-background flex justify-center">
      <div className="w-9/12 pt-32 flex flex-col items-center gap-8 relative">
        <Skeleton className="w-8/12! h-auto! aspect-square!" />
        <div className="flex flex-col items-center gap-4 w-full">
          <Skeleton className="h-8! w-3/4!" />
          <div className="flex gap-2 w-full items-center justify-center">
            <Skeleton className="h-6! w-6! rounded-full!" />
            <Skeleton className="h-4! w-1/2!" />
          </div>
          <div className="flex flex-col gap-2 w-full items-center justify-center">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}

export function BackgroundSkeleton() {
  return (
    <aside className="w-3/7 h-full bg-background  flex justify-center">
      <div className="w-9/12 pt-32 flex flex-col items-center gap-8">
        <Skeleton className="w-8/12! h-auto! aspect-square!" />
        <div className="flex flex-col items-center gap-4 w-full">
          <Skeleton className="h-8! w-3/4!" />
          <div className="flex gap-2 w-full items-center justify-center">
            <Skeleton className="h-6! w-6! rounded-full!" />
            <Skeleton className="h-4! w-1/2!" />
          </div>
          <div className="flex flex-col gap-2 w-full items-center justify-center">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
