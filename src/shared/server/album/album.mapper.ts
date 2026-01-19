import { AlbumById } from "@/types/album.types";
import { ImageSizes } from "@/types/common.types";

export const mapAlbumDetails = (rawData: any): AlbumById => {
  const duration = rawData.tracks
    .map(({ track }: any) => track.duration)
    .reduce((a: number, b: number) => a + b);
  return {
    id: rawData.id,
    name: rawData.name,
    cover: rawData.cover as ImageSizes,
    releaseDate: rawData.releaseDate,
    trackCount: rawData._count?.tracks ?? 0,
    duration: duration | 0,
    artists: rawData.artists.map((a: any) => ({
      id: a.id,
      name: a.name,
      avatar: a.avatar as ImageSizes | null,
    })),
    tracks: rawData.tracks.map((t: any) => ({
      order: t.order,
      disk: t.disk,
      track: {
        ...t.track,
        cover: t.track.cover as ImageSizes,
        artists: t.track.artists,
        albums: t.track.albums.map((item: any) => item.album),
      },
    })),
  };
};
