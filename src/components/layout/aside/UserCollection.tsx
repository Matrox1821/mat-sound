"use client";
import { use } from "react";
/* import { AsideLink } from "./AsideLink";
import { PlaylistImage } from "@components/ui/images/PlaylistImage";
import { SafeImage } from "@components/ui/images/SafeImage";
 */
export function UserCollection({ promise, isExpanded }: any) {
  const items = use(promise);
  if (!items) return null;

  return (
    <div className="mt-8 flex flex-col gap-1 border-t border-background-800/60 pt-4">
      <p
        className={`text-[10px] font-bold text-content-500 mb-2 h-[15px] overflow-hidden pl-4 uppercase tracking-wider transition-opacity delay-75 ${
          isExpanded ? "opacoty-100" : "opacity-0"
        } `}
      >
        Tu Biblioteca
      </p>

      <ul className="flex flex-col gap-1">
        {/*  {items.collection.map((item: any) => {
          // Decidimos qué mostrar: Imagen de portada o Icono por defecto
          let visual = (
            <SafeImage
              src={item.cover}
              alt={item.name}
              width={32}
              height={32}
              className="!object-cover !w-full !h-full "
            />
          );
          if (item.type === "playlist")
            visual = (
              <PlaylistImage
                trackImages={item.tracks}
                sizeImage={32}
                imageClassName="!w-8 !h-8 rounded-sm"
              />
            );
          return (
            <AsideLink
              key={item.id}
              href={`/${item.type}/${item.id}`} // Dinámico según sea playlist/album/etc
              label={item.name}
              visual={visual}
              isExpanded={isExpanded}
              isActive={pathname === `/${item.type}/${item.id}`}
            />
          );
        })} */}
      </ul>
    </div>
  );
}
