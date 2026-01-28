"use client";
import { ArtistFormData } from "@shared-types/form.types";
import { ArtistByPagination } from "@shared-types/artist.types";
import { CustomInputAdminForm } from "../inputs/CustomInputAdminForm";
import { useState } from "react";
import { SafeImage } from "@components/ui/images/SafeImage";
export const mapArtistToEditFormData = (artist: ArtistByPagination): ArtistFormData => {
  return {
    id: artist.id,
    name: artist.name,
    listeners: artist.listeners || 0,
    followers: artist.followersDefault || 0,
    description: artist.description ?? "",
    isVerified: artist.isVerified ?? false,
    avatar: null,
    mainCover: null,
    covers: null,
    regionalListeners: flattenObjectArray(artist.regionalListeners),
    socials: flattenObjectArray(artist.socials),
  };
};
const flattenObjectArray = (
  data?: Record<string, string>[] | Record<string, string> | null | any,
): Record<string, string> => {
  if (!data) return {};

  if (typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, string>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0 || typeof data[0] === "string") return {};

    return data.reduce((acc, curr) => {
      if (curr && typeof curr === "object" && !Array.isArray(curr)) {
        return { ...acc, ...curr };
      }
      return acc;
    }, {});
  }

  return {};
};

export function SeeArtistBody({ artist }: { artist: ArtistByPagination }) {
  const parsedArtist = mapArtistToEditFormData(artist);

  const [formData, _setFormData] = useState<ArtistFormData>(parsedArtist);
  return (
    <div className="w-[750px] flex flex-col gap-4 text-xs overflow-auto">
      <article className="flex flex-col p-4 w-full h-[420px] overflow-y-auto gap-6">
        <div className="flex w-full gap-6 justify-between flex-col">
          <CustomInputAdminForm
            title="Nombre del artista:"
            name="name"
            type="text"
            value={formData.name}
            disabled
          />
          <div className="flex w-full gap-4 text-lg items-center">
            <div className="flex flex-col gap-2 w-1/4 items-center">
              <h3>Avatar</h3>
              <figure className="h-22 w-22 border border-background-100/40 flex items-center justify-center rounded-md">
                <SafeImage
                  src={artist.avatar && artist.avatar.sm}
                  alt=""
                  width={30}
                  height={30}
                  className="!w-16 !h-16 !object-cover !rounded-sm"
                />
              </figure>
            </div>
            <div className="flex flex-col gap-2 w-1/4 items-center">
              <h3>Portada</h3>
              <figure className="h-22 w-22 border border-background-100/40 flex items-center justify-center rounded-md">
                <SafeImage
                  src={artist.mainCover}
                  alt=""
                  width={30}
                  height={30}
                  className="w-16 h-16 object-cover rounded-sm  "
                />
              </figure>
            </div>
            <div className="flex w-1/2 gap-4 text-sm">
              <CustomInputAdminForm
                title="Oyentes mensuales:"
                name="listeners"
                type="number"
                value={formData.listeners}
                inBox
                disabled
              />
              <CustomInputAdminForm
                title="Seguidores:"
                name="followers"
                type="number"
                value={formData.followers}
                inBox
                disabled
              />
            </div>
          </div>
        </div>

        <div className="flex w-full gap-4 justify-between flex-col">
          <h3 className="text-lg">Descripción</h3>
          <p>{formData.description}</p>

          <CustomInputAdminForm
            title="Está verificado?"
            name="isVerified"
            type="checkbox"
            value={formData.isVerified}
            disabled
          />
        </div>

        <div className="flex flex-col w-full gap-3">
          <h3 className="text-lg">Oyentes regionales:</h3>
          <ul className="w-full flex flex-wrap gap-2">
            {artist?.regionalListeners && Object.entries(artist?.regionalListeners).length > 0 ? (
              Object.entries(artist?.regionalListeners).map(([key, value], i) => (
                <li
                  key={i}
                  className="bg-accent-950/10 border border-accent-900/40 rounded-sm flex gap-3 p-1"
                >
                  <span>{key}</span>
                  <span>:</span>
                  <span>{String(value)}</span>
                </li>
              ))
            ) : (
              <li className="bg-accent-950/10 border border-accent-900/40 rounded-sm flex gap-3 p-1">
                Sin Datos
              </li>
            )}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg">Redes sociales:</h3>
          <ul className="w-full flex flex-wrap gap-2">
            {artist?.socials && Object.entries(artist?.socials).length > 0 ? (
              Object.entries(artist?.socials).map(([key, value], i) => (
                <li
                  key={i}
                  className="bg-accent-950/10 border border-accent-900/40 rounded-sm flex gap-2 p-1"
                >
                  <span>{key}</span>
                  <span>:</span>
                  <span>{String(value)}</span>
                </li>
              ))
            ) : (
              <li className="bg-accent-950/10 border border-accent-900/40 rounded-sm flex gap-3 p-1">
                Sin Datos
              </li>
            )}
          </ul>
        </div>

        {/* <CustomInputAdminForm
          title="Portadas:"
          name="covers"
          type="file"
          value={formData.covers}
          onChange={(val) => onChange("covers", val)}
          isMultiple
          isRequired
          defaultImages={covers || null}
        /> */}
      </article>
    </div>
  );
}
