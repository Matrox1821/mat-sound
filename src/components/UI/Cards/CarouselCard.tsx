import Image from "next/image";
import CarouselCardPlayButton from "../Buttons/CarouselCardPlayButton";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import Link from "next/link";
import { contentProps } from "@/types";
import { LikeButton } from "../Buttons/Like";

const roundedByIndex = (index: number) => {
  switch (index) {
    case 0:
      return "rounded-tl-md";
    case 1:
      return "rounded-tr-md";
    case 2:
      return "rounded-br-md";
    case 3:
      return "rounded-bl-md";
    default:
      return "rounded-md";
  }
};

export default function CarouselCard({ element }: { element: contentProps }) {
  const { isMobile } = useDevice();
  const desktopStyle = isMobile
    ? "[&_.play-button]:opacity-100 [&_.play-button]:!-translate-y-1"
    : "hover:[&_.play-button]:opacity-100 hover:[&_.play-button]:!transition-all hover:[&_.play-button]:!duration-300 hover:[&_.play-button]:!-translate-y-1 not-hover:[&_.play-button]:!transition-all not-hover:[&_.play-button]:!duration-300";
  const fallbackImage = "/placeholder.png";
  return (
    <li className="w-full color-content-950 duration-150 gap-2">
      <Link
        className={`w-full h-full flex flex-col color-content-950 duration-150 gap-2 track rounded-lg relative active:not-[:has(&_.play-button:active,&_.like-button:active)]:scale-[.98] active:not-[:has(&_.play-button:active,&_.like-button:active)]:opacity-80 z-10 ${desktopStyle}`}
        href={`/${element.type}/${element.id}`}
      >
        <figure className="w-full aspect-square relative">
          {element.type !== "playlists" && (
            <Image
              src={element.image.md || fallbackImage}
              alt={element.name}
              width={160}
              height={160}
              className={`object-fill aspect-square w-full ${
                element.type === "artists" ? "rounded-full" : "rounded-md"
              }`}
              loading="lazy"
              quality={50}
            />
          )}
          {/* {element.type === "playlists" && (
            <figure className="w-full grid grid-cols-2 grid-row-2 object-contain">
              {element.image?.map((image: string, i: number) => {
                return (
                  <Image
                    key={i}
                    src={image || fallbackImage}
                    alt={`${element.name} ${i + 1}`}
                    width={40}
                    height={40}
                    className={`object-fill aspect-square w-full 
                    ${roundedByIndex(i)}`}
                    loading="lazy"
                    quality={50}
                  />
                );
              })}
            </figure>
          )} */}
          {element.type === "tracks" && <CarouselCardPlayButton track={element} />}
        </figure>
        <span>
          <h2
            style={{ overflowWrap: "anywhere" }}
            className={`m-0 leading-5 text-base ${
              element.type === "artists" ? "font-semibold" : "font-normal"
            }`}
          >
            {element.name}
          </h2>
          {(element.type === "tracks" || element.type === "albums") && (
            <span className="m-0 leading-5 font-normal text-sm text-content-600/70">
              {element.artists && element.artists[0].name}
              {element.artist && element.artist.name}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}
