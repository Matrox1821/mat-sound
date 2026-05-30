"use client";
import { AlbumDetails, PlaylistDetails } from "@/types/user.types";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { PlaylistImage } from "@/components/ui/images/PlaylistImage";
import { AsideLink } from "./AsideLink";
import { usePathname } from "next/navigation";
import { useCollectionStore } from "@/store/collectionStore";
import { useMemo } from "react";
import { usePlaylistStore } from "@/store/playlistStore";
import { PlayButton } from "@/components/ui/buttons/PlayButton";

type PlaylistWithType = PlaylistDetails & { type: "playlists" };
type AlbumWithType = AlbumDetails & { type: "albums" };
type ContentItem = PlaylistWithType | AlbumWithType;
export function UserCollection({ isExpanded }: { isExpanded: boolean }) {
  const pathname = usePathname();

  const storePlaylists = usePlaylistStore((s) => s.playlists);
  const collectionPlaylists = useCollectionStore((s) => s.playlists);
  const albums = useCollectionStore((s) => s.albums);

  const items: ContentItem[] = useMemo(() => {
    const playlistMap = new Map([...collectionPlaylists, ...storePlaylists]);

    return [
      ...Array.from(playlistMap.values()).map((p) => ({ ...p, type: "playlists" as const })),
      ...Array.from(albums.values()).map((a) => ({ ...a, type: "albums" as const })),
    ];
  }, [storePlaylists, collectionPlaylists, albums]);
  if (items.length === 0) return;
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
        {items.length ? (
          items.map((item) => {
            const visual = (
              <>
                <figure className="relative">
                  {item.type === "playlists" ? (
                    <PlaylistImage
                      trackImages={item.tracks
                        .map(({ cover }) => cover)
                        .filter((cover) => cover !== null)}
                      image={item.cover?.sm}
                      className="rounded-sm!"
                      size={40}
                    />
                  ) : (
                    <SafeImage
                      src={item.cover?.sm}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="!object-cover !w-full !h-full rounded-sm!"
                    />
                  )}
                </figure>
                <PlayButton
                  playingFrom={{ from: item.name, href: `${item.type}/${item.id}` }}
                  tracks={item.tracks}
                  className="top-0 right-0 h-full"
                />
              </>
            );
            return (
              <AsideLink
                key={item.id}
                href={`/${item.type}/${item.id}`} // Dinámico según sea playlist/album/etc
                label={item.name}
                visual={visual}
                isExpanded={isExpanded}
                isActive={pathname.includes(`/${item.type}/${item.id}`)}
              />
            );
          })
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
}
