"use client";
import { Carousel } from "primereact/carousel";
import { use, useEffect, useState } from "react";
import { Template } from "./Template";
import { MediaCard } from "@/types/content.types";
import { CarouselSkeleton } from "./CarouselSkeleton";

export function CarouselClient({
  data,
  dataPromise,
  title,
}: {
  data?: MediaCard[] | null;
  dataPromise?: Promise<MediaCard[] | null>;
  title?: string | null;
}) {
  const resolvedData = data ?? (dataPromise ? use(dataPromise) : null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  const numVisible = 8;
  if (!resolvedData || resolvedData.length === 0) return null;
  if (!ready) return <CarouselSkeleton numVisible={numVisible} hasTitle={!!title} />;
  return (
    <section className={`card w-full !relative flex flex-col gap-8`}>
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      <Carousel
        value={resolvedData}
        numScroll={1}
        numVisible={numVisible}
        draggable={"true"}
        showIndicators={false}
        itemTemplate={Template}
        containerClassName={`[&>.p-carousel-prev,.p-carousel-next]:!bg-accent-900/20 [&>.p-carousel-prev,.p-carousel-next]:!border [&>.p-carousel-prev,.p-carousel-next]:!border-accent-950/50 [&>.p-carousel-prev,.p-carousel-next]:!flex [&>.p-carousel-prev,.p-carousel-next]:!items-center [&>.p-carousel-prev,.p-carousel-next]:!justify-center [&>.p-carousel-next]:!pl-[1px] [&>.p-carousel-prev]:!pr-[1px] [&>.p-carousel-prev,.p-carousel-next]:!-top-14 ${resolvedData.length < numVisible ? "[&>.p-carousel-prev,.p-carousel-next]:!hidden" : ""}`}
      />
    </section>
  );
}
