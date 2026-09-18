import { Suspense } from "react";
import { CarouselClient } from "./CarouselClient";
import { getCarouselContent } from "@/actions/content";
import { CarouselComponentProps } from "@/types/content.types";
import { CarouselSkeleton } from "./CarouselSkeleton";
/* function CarouselSkeleton({ numVisible }: { numVisible: number }) {
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
} */

async function CarouselContent({
  remove,
  options,
  searchBy,
  title,
  forCurrentUser,
}: CarouselComponentProps) {
  const content = await getCarouselContent({
    forCurrentUser,
    remove,
    options,
    searchBy,
  });

  return <CarouselClient data={content} title={title} />;
}

export async function Carousel({
  remove,
  options,
  searchBy,
  title,
  forCurrentUser,
}: CarouselComponentProps) {
  return (
    <article className="relative w-full flex flex-col pl-4">
      <Suspense fallback={<CarouselSkeleton numVisible={8} hasTitle={!!title} />}>
        <CarouselContent
          forCurrentUser={forCurrentUser}
          options={options}
          remove={remove}
          searchBy={searchBy}
          title={title}
        />
      </Suspense>
    </article>
  );
}
