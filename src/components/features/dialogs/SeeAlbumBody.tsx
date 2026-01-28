"use client";
import { useState } from "react";
import { AlbumFormData } from "@shared-types/form.types";
import { AlbumByPagination } from "@shared-types/album.types";
import { CustomInputAdminForm } from "../inputs/CustomInputAdminForm";
export const mapAlbumToEditFormData = (album: AlbumByPagination): AlbumFormData => {
  return {
    id: album.id,
    name: album.name,
    releaseDate: album.releaseDate?.toString() || "",
    cover: null,
  };
};

export function SeeAlbumBody({ album }: { album: AlbumByPagination }) {
  const parsedAlbum = mapAlbumToEditFormData(album);
  const [formData, _setFormData] = useState<AlbumFormData>(parsedAlbum);

  return (
    <div className="w-[750px] flex flex-col gap-4 text-xs overflow-auto">
      <article className="flex flex-col">
        <div className="flex w-full gap-4 justify-between mt-8 flex-col">
          <CustomInputAdminForm
            title="Nombre del álbum:"
            name="name"
            type="text"
            value={formData.name}
            disabled
          />
          <div className="flex w-full gap-4 justify-between mt-4">
            <CustomInputAdminForm
              title="Imagen del Álbum:"
              name="cover"
              type="file"
              value={album.cover?.sm}
              disabled
              defaultImage={album.cover?.sm}
            />
            <label className="flex flex-col gap-2 w-6/12 ">
              <span className="text-base">Fecha de lanzamiento:</span>
              <input
                type="date"
                name="releaseDate"
                className="fill-accent-950 date-input text-white rounded-md bg-background-950 border-2 border-content-700 h-10 p-2"
                value={formData.releaseDate ? formData.releaseDate.split("T")[0] : ""}
                disabled
              />
            </label>
          </div>
        </div>
      </article>
    </div>
  );
}
