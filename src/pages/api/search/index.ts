import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { HttpStatusCode } from "../../../types/httpStatusCode";
import { onSuccessRequest } from "../apiService";

enum typeData {
  artist = "artist",
  album = "album",
  track = "track",
}

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q");
  if (query) {
    let data: {
      image: string;
      name: string;
      id: string;
      type: typeData;
    }[] = [];

    const { data: artists } = await supabase
      .from("artists")
      .select("id,image:avatar,name")
      .ilike("name", `%${query?.split("").join("%%")}%`);
    if (artists != null) {
      const newArtists = artists.map((artist) => {
        return { ...artist, type: typeData.artist, artist: artist.name };
      });
      data = data.concat(newArtists);
    }

    const { data: tracks } = await supabase
      .from("tracks")
      .select("id,image,name,artist:artists(name),album:albums(name)")
      .ilike("name", `%${query?.split("").join("%%")}%`);

    if (tracks != null) {
      const newTracks = tracks.map((track) => {
        return {
          ...track,
          type: typeData.track,
          track: track.name,
          artist: track.artist ? track.artist?.name : "",
          album: track.album ? track.album?.name : "",
        };
      });
      data = data.concat(newTracks);
    }

    const { data: albums } = await supabase
      .from("albums")
      .select("id,image,name,artist:artists(name)")
      .ilike("name", `%${query?.split("").join("%%")}%`);

    if (albums != null) {
      const newAlbums = albums.map((album) => {
        return {
          ...album,
          type: typeData.album,
          artist: album.artist ? album.artist?.name : "",
        };
      });
      data = data.concat(newAlbums);
    }
    data = ordenarPorSimilitud(data, query);
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data,
    });
  }
  const track = url.searchParams.get("track");
  const artist = url.searchParams.get("artist");
  const album = url.searchParams.get("album");
  let data: any[] = [];
  if (track !== "" && track) {
    const { data: tracks } = await supabase
      .from("tracks")
      .select(
        "id,image,name,artist:artists(name,image:avatar,id),album:albums(name,image,id)"
      )
      .ilike("name", track);
    const flatTracks = tracks?.flatMap((track) => {
      const { artist, album, ...rest } = track;
      return [{ ...artist }, { ...album }, { ...rest }];
    });
    data.push(flatTracks);
  }
  if (artist !== "" && artist) {
    const { data: artists } = await supabase
      .from("artists")
      .select(
        "id,image:avatar,name,tracks(image,name,id),album:albums(name,image,id)"
      )
      .ilike("name", artist);

    const flatArtists = artists?.flatMap((artist) => {
      const { tracks, album, ...rest } = artist;
      const [...dataTracks] = tracks;
      const [...dataAlbums] = album;

      return [...dataTracks, ...dataAlbums, { ...rest }];
    });
    data.push(flatArtists);
  }
  if (album !== "" && album) {
    const { data: albums } = await supabase
      .from("albums")
      .select(
        "id,image,name,artist:artists(name,image:avatar,id),tracks(image,name,id)"
      )
      .ilike("name", album);

    const flatAlbums = albums?.flatMap((album) => {
      const { tracks, artist, ...rest } = album;
      const [...dataTracks] = tracks;
      return [...dataTracks, { ...artist }, { ...rest }];
    });
    data.push(flatAlbums);
  }
  data = data.flatMap((dataElements) => eliminarDuplicadosPorId(dataElements));
  console.log(ordenarPorSimilitud(data, track));
  return onSuccessRequest({
    httpStatusCode: HttpStatusCode.OK,
    data: data,
  });
};

function levenshteinDistance(a: any, b: any) {
  const matrix = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // eliminación
        matrix[i][j - 1] + 1, // inserción
        matrix[i - 1][j - 1] + cost // sustitución
      );
    }
  }

  return matrix[a.length][b.length];
}
function ordenarPorSimilitud(array: any, palabraObjetivo: any) {
  return array.sort((a: any, b: any) => {
    const distanciaA = levenshteinDistance(a.name, palabraObjetivo);
    const distanciaB = levenshteinDistance(b.name, palabraObjetivo);
    return distanciaA - distanciaB;
  });
}
function eliminarDuplicadosPorId(array: any) {
  const mapa = new Map();
  array.forEach((obj: any) => mapa.set(obj.id, obj));
  return Array.from(mapa.values());
}
