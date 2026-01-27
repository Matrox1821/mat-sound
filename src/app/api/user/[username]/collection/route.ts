import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params;
    if (!param.id) {
      throw new CustomError({
        errors: [
          {
            message: "User not found",
          },
        ],
        msg: "User not found",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    const userCollection = await prisma.user.findUnique({
      where: { id: param.id },
      select: {
        id: true,
        collection: {
          include: {
            playlists: {
              orderBy: { addedAt: "desc" },
              include: {
                playlist: {
                  select: {
                    id: true,
                    name: true,
                    cover: true,
                    updatedAt: true,
                    tracks: {
                      take: 4,
                      orderBy: { addedAt: "desc" },
                      select: { track: { select: { cover: true } } },
                    },
                  },
                },
              },
            },

            albums: {
              orderBy: { addedAt: "desc" },
              include: {
                album: {
                  select: {
                    id: true,
                    name: true,
                    cover: true,

                    artists: { select: { name: true, id: true, avatar: true } },
                  },
                },
              },
            },
            tracks: {
              orderBy: { addedAt: "desc" },
              include: {
                track: {
                  include: {
                    artists: { select: { id: true, avatar: true, name: true } },
                  },
                  omit: {
                    createdAt: true,
                    releaseDate: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        },
        following: {
          orderBy: { followedAt: "desc" },

          include: { artist: { select: { id: true, avatar: true, name: true } } },
        },
      },
    });

    if (!userCollection) {
      throw new CustomError({
        errors: [
          {
            message: "User not found",
          },
        ],
        msg: "User not found",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: parseUserCollection(userCollection),
    });
  } catch (error) {
    return onThrowError(error);
  }
}
export function parseUserCollection(data: any) {
  if (!data) return { id: null, collection: [] };

  const { id, collection, following } = data;
  const flatCollection: any[] = [];

  if (collection?.playlists) {
    collection.playlists.forEach((p: any) => {
      const d = p.playlist;
      flatCollection.push({
        id: d.id,
        name: d.name,
        images: d.images,
        type: "playlist",
        href: `/playlists/${d.id}`,
        addedAt: p.addedAt,
        tracks: d.tracks?.map((t: any) => t.track) || [],
      });
    });
  }

  // 2. Aplanar Álbumes
  if (collection?.albums) {
    collection.albums.forEach((a: any) => {
      const d = a.album;
      flatCollection.push({
        id: d.id,
        name: d.name,
        visual: d.cover,
        type: "album",
        href: `/albums/${d.id}`,
        addedAt: a.addedAt,
        artists: d.artists,
      });
    });
  }

  if (collection?.tracks) {
    collection.tracks.forEach((t: any) => {
      const d = t.track;
      flatCollection.push({
        id: d.id,
        name: d.name,
        visual: d.cover,
        type: "track",
        href: `/tracks/${d.id}`,
        addedAt: t.addedAt,
        artists: d.artists,
      });
    });
  }

  if (following) {
    following.forEach((f: any) => {
      const d = f.artist;
      flatCollection.push({
        id: d.id,
        name: d.name,
        visual: d.avatar,
        type: "artist",
        href: `/artists/${d.id}`,
        addedAt: f.followedAt,
      });
    });
  }

  flatCollection.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  return {
    id,
    collection: flatCollection,
  };
}
