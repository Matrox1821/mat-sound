"use client";
import { Carousel } from "primereact/carousel";
import { use, useEffect, useState } from "react";
import { Template } from "./Template";
import { MediaCard } from "@/types/content.types";
import { Skeleton } from "primereact/skeleton";

function CarouselSkeleton({ numVisible }: { numVisible: number }) {
  const arr = new Array(numVisible).fill(null);
  return (
    <div className="w-screen overflow-x-visible">
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

export function CarouselClient({
  dataPromise,
  title,
}: {
  dataPromise: Promise<MediaCard[] | null>;
  title?: string | null;
}) {
  const data = use(dataPromise);
  const [ready, setReady] = useState(false);

  /* const { isMobile, size } = useDevice();
    const content = use(data);
    if (!content) return;
    const slidesPerViewAmount = slidesPerView(isMobile, size); */

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  const numVisible = 8;
  if (!data) return;
  return (
    <section className={`card w-full !relative flex flex-col gap-8`}>
      {!ready ? (
        <Skeleton className="w-30! h-8!" />
      ) : (
        title && <h2 className="text-2xl font-semibold">{title}</h2>
      )}
      {!ready ? (
        <CarouselSkeleton numVisible={numVisible} />
      ) : (
        <Carousel
          value={data}
          numScroll={1}
          numVisible={numVisible}
          draggable={"true"}
          showIndicators={false}
          itemTemplate={Template}
          containerClassName={`[&>.p-carousel-prev,.p-carousel-next]:!bg-accent-900/20 [&>.p-carousel-prev,.p-carousel-next]:!border [&>.p-carousel-prev,.p-carousel-next]:!border-accent-950/50 [&>.p-carousel-prev,.p-carousel-next]:!flex [&>.p-carousel-prev,.p-carousel-next]:!items-center [&>.p-carousel-prev,.p-carousel-next]:!justify-center [&>.p-carousel-next]:!pl-[1px] [&>.p-carousel-prev]:!pr-[1px] [&>.p-carousel-prev,.p-carousel-next]:!-top-14 ${data.length < numVisible ? "[&>.p-carousel-prev,.p-carousel-next]:!hidden" : ""}`}
        />
      )}
    </section>
  );
}
