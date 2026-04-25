import { Skeleton } from "primereact/skeleton";

export function CarouselSkeleton({ numVisible = 8 }: { numVisible?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: numVisible }).map((_, i) => (
        <div key={i} className="flex-shrink-0" style={{ width: `calc(100% / ${numVisible})` }}>
          <Skeleton className="w-full aspect-square rounded-md" />
          <Skeleton className="mt-2 h-4 rounded  w-3/4" />
          <Skeleton className="mt-1 h-3 rounded  w-1/2" />
        </div>
      ))}
    </div>
  );
}
