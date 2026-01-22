import { contentProps, ImageSizes } from "@/types/common.types";
import { APIContent } from "@/types/apiTypes";
export function parseContent(content: APIContent[]): contentProps[] {
  return content.map((data) => {
    const { release_date, cover, avatar, _count, albums, artists, tracks, song, isLiked, ...rest } =
      data;
    return {
      ...rest,
      image: (avatar || cover) as ImageSizes,
      song: song ?? "",
      likes: _count?.likes ?? 0,
      releaseDate: release_date ?? "",
      isLiked: isLiked,
      albums:
        albums?.map((item) => ({
          id: item.album.id,
          name: item.album.name,
          cover: item.album.cover,
        })) ?? null,

      artists:
        artists?.map((item) => ({
          id: item.id,
          name: item.name,
          avatar: item.avatar,
        })) ?? null,

      tracks:
        tracks && tracks?.length > 0
          ? tracks.map((trackItem) => {
              const t = trackItem;
              return {
                id: t.id,
                name: t.name,
                duration: t.duration ?? 0,
                cover: t.cover,
                releaseDate: t.release_date ?? "",
                reproductions: t.reproductions ?? 0,
                likes: t._count?.likes ?? 0,
                isLiked: t.isLiked,
                song: t.song ?? "",
                lyrics: t.lyrics ?? "",

                albums: Array.isArray(t.albums)
                  ? t.albums.map((a) => ({
                      id: a.album.id,
                      name: a.album.name,
                    }))
                  : null,

                artists: Array.isArray(t.artists)
                  ? t.artists.map((ar) => ({
                      id: ar.id,
                      name: ar.name,
                      avatar: ar.avatar,
                    }))
                  : null,
              };
            })
          : null,
    };
  });
}
