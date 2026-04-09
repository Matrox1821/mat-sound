"use client";
import { SelectInput } from "@components/features/inputs/SelectInput";
import { useEffect, useState } from "react";
import { getArtistsData } from "@/shared/server/artist/artist.repository";

export function TrackArtistSelect({ onChange }: { onChange: (value: string) => void }) {
  const [artists, setArtists] = useState<any>(null);

  useEffect(() => {
    getArtistsData().then((data: any) => setArtists(data));
  }, []);

  return (
    <section className="p-8 w-full">
      <SelectInput
        data={artists}
        name="artistsId"
        zIndex={50}
        callback={(selectedIds: string[]) => {
          if (selectedIds.length > 0) {
            onChange(selectedIds[0]);
          }
        }}
        title="Seleccione artista"
        options={{ isMultiple: false, sendName: true }}
      />
    </section>
  );
}
