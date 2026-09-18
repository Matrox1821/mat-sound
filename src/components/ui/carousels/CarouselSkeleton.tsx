import { Skeleton } from "primereact/skeleton";

export function CarouselSkeleton({
  numVisible,
  hasTitle,
}: {
  numVisible: number;
  hasTitle: boolean;
}) {
  const arr = new Array(numVisible).fill(null);
  return (
    <section className="card w-full !relative flex flex-col gap-8">
      {hasTitle && <Skeleton className="w-30! h-8!" />}
      <div className="w-screen overflow-x-visible">
        <div className="flex gap-6 flex-nowrap w-max h-full">
          {arr.map((_, i) => (
            <div className="!w-37.5 flex flex-col gap-2 track rounded-lg relative z-10" key={i}>
              <Skeleton className="w-full aspect-square!" size="auto"></Skeleton>
              <Skeleton className="!h-10"></Skeleton>
              <Skeleton className="!h-5" width="50%"></Skeleton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
