"use client";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { AlbumById } from "@/types/album.types";
import { TrackById } from "@/types/track.types";
import { use } from "react";

export default function MainCover({
  albumPromise,
}: {
  albumPromise: Promise<{
    album: AlbumById;
    recommendedTracks: TrackById[];
  } | null>;
}) {
  const albumResponse = use(albumPromise);
  if (!albumResponse) return null;
  const { album } = albumResponse;
  return (
    <figure className="w-full h-[calc(1/2*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center after:content-[''] after:w-full after:h-[calc(1/2*100vh)] after:absolute after:left-0 after:top-0 after:bg-linear-to-t after:from-background/90 after:to-background-950/30">
      <span className="h-full w-full overflow-hidden">
        <SafeImage
          src={album.cover && album.cover.lg}
          alt={album.name}
          width={1200}
          height={1200}
          loading="eager"
          className="!object-cover !w-full !h-full !blur-2xl !relative"
        />
      </span>
      <span className="h-full w-full ">
        <SafeImage
          src={album.cover && album.cover.lg}
          alt={album.name}
          width={1200}
          height={1200}
          loading="eager"
          className="!object-cover !w-full !h-full !relative"
        />
      </span>
      <span className="h-full w-full overflow-hidden">
        <SafeImage
          src={album.cover && album.cover.lg}
          alt={album.name}
          width={1200}
          height={1200}
          loading="eager"
          className="!object-cover !w-full !h-full !blur-2xl !relative"
        />
      </span>
    </figure>
  );
}
