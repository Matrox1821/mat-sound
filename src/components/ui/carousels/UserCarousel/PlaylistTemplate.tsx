import { TrackById } from "@shared-types/track.types";
import Link from "next/link";
import { SafeImage } from "../../images/SafeImage";
import { CarouselCardPlayButton } from "../../buttons/CarouselCardPlayButton";

export const PlaylistTemplate = (track: TrackById) => {
  return (
    <li className="!w-40 color-content-950 duration-150 gap-2">
      <Link
        className={`w-full h-full flex flex-col color-content-950 duration-150 gap-2 track rounded-lg relative active:not-[:has(&_.play-button:active,&_.like-button:active)]:scale-[.98] active:not-[:has(&_.play-button:active,&_.like-button:active)]:opacity-80 z-10`}
        href={`/tracks/${track.id}`}
      >
        <figure className="w-full aspect-square relative">
          <SafeImage
            src={track.cover && track.cover?.md}
            alt={track.name}
            width={160}
            height={160}
            className={`!object-fill !aspect-square !w-full !h-full !rounded-md`}
            loading="lazy"
            quality={50}
          />
          <CarouselCardPlayButton track={track} />
        </figure>
        <span>
          <h2
            style={{ overflowWrap: "anywhere" }}
            className={`m-0 leading-5 text-base font-normal`}
          >
            {track.name}
          </h2>
          {/* <span className="m-0 leading-5 font-normal text-sm text-content-600/70">
            <span>{track.artists[0]?.name}</span>
          </span> */}
        </span>
      </Link>
    </li>
  );
};
