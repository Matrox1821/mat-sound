"use client";
import { SelectInput } from "@components/features/inputs/SelectInput";
import { useEffect, useState } from "react";
import { getArtistsData } from "@/shared/server/artist/artist.repository";

export function ArtistsSelect({ onChange }: { onChange: (value: string[]) => void }) {
  const [artists, setArtists] = useState<any>(null);
  const [artistsId, setArtistsId] = useState<string[]>([]);

  useEffect(() => {
    getArtistsData().then((data: any) => setArtists(data));
  }, []);

  useEffect(() => {
    if (artistsId.length > 0) {
      const params = new URLSearchParams();
      artistsId.forEach((artistsId) => params.append("artists_id", artistsId));
    }
  }, [artistsId]);
  return (
    <section className="p-8 w-full">
      <SelectInput
        data={artists}
        name="artistsId"
        zIndex={50}
        callback={(artists: string[]) => {
          setArtistsId(artistsId);
          onChange(artists);
        }}
        title="Seleccione artistas"
        options={{ isMultiple: true, sendName: true }}
      />
    </section>
  );
}
