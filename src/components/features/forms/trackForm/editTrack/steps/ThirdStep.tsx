"use client";
import { ArtistSearchInput } from "@components/features/inputs/ArtistSearchInput";
import { OrderAlbumInput } from "@components/features/inputs/OrderInAlbumInput";
import { SelectInput } from "@components/features/inputs/SelectInput";
import { albumAdminApi } from "@/queryFn/admin/albumApi";
import { useEffect, useState } from "react";

export function ThirdStep({
  onChange,
  initialData,
}: {
  onChange: (field: any, value: any) => void;
  initialData?: any;
}) {
  const [selectedArtists, setSelectedArtists] = useState<any[]>(initialData?.artistsData || []);
  const [albums, setAlbums] = useState<any[]>([]);
  const [chosenAlbums, setChosenAlbums] = useState<any[]>([]);

  // Notificar al padre (siempre que cambien los artistas)
  useEffect(() => {
    onChange(
      "artists",
      selectedArtists.map((a) => a.id),
    );
  }, [selectedArtists, onChange]);

  // CARGA DE ÁLBUMES: Este efecto se encarga de traer los datos cuando hay artistas
  useEffect(() => {
    const ids = selectedArtists.map((a) => a.id);

    if (ids.length > 0) {
      albumAdminApi
        .getAlbumsByArtistsId(ids)
        .then((fetchedAlbums) => {
          setAlbums(fetchedAlbums || []);

          // Limpiar de los elegidos aquellos que ya no pertenecen a los artistas actuales
          setChosenAlbums((prev) =>
            prev.filter((chosen) => fetchedAlbums.some((a: any) => a.id === chosen.id)),
          );
        })
        .catch((err) => console.error("Error cargando álbumes:", err));
    } else {
      setAlbums((prev) => (prev.length > 0 ? [] : prev));
      setChosenAlbums((prev) => (prev.length > 0 ? [] : prev));
    }
  }, [selectedArtists]);

  const addArtist = (artist: any) => {
    if (!selectedArtists.find((a) => a.id === artist.id)) {
      setSelectedArtists((prev) => [...prev, artist]);
    }
  };

  const removeArtist = (id: string) => {
    setSelectedArtists((prev) => prev.filter((a) => a.id !== id));
  };
  return (
    <section className="p-4 w-full flex flex-col gap-8">
      {/* 1. BUSCADOR */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-background-400 uppercase tracking-wider">
          Artistas Intérpretes
        </label>
        <ArtistSearchInput onSelect={addArtist} placeholder="Buscar artista por nombre..." />

        {/* 2. CHIPS DE SELECCIÓN (Esto reemplaza la vista del Select) */}
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {selectedArtists.map((artist) => (
            <div
              key={artist.id}
              className="flex items-center gap-2 bg-accent-900/20 border-accent-900/50  border  text-blue-100 px-3 py-1.5 rounded-lg transition-all hover:bg-blue-600/30"
            >
              <span className="text-sm font-medium">{artist.name}</span>
              <button
                onClick={() => removeArtist(artist.id)}
                className="text-blue-300 hover:text-white transition-colors"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          ))}
          {selectedArtists.length === 0 && (
            <p className="text-xs text-background-500 italic">No hay artistas seleccionados</p>
          )}
        </div>
      </div>

      {/* 3. SELECT DE ÁLBUMES (Dependiente de los artistas) */}
      <div className="space-y-4">
        <SelectInput
          data={albums}
          name="albumsId"
          zIndex={30}
          title={
            selectedArtists.length > 0 ? "Seleccionar álbumes" : "Selecciona un artista primero"
          }
          callback={(_, albumsData) => setChosenAlbums(albumsData)}
          options={{ isMultiple: true, sendImage: true }}
        />
      </div>

      {/* 4. ORDEN EN EL ÁLBUM */}
      <OrderAlbumInput
        data={chosenAlbums}
        name="orderAndDisk"
        zIndex={20}
        title="Configurar orden en el disco"
        onChange={(val) => onChange("orderAndDisk", val)}
      />
    </section>
  );
}
