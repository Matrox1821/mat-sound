import { Suspense } from "react";
import { CarouselClient } from "./CarouselClient";
import { getCarouselContent } from "@/actions/content";
import { CarouselComponentProps } from "@/types/content.types";
import { Skeleton } from "primereact/skeleton";
function CarouselSkeleton({ numVisible }: { numVisible: number }) {
  const arr = new Array(numVisible).fill(null);
  return (
    <div className="w-screen overflow-x-visible flex flex-col gap-8">
      <Skeleton className="w-30! h-8!" />

      <div className="flex gap-6 flex-nowrap w-max h-full">
        {arr.map((_, i) => (
          <div className="!w-37.5 flex flex-col gap-2 track rounded-lg relative z-10" key={i}>
            <Skeleton className="w-full aspect-square!" size="auto"></Skeleton>
            <Skeleton className=""></Skeleton>
            <Skeleton className="" width="50%"></Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
}
export async function Carousel({
  remove,
  options,
  searchBy,
  title,
  forCurrentUser,
}: CarouselComponentProps) {
  const content = getCarouselContent({
    forCurrentUser,
    remove,
    options,
    searchBy,
  });
  return (
    <article className="relative w-full flex flex-col pl-4">
      <Suspense fallback={<CarouselSkeleton numVisible={8} />}>
        <CarouselClient dataPromise={content} title={title} />
      </Suspense>
    </article>
  );
}
