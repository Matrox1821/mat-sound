"use client";
import { ArtistSearchInput } from "@/components/features/inputs/ArtistSearchInput";
import { OrderAlbumInput } from "@/components/features/inputs/OrderInAlbumInput";
import { SelectInput } from "@/components/features/inputs/SelectInput";
import { trackAdminApi } from "@/queryFn/admin/trackApi";
import { useEffect, useState, useRef } from "react";

export function SecondStep({ onChange }: { onChange: (field: any, value: any) => void }) {
  const [selectedArtists, setSelectedArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [chosenTracks, setChosenTracks] = useState<any[]>([]);

  const lastArtistIdsRef = useRef<string>("");

  useEffect(() => {
    const ids = selectedArtists.map((a) => a.id);
    const idsString = ids.join(",");

    if (idsString === lastArtistIdsRef.current) return;
    lastArtistIdsRef.current = idsString;

    onChange("artists", ids);

    if (ids.length > 0) {
      trackAdminApi
        .getTracksByArtistsId(ids)
        .then((fetchedTracks) => {
          setTracks(fetchedTracks || []);

          setChosenTracks((prev) => {
            const filtered = prev.filter((chosen) =>
              fetchedTracks.some((t: any) => t.id === chosen.id),
            );
            return filtered.length === prev.length ? prev : filtered;
          });
        })
        .catch((err) => console.error("Error cargando tracks:", err));
    } else {
      setTracks((prev) => (prev.length > 0 ? [] : prev));
      setChosenTracks((prev) => (prev.length > 0 ? [] : prev));
    }
  }, [selectedArtists, onChange]);

  const addArtist = (artist: any) => {
    if (!selectedArtists.find((a) => a.id === artist.id)) {
      setSelectedArtists((prev) => [...prev, artist]);
    }
  };

  const removeArtist = (id: string) => {
    setSelectedArtists((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <section className="p-8 w-full flex flex-col gap-8">
      <div className="space-y-4">
        <label className="text-sm font-bold text-background-400 uppercase tracking-wider">
          Artistas Intérpretes
        </label>
        <ArtistSearchInput onSelect={addArtist} placeholder="Buscar artista..." />

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {selectedArtists.map((artist) => (
            <div
              key={artist.id}
              className="flex items-center gap-2 bg-accent-900/20 border-accent-900/50 border text-blue-100 px-3 py-1.5 rounded-lg"
            >
              <span className="text-sm font-medium">{artist.name}</span>
              <button
                onClick={() => removeArtist(artist.id)}
                className="text-blue-300 hover:text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <SelectInput
        data={tracks}
        name="tracksId"
        zIndex={30}
        title="Seleccione canciones"
        callback={(_, newTracks) => {
          if (JSON.stringify(newTracks) !== JSON.stringify(chosenTracks)) {
            setChosenTracks(newTracks);
          }
        }}
        options={{ isMultiple: true }}
      />

      <OrderAlbumInput
        data={chosenTracks}
        name="orderAndDisk"
        zIndex={20}
        title="Configurar orden en el disco"
        onChange={(val) => onChange("tracksOrder", val)}
      />
    </section>
  );
}
