"use client";
import { Carousel } from "primereact/carousel";
import { use } from "react";
import { MediaCard } from "@shared-types/user.types";
import { UserDataTemplate } from "./UserDataTemplate";

export function UserCarousel({
  dataPromise,
  title,
}: {
  dataPromise: Promise<MediaCard[] | null>;
  title: string;
}) {
  const data = use(dataPromise);
  const numVisible = 8;
  if (!data) return;

  return (
    <div className="card w-full !relative flex flex-col gap-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <Carousel
        value={data}
        numScroll={1}
        numVisible={numVisible}
        draggable={"true"}
        showIndicators={false}
        itemTemplate={UserDataTemplate}
        containerClassName={`[&>.p-carousel-prev,.p-carousel-next]:!bg-accent-900/20 [&>.p-carousel-prev,.p-carousel-next]:!border [&>.p-carousel-prev,.p-carousel-next]:!border-accent-950/50 [&>.p-carousel-prev,.p-carousel-next]:!flex [&>.p-carousel-prev,.p-carousel-next]:!items-center [&>.p-carousel-prev,.p-carousel-next]:!justify-center [&>.p-carousel-next]:!pl-[1px] [&>.p-carousel-prev]:!pr-[1px] [&>.p-carousel-prev,.p-carousel-next]:!-top-14 ${data.length < numVisible ? "[&>.p-carousel-prev,.p-carousel-next]:!hidden" : ""}`}
      />
    </div>
  );
}
