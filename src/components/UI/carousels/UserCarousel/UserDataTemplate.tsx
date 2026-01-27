import Link from "next/link";
import { SafeImage } from "../../images/SafeImage";
import { MediaCard } from "@shared-types/user.types";
import { PlaylistImage } from "../../images/PlaylistImage";

export const UserDataTemplate = (data: MediaCard) => {
  return (
    <li className="!w-full h-full color-content-950 duration-150 gap-2">
      <Link
        className={`w-full h-full flex flex-col color-content-950 duration-150 gap-2 track rounded-lg relative active:not-[:has(&_.play-button:active,&_.like-button:active)]:scale-[.98] active:not-[:has(&_.play-button:active,&_.like-button:active)]:opacity-80 z-10`}
        href={data.href}
      >
        {data.type !== "playlist" ? (
          <figure className="w-full aspect-square relative">
            <SafeImage
              src={data.image && data.image.md}
              alt={data.title}
              width={160}
              height={160}
              className={`!object-fill !aspect-square !w-full !h-full !rounded-md`}
              loading="lazy"
              quality={50}
            />
            {/* <CarouselCardPlayButton playlist={playlist} /> */}
          </figure>
        ) : (
          <PlaylistImage
            trackImages={(data.images && data.images?.length > 0 && data.images) || null}
            size={140}
            /*  className={`!w-full !h-full`} */
          />
        )}

        <span>
          <h2
            className={` leading-5 text-base font-normal overflow-x-hidden overflow-ellipsis whitespace-nowrap`}
          >
            {data.title}
          </h2>
          <span className="m-0 leading-5 font-normal text-sm text-content-600/70">
            <span>{data.type === "track" && data.artists && data.artists[0]?.name}</span>
          </span>
        </span>
      </Link>
    </li>
  );
};
