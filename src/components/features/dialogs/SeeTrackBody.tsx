"use client";
import { useState } from "react";
import { TrackByPagination } from "@/types/track.types";
import { TrackFormData } from "@/types/form.types";
import CustomInputAdminForm from "../inputs/CustomInputAdminForm";

export const mapTrackToEditFormData = (track: TrackByPagination): TrackFormData => {
  return {
    id: track.id,
    name: track.name,
    cover: null,
    song: null,

    releaseDate: track.releaseDate ? new Date(track.releaseDate).toISOString() : "",

    duration: track.duration ?? 0,
    reproductions: track.reproductions ?? 0,
    lyrics: track.lyrics ?? "",

    genres: track.genres?.map((g) => g.id) ?? [],
    artists: track.artists?.map((a) => a.id) ?? [],

    orderAndDisk:
      track.albums?.reduce(
        (acc, curr) => {
          if (curr.album?.id) {
            acc[curr.album.id] = {
              order: curr.order,
              disk: curr.disk,
            };
          }
          return acc;
        },
        {} as { [key: string]: { order: number; disk: number } },
      ) ?? {},
  };
};

export function SeeTrackBody({ track }: { track: TrackByPagination }) {
  const parsedTrack = mapTrackToEditFormData(track);
  const [formData, _setFormData] = useState<TrackFormData>(parsedTrack);
  return (
    <div className="w-[750px] flex flex-col gap-4 text-xs overflow-auto">
      <section className="p-4 w-full flex flex-col gap-12 overflow-y-auto !h-[420px]">
        <CustomInputAdminForm
          title="Nombre de la Canción:"
          name="name"
          type="text"
          value={formData.name}
          disabled
        />
        <div className="flex w-full gap-4 justify-between ">
          <CustomInputAdminForm
            title="Imagen de la Canción:"
            name="cover"
            type="file"
            value={formData.cover}
            defaultImage={track.cover?.sm}
            disabled
          />
          {track.song && (
            <div className="w-5/12 flex flex-col gap-2 ">
              <h3 className="text-lg">Canción</h3>
              <span className="fill-accent-950 date-input text-white rounded-md bg-background-950 border border-background-100/50 h-10 w-1/2 p-2 flex items-center justify-center">
                song.mp3
              </span>
            </div>
          )}
        </div>
        <div className="flex w-full gap-4 justify-between items-start">
          <label className="flex flex-col gap-2 w-6/12 ">
            <span className="text-base">Fecha de lanzamiento:</span>
            <input
              type="date"
              name="releaseDate"
              className="fill-accent-950 date-input text-white rounded-md bg-background-950 border border-background-100/50 h-9 p-2"
              required
              value={formData.releaseDate ? formData.releaseDate.split("T")[0] : ""}
              readOnly
            />
          </label>
          <div className="w-1/2 flex flex-col gap-2">
            <h3 className="text-lg">Géneros</h3>
            <ul className="h-12 w-full overflow-y-auto flex flex-wrap gap-4">
              {track.genres?.map((genre) => (
                <li
                  key={genre.id}
                  className="p-2 bg-accent-950/20 border border-accent-950/50 h-8 flex items-center font-semibold rounded-md"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex w-full gap-4">
          <CustomInputAdminForm
            title="Duracion de cancion en segundos:"
            name="duration"
            type="number"
            inBox
            value={formData.duration}
            disabled
          />
          <CustomInputAdminForm
            title="Cantidad de reproducciones:"
            name="reproductions"
            type="number"
            inBox
            value={formData.reproductions}
            disabled
          />
        </div>
        <CustomInputAdminForm
          title="Letra de la canción:"
          name="lyrics"
          type="textarea"
          value={formData.lyrics}
          disabled
        />

        <div className="flex">
          <div className="w-1/2 flex flex-col gap-2">
            <h3 className="text-lg">Artistas</h3>
            <ul className="h-12 w-full overflow-y-auto flex flex-wrap gap-4">
              {track.artists?.map((artist) => (
                <li
                  key={artist.id}
                  className="p-2 bg-accent-950/20 border border-accent-950/50 h-8 flex items-center font-semibold rounded-md"
                >
                  {artist.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <h3 className="text-lg">Álbumes</h3>
            <ul className="h-12 w-full overflow-y-auto flex flex-wrap gap-4">
              {track.albums?.map(({ album }) => (
                <li
                  key={album.id}
                  className="p-2 bg-accent-950/20 border border-accent-950/50 h-8 flex items-center font-semibold rounded-md"
                >
                  {album.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 mb-12">
          <h3 className="text-lg">Géneros</h3>
          <ul className="w-full overflow-y-auto flex flex-wrap gap-4">
            {track.albums?.map((album) => (
              <li
                key={album.album.id}
                className="p-2 bg-accent-950/20 border border-accent-950/50 h-8 flex items-center font-semibold rounded-md w-full justify-between"
              >
                <span>{album.album.name}</span>
                <div className="flex gap-8">
                  <span>Disco N°{album.disk}</span>
                  <span>Orden N°{album.order}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
