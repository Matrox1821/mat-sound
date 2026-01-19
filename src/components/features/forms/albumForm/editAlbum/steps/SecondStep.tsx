"use client";
import { ArtistSearchInput } from "@/components/features/inputs/ArtistSearchInput";
import { OrderAlbumInput } from "@/components/features/inputs/OrderInAlbumInput";
import { SelectInput } from "@/components/features/inputs/SelectInput";
import { trackAdminApi } from "@/queryFn/admin/trackApi";
import { useEffect, useState, useRef } from "react";

export function SecondStep({
  formData,
  onChange,
  albumArtists,
  albumTracks,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
  albumArtists: any[];
  albumTracks: any[];
}) {
  const [selectedArtists, setSelectedArtists] = useState<any[]>(albumArtists || []);
  const [tracks, setTracks] = useState<any[]>([]);
  const [chosenTracks, setChosenTracks] = useState<any[]>(albumTracks || []);
  const lastArtistIdsRef = useRef<string>("");

  // 1. CARGA INICIAL: Sincronizar tracks disponibles cuando se cargan los artistas iniciales
  useEffect(() => {
    if (albumArtists?.length > 0) {
      const ids = albumArtists.map((a) => a.id);
      trackAdminApi.getTracksByArtistsId(ids).then((fetched) => {
        setTracks(fetched || []);
      });
    }
  }, []);

  // 2. EFECTO DE SINCRONIZACIÓN (Tu lógica existente con mejoras)
  useEffect(() => {
    const ids = selectedArtists.map((a) => a.id);
    const idsString = ids.join(",");

    if (idsString === lastArtistIdsRef.current) return;
    lastArtistIdsRef.current = idsString;

    onChange("artists", ids);

    if (ids.length > 0) {
      trackAdminApi.getTracksByArtistsId(ids).then((fetchedTracks) => {
        setTracks(fetchedTracks || []);

        setChosenTracks((prev) => {
          // Solo filtramos si YA tenemos tracks cargados, para no vaciar la selección inicial por error
          if (!fetchedTracks || fetchedTracks.length === 0) return prev;

          const filtered = prev.filter((chosen) =>
            fetchedTracks.some((t: any) => t.id === chosen.id),
          );

          // Si el filtro resulta en 0 pero antes teníamos algo,
          // quizás la API aún no devolvió todo. Mantenemos el prev.
          return filtered.length === 0 && prev.length > 0 ? prev : filtered;
        });
      });
    } else {
      setTracks([]);
      setChosenTracks([]);
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
        initialElements={albumTracks}
        zIndex={30}
        title="Seleccione canciones"
        callback={(_, newTracks) => {
          if (JSON.stringify(newTracks) !== JSON.stringify(chosenTracks)) {
            setChosenTracks(newTracks);
            // También notificamos al padre de los IDs
            onChange(
              "tracksId",
              newTracks.map((t) => t.id),
            );
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
        initialValues={formData.tracksOrder}
      />
    </section>
  );
}
