"use client";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { albumBulkSchema } from "@/shared/utils/schemas/bulkValidations";
import { useState } from "react";
import z from "zod";
import { createAlbumsBulkServer } from "@/actions/album";
import { ArtistSearchInput } from "@/components/features/inputs/ArtistSearchInput";

export default function BulkAlbumUpload() {
  const [jsonInput, setJsonInput] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const { success, error, warning } = useToast();

  const addArtist = (artist: any) => {
    setSelectedArtist(artist);
  };
  const removeArtist = () => {
    setSelectedArtist(null);
  };

  const handleUpload = async () => {
    if (!selectedArtist) return warning("Selecciona un artista primero.");
    try {
      const parsedData = JSON.parse(jsonInput);
      const validation = z.array(albumBulkSchema).safeParse(parsedData);

      if (!validation.success) {
        const firstError = validation.error.issues[0];
        warning(`Error: ${firstError.path.join(".")} - ${firstError.message}`);
        return;
      }

      const result = await createAlbumsBulkServer({
        artistId: selectedArtist.id,
        albums: validation.data,
      });

      if (result) {
        success("¡Álbumes cargados exitosamente!");
        setJsonInput("");
      } else {
        error("Error en el servidor.");
      }
    } catch {
      warning("JSON mal formado.");
    }
  };

  return (
    <div className="p-6 bg-background-950 rounded-lg shadow-md border border-background-800">
      <h2 className="text-xl font-bold text-white">Carga Masiva de Álbumes</h2>
      <ArtistSearchInput onSelect={addArtist} placeholder="Buscar artista por nombre..." />
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {selectedArtist && (
          <div
            key={selectedArtist}
            className="flex items-center gap-2 bg-accent-900/20 border-accent-900/50  border  text-blue-100 px-3 py-1.5 rounded-lg transition-all hover:bg-blue-600/30"
          >
            <span className="text-sm font-medium">{selectedArtist.name}</span>
            <button
              onClick={() => removeArtist()}
              className="text-blue-300 hover:text-white transition-colors"
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
        )}
        {!selectedArtist ||
          (!selectedArtist?.id && (
            <p className="text-xs text-background-500 italic">No hay artistas seleccionados</p>
          ))}
      </div>
      <textarea
        className="w-full h-64 p-4 bg-background-900 border border-background-800 rounded-md font-mono text-sm mb-4 text-background-100 focus:outline-none"
        placeholder={`[
  {
    "name": "Kyougen",
    "releaseDate": "2022-01-26T00:00:00.000Z"
  }
]`}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      <button
        onClick={handleUpload}
        className="bg-background-800/70 text-white px-6 py-2 rounded-md hover:bg-background-700 transition"
      >
        Procesar Álbumes
      </button>
    </div>
  );
}
