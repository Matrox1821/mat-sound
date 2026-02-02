"use client";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { UserCollection } from "@/types/user.types";
import { usePalette } from "react-palette";

export function CollectionCard({ element }: { element: UserCollection }) {
  const playlistImage =
    element.type === "playlist" && (element.cover?.md || element.tracksCover[0].md);
  const image = playlistImage || (element.cover && element.cover.md);
  const { data } = usePalette(image + "?solve-cors-error" || "");
  return (
    <li className="w-full h-68 relative">
      <div className={`w-full h-50 flex items-center justify-center rounded-md relative`}>
        {element.type !== "track" && (
          <>
            <span
              className={`w-10/12 h-50 flex items-center justify-center rounded-lg absolute -top-4 -z-10 bg-background-900 brightness-50`}
              style={{ backgroundColor: data.darkMuted }}
            />
            <span
              className={`w-11/12 h-50  rounded-lg absolute -top-2 z-0 bg-background-900 brightness-75`}
              style={{ backgroundColor: data.darkMuted }}
            />
          </>
        )}
        <div
          className={`w-full h-50 flex items-center justify-center rounded-lg relative bg-background-900 z-10 ${element.type === "playlist" ? "playlist-shadow" : ""}`}
          style={{ backgroundColor: data.darkMuted }}
        >
          <figure className="h-full aspect-square relative">
            <SafeImage
              src={image || ""}
              fill
              className={`!h-full !aspect-square !relative !object-fill`}
              quality={75}
            />
            {/* <CarouselCardPlayButton playlist={playlist} /> */}
          </figure>
          {element.type !== "track" && (
            <span className="bg-background/50 rounded-lg p-2 text-xs absolute right-2 bottom-2">
              {element.tracksCount} canciones
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-medium">{element.name}</h3>
      <h3 className="text-xl font-medium"></h3>
    </li>
  );
}
