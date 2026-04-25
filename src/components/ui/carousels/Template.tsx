import Link from "next/link";
import { SafeImage } from "../images/SafeImage";
import { PlaylistImage } from "../images/PlaylistImage";
import { redirect } from "next/navigation";
import { PlayButton } from "./PlayButton";
import { MediaCard } from "@/types/content.types";

export const Template = (data: MediaCard) => {
  /*  const desktopStyle = isMobile
    ? "[&_.play-button]:opacity-100 [&_.play-button]:!-translate-y-1"
    : "hover:[&_.play-button]:opacity-100 hover:[&_.play-button]:!transition-all hover:[&_.play-button]:!duration-300 hover:[&_.play-button]:!-translate-y-1 not-hover:[&_.play-button]:!transition-all not-hover:[&_.play-button]:!duration-300"; */
  return (
    <li className="!w-full h-full color-content-950 duration-150 gap-2">
      <Link
        className={`w-full h-full flex flex-col color-content-950 duration-150 gap-2 track rounded-lg relative 
          hover:[&_.play-button]:opacity-100 hover:[&_.play-button]:!transition-all hover:[&_.play-button]:!duration-300 
          not-hover:[&_.play-button]:!transition-all not-hover:[&_.play-button]:!duration-300
          hover:[&>figure>img]:!transition-all hover:[&>figure>img]:!duration-200 
          not-hover:[&>figure>img]:!transition-all not-hover:[&>figure>img]:!duration-200
          ${data.type === "artists" ? "hover:[&>figure>img]:opacity-25! " : "hover:[&_.play-button]:!-translate-y-1"}
          `}
        href={data.href}
      >
        <figure
          className={`w-full aspect-square relative ${data.type === "artists" ? "flex items-center justify-center" : ""}`}
        >
          {data.type !== "playlists" ? (
            <SafeImage
              src={data.image && data.image.md}
              alt={data.title}
              width={160}
              height={160}
              className={`!object-fill !aspect-square !w-full !h-full relative ${data.type === "artists" ? "!rounded-full" : "!rounded-md"}`}
              loading="lazy"
              quality={50}
            />
          ) : (
            <PlaylistImage
              trackImages={(data.images && data.images?.length > 0 && data.images) || null}
              image={data.image ? data.image.md : null}
              size={160}
              quality={100}
              className={`!w-full !h-full `}
            />
          )}
          <PlayButton data={data} />
        </figure>

        <span className="flex flex-col gap-2">
          <h2
            className={`leading-5 text-base font-normal overflow-x-hidden overflow-ellipsis whitespace-nowrap`}
          >
            {data.title}
          </h2>
          <span className="m-0 leading-5 font-normal text-sm text-content-600/70">
            {data.type === "tracks" ||
              (data.type === "albums" &&
                data.artists &&
                data.artists.map(({ id, name, avatar }, i) => {
                  console.log();
                  if (data.artists.length > i + 1)
                    return (
                      <span key={id} className="flex gap-2">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            redirect(`/artist/${id}`);
                          }}
                          className="hover:underline cursor-pointer flex gap-1"
                        >
                          <figure className="w-5 h-5 relative rounded-full">
                            <SafeImage
                              alt=""
                              src={avatar?.sm}
                              className="rounded-full!"
                              height={24}
                              width={24}
                            />
                          </figure>
                          {name}
                        </span>
                        <span className="pr-1">•</span>
                      </span>
                    );
                  return (
                    <span
                      key={id}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        redirect(`/artist/${id}`);
                      }}
                      className="hover:underline cursor-pointer flex gap-1"
                    >
                      <figure className="w-5 h-5 relative rounded-full">
                        <SafeImage
                          alt=""
                          className="rounded-full!"
                          src={avatar?.sm}
                          height={24}
                          width={24}
                        />
                      </figure>
                      {name}
                    </span>
                  );
                }))}
            {data.type === "playlists" && data.user && (
              <div className="flex items-center gap-1 text-xs">
                <figure className="relative w-5 h-5 rounded-full">
                  <SafeImage
                    className="relative! rounded-full! h-5! w-5!"
                    src={data.user.avatar}
                    width={20}
                    height={20}
                  />
                </figure>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    redirect(`/user/${data.user.username}`);
                  }}
                  className="hover:underline cursor-pointer"
                >
                  {data.user.name}
                </span>
              </div>
            )}
          </span>
        </span>
      </Link>
    </li>
  );
};
