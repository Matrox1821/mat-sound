"use client";
import { use } from "react";
import { MediaCard } from "@shared-types/user.types";
import { Carousel } from "primereact/carousel";
import { PlaylistTemplate } from "./PlaylistTemplate";

export function CarouselPlaylists({ dataPromise }: { dataPromise: Promise<MediaCard[] | null> }) {
  const data = use(dataPromise);
  console.log(data);
  if (!data) return;
  return (
    <div className="card w-full !relative flex flex-col gap-8">
      <h2 className="text-2xl font-semibold flex-">Playlists</h2>
      <Carousel
        value={data}
        numScroll={1}
        numVisible={data.length >= 8 ? 8 : 2}
        draggable={"true"}
        showIndicators={false}
        itemTemplate={PlaylistTemplate}
        containerClassName="[&>.p-carousel-prev,.p-carousel-next]:!bg-accent-900/20 [&>.p-carousel-prev,.p-carousel-next]:!border [&>.p-carousel-prev,.p-carousel-next]:!border-accent-950/50 [&>.p-carousel-prev,.p-carousel-next]:!flex [&>.p-carousel-prev,.p-carousel-next]:!items-center [&>.p-carousel-prev,.p-carousel-next]:!justify-center [&>.p-carousel-next]:!pl-[1px] [&>.p-carousel-prev]:!pr-[1px] [&>.p-carousel-items-content]:!justify-start !flex !gap-4"
      />
    </div>
  );
}
