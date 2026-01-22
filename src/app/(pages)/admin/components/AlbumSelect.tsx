"use client";
import { SelectInput } from "@/components/features/inputs/SelectInput";
import { albumAdminApi } from "@/queryFn/admin/albumApi";
import { useEffect, useState } from "react";

export function AlbumSelect({
  onChange,
  artistId,
}: {
  onChange: (value: string) => void;
  artistId: string[];
}) {
  const [albums, setAlbums] = useState<any>(null);
  useEffect(() => {
    if (!artistId) return;

    if (artistId.length > 0) {
      albumAdminApi.getAlbumsByArtistsId(artistId).then((data) => setAlbums(data));

      albumAdminApi.getAlbumsByArtistsId(artistId).then((data: any) => {
        setAlbums(data);
      });
    }
  }, [artistId]);

  // Si no hay artista seleccionado, mostramos el componente vacío o bloqueado
  const displayData = artistId ? albums : null;

  return (
    <section className="p-8 w-full">
      <SelectInput
        key={artistId[0]}
        data={displayData}
        name="albumId"
        zIndex={40}
        callback={(selected: string[]) => {
          if (selected.length > 0) {
            onChange(selected[0]);
          }
        }}
        title={artistId ? "Seleccione álbum de destino" : "Primero seleccione un artista"}
        options={{ isMultiple: false, sendName: true }}
      />
    </section>
  );
}
