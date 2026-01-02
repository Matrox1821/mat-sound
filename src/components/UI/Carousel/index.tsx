import { CarouselProps } from "@/types/components";
import CarouselSwiper from "./CarouselSwiper";
import { Suspense } from "react";
import { CarouselSkeleton } from "@/components/Skeletons";
import { fetchContentData } from "@/shared/client/adapters/fetchContentData";

export default async function Carousel({ remove, options, filter, title }: CarouselProps) {
  const content = fetchContentData({ remove, options, filter });
  return (
    <article className="relative w-full flex flex-col pl-4">
      <h2 className="h-12 font-semibold text-2xl ">{title}</h2>
      <Suspense fallback={<CarouselSkeleton />}>
        <CarouselSwiper data={content} />
      </Suspense>
    </article>
  );
}
