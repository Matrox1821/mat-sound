import prisma from "@/config/db";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { onThrowError } from "@/apiService";

const CLOUDFLARE_PUBLIC_ENDPOINT = process.env.CLOUDFLARE_PUBLIC_ENDPOINT;

const createArtistInDatabase = async (body: any) => {
  const newArtist = await prisma.artist.create({
    data: {
      name: body.name,
      image: CLOUDFLARE_PUBLIC_ENDPOINT + body.avatar_path,
      page_cover: CLOUDFLARE_PUBLIC_ENDPOINT + body.page_cover_path,
      description: body.description,
      is_verified: body.is_verified === "on",
      listeners: parseInt(body.listeners),
      followers_default: parseInt(body.followers),
      socials: JSON.parse(body.socials),
      regional_listeners: JSON.parse(body.regional_listeners),
      covers: body.covers_path.map((cover: any) => CLOUDFLARE_PUBLIC_ENDPOINT + cover),
    },
  });

  if (!newArtist)
    throw new CustomError({
      errors: [{ message: "The artist has not been created" }],
      msg: "The artist has not been created",
      httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  return newArtist;
};

const createAlbumInDatabase = async (body: any) => {
  try {
    const artists = body.artists as { id: string; name: string }[];
    const tracks_in_order = body.tracks_in_order as { [key: string]: string }[];

    const createdAlbum = await prisma.album.create({
      data: {
        name: body.name,
        image: CLOUDFLARE_PUBLIC_ENDPOINT + body.cover_path,
        copyright: body.copyright,
        release_date: new Date(body.release_date),
        artist: {
          connect: {
            id: artists[0].id,
          },
        },
        tracks: {
          create: [
            ...(tracks_in_order.length > 0
              ? tracks_in_order.map((track) => {
                  const id = Object.keys(track)[0];
                  const order = Object.values(track)[0];
                  return {
                    track_id: id,
                    order_in_album: parseInt(order),
                  };
                })
              : []),
          ],
        },
      },
    });

    if (!createdAlbum) {
      throw new CustomError({
        errors: [{ message: "The album was not created" }],
        msg: "The album was not created",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
    if (tracks_in_order.length > 0) {
      const updateTracksInAlbum = prisma.track.updateMany({
        where: {
          AND: [
            ...tracks_in_order.map((track) => {
              const id = Object.keys(track)[0];
              return {
                id,
              };
            }),
          ],
        },
        data: {
          image: CLOUDFLARE_PUBLIC_ENDPOINT + body.cover_path,
        },
      });
      if (!updateTracksInAlbum) {
        throw new CustomError({
          errors: [{ message: "The tracks in the album was not been updated" }],
          msg: "The tracks in the album was not updated",
          httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        });
      }
    }
    return createdAlbum;
  } catch (error) {
    return onThrowError(error);
  }
};
const createTrackInDatabase = async (body: any) => {
  try {
    const artists = body.artists as { id: string; name: string }[];

    const ordersInAlbum = body.order_in_album as { [key: string]: string }[];

    const createdTrack = await prisma.track.create({
      data: {
        name: body.name,
        image:
          body.image.size !== 0 ? CLOUDFLARE_PUBLIC_ENDPOINT + body.cover_path : body.album_image,
        song: CLOUDFLARE_PUBLIC_ENDPOINT + body.song_path,
        copyright: body.copyright,
        release_date: new Date(body.release_date),
        duration: body.duration,
        reproductions: body.reproductions,
        artists: {
          create: [
            ...artists.map((artist) => {
              return { artist_id: artist.id };
            }),
          ],
        },
        albums: {
          create: [
            ...ordersInAlbum.map((obj) => {
              const id = Object.keys(obj)[0];
              const orderInAlbum = parseInt(Object.values(obj)[0]);
              return { album_id: id, order_in_album: orderInAlbum };
            }),
          ],
        },
      },
    });

    if (!createdTrack) {
      throw new CustomError({
        errors: [{ message: "The album was not created" }],
        msg: "The album was not created",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
    return createdTrack;
  } catch (error) {
    return onThrowError(error);
  }
};

const artistsExists = async (artistsId: string[]) => {
  try {
    const artistsIdParsed = artistsId.map((id) => {
      return { id };
    });
    const existArtists = await prisma.artist.findMany({
      where: {
        AND: artistsIdParsed,
      },
    });
    return existArtists;
  } catch (error) {
    console.log(error);
  }
};

//to adjust
const findArtistInDatabase = async (body: any, isError: boolean) => {
  const isNewArtist = await prisma.artist.findFirst({
    where: {
      ...(body.name ? { name: body.name } : { id: body.id }),
    },
  });

  if (isNewArtist && isError)
    throw new CustomError({
      errors: [{ message: "Artist already exists." }],
      msg: "Artist already exists.",
      httpStatusCode: HttpStatusCode.CONFLICT,
    });
  return isNewArtist;
};

export {
  createArtistInDatabase,
  findArtistInDatabase,
  createAlbumInDatabase,
  createTrackInDatabase,
};
