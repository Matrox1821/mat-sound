"use client";
import { SafeImage } from "@components/ui/images/SafeImage";
import { TrackWithRecommendations } from "@shared-types/track.types";
import { use } from "react";

export function MainCover({
  trackPromise,
}: {
  trackPromise: Promise<TrackWithRecommendations[] | null>;
}) {
  const pageTrack = use(trackPromise);
  if (!pageTrack || !pageTrack[0]) return;
  const track = pageTrack[0];
  return (
    <figure className="w-full h-[calc(5/12*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center after:content-[''] after:w-full after:h-[calc(5/12*100vh)] after:absolute after:left-0 after:top-0 after:bg-linear-to-t after:from-background/90 after:to-background-950/30">
      <span className="h-full w-full overflow-hidden">
        <SafeImage
          src={track.cover && track.cover.lg}
          alt={track.name}
          width={1200}
          height={1200}
          className="!object-cover !w-full !h-full !blur-2xl"
        />
      </span>
      <span className="h-full w-full">
        <SafeImage
          src={track.cover && track.cover.lg}
          alt={track.name}
          width={1200}
          height={1200}
          className="!object-cover !w-full !h-full"
        />
      </span>
      <span className="h-full w-full overflow-hidden">
        <SafeImage
          src={track.cover && track.cover.lg}
          alt={track.name}
          width={1200}
          height={1200}
          className="!object-cover !w-full !h-full !blur-2xl "
        />
      </span>
    </figure>
  );
}
