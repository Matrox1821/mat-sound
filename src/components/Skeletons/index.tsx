import { Skeleton } from "primereact/skeleton";
function CardSkeleton() {
  return (
    <div className="!w-40 flex flex-col gap-2 track rounded-lg relative z-10">
      <Skeleton className="w-full aspect-square" size="auto"></Skeleton>
      <Skeleton className=""></Skeleton>
      <Skeleton className="" width="50%"></Skeleton>
    </div>
  );
}
function CarouselSkeleton() {
  const arr = new Array(9).fill(null);
  return (
    <div className="w-screen overflow-x-visible">
      <div className="flex gap-4 flex-nowrap w-max h-full">
        {arr.map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
export { CardSkeleton, CarouselSkeleton };
