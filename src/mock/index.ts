import { supabase } from "../lib/supabase";
import type {
  AlbumObject,
  AlbumProps,
  ArtistObject,
  ArtistProps,
  TrackObject,
  TrackProps,
  TrackPropsEndpoint,
} from "../shared/types";

import {
  undeadMp3,
  undeadJpg,
  ruleMp3,
  zanmuJpg,
  hollowHungerJpg,
  hollowHungerMp3,
  adoAvatar,
  eienNoAkuruhiMp3,
  adosUtattemitaJpg,
  godIshMp3,
} from "./../assets";

const artists: ArtistObject[] = [
  {
    id: "ado",
    name: "Ado",
    image: adoAvatar,
    albums: ["zanmu", "ados-utattemita"],
  },
];

const albums: AlbumObject[] = [
  {
    id: "zanmu",
    name: "Zanmu",
    image: zanmuJpg,
    tracks: ["RuLe-Ado", "Eien No Akuruhi-Ado"],
    artist: "Ado",
  },
  {
    id: "ados-utattemita",
    name: "Ado's Utattemita",
    image: adosUtattemitaJpg,
    tracks: ["God Ish-Ado"],
    artist: "Ado",
  },
];

const tracks: TrackObject[] = [
  {
    song: undeadMp3,
    image: undeadJpg,
    name: "Undead",
    artist: "YOASOBI",
  },
  {
    song: ruleMp3,
    name: "RuLe",
    artist: "Ado",
    album: "zanmu",
  },
  {
    song: hollowHungerMp3,
    image: hollowHungerJpg,
    name: "Hollow Hunger",
    artist: "OxT",
  },
  {
    song: eienNoAkuruhiMp3,
    name: "Eien No Akuruhi",
    artist: "Ado",
    album: "zanmu",
  },
  {
    song: godIshMp3,
    name: "God Ish",
    artist: "Ado",
    album: "ados-utattemita",
  },
];

const TRACKS = tracks.map((track) => {
  const { name, artist, album: albumId, image, ...rest } = track;

  let albumObject = albums.find((album) => albumId === album.id);

  const id = `${name}-${artist}`;

  const imageTrack = !image
    ? (albumObject?.image as ImageMetadata)
    : (image as ImageMetadata);

  return {
    ...rest,
    name,
    artist,
    album: albumObject && { id: albumObject.id, name: albumObject.name },
    id,
    image: imageTrack,
  } as TrackProps;
});

const ALBUMS = albums.map((album) => {
  const { id, tracks: tracksList, ...rest } = album;

  const albumTracks = tracksList
    .map((trackId) => TRACKS.filter((track) => track.id === trackId))
    .flat();

  return { ...rest, id, tracks: albumTracks } as AlbumProps;
});

const ARTISTS = artists.map((artist) => {
  const { albums: albumsList, ...rest } = artist;

  const artistAlbums = albumsList
    .map((name) => {
      return ALBUMS.find((album) => name === album.id);
    })
    .filter((album) => album) as AlbumProps[];

  if (artistAlbums) return { ...rest, albums: artistAlbums } as ArtistProps;
  return { ...rest } as ArtistProps;
});

const TracksByArtistName = (artistName: string) =>
  TRACKS.filter((track) => track.artist === artistName);

const { data: dataTracks } = await supabase.from("tracks").select("*");

const isTrack = (x: any): x is TrackPropsEndpoint => dataTracks!.includes(x);
const isAlbum = (x: any): x is AlbumProps => ALBUMS.includes(x);
const isArtist = (x: any): x is ArtistProps => ARTISTS.includes(x);

export {
  TRACKS,
  isTrack,
  ALBUMS,
  isAlbum,
  ARTISTS,
  isArtist,
  TracksByArtistName,
};
