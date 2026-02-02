import { Skeleton } from "primereact/skeleton";

export function GridSkeleton() {
  const arr = new Array(8).fill(null);
  return (
    <ul className="w-full grid grid-cols-4 auto-cols-max gap-4 justify-items-start">
      {arr.map((_, i) => (
        <Skeleton className="!w-full !h-68 !relative" key={i}></Skeleton>
      ))}
    </ul>
  );
}
