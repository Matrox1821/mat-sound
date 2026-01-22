"use client";
import { useState, useTransition } from "react";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { trackBulkSchema } from "@/shared/utils/schemas/bulkValidations";
import { AlbumSelect } from "./AlbumSelect";
import z from "zod";
import { ArtistSearchInput } from "@/components/features/inputs/ArtistSearchInput";
import { createTracksBulkServer } from "@/actions/track";

export default function BulkTrackUpload() {
  const [jsonInput, setJsonInput] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { success, error, warning } = useToast();

  const addArtist = (artist: any) => {
    setSelectedArtist(artist);
  };
  const removeArtist = () => {
    setSelectedArtist(null);
  };

  const handleUpload = async () => {
    if (!selectedArtist) return warning("Selecciona un artista.");
    if (!selectedAlbumId) return warning("Selecciona un álbum de destino.");

    try {
      const parsedData = JSON.parse(jsonInput);
      const validation = z.array(trackBulkSchema).safeParse(parsedData);

      if (!validation.success) {
        const firstError = validation.error.issues[0];
        warning(`Error: ${firstError.path.join(".")} - ${firstError.message}`);
        return;
      }

      startTransition(async () => {
        const response = await createTracksBulkServer({
          artistId: selectedArtist.id,
          albumId: selectedAlbumId,
          tracks: validation.data,
        });

        if (response.success) {
          success(`¡Éxito! ${validation.data.length} tracks procesados.`);
          setJsonInput("");
        } else {
          error("Error en el servidor al crear los tracks.");
        }
      });
    } catch {
      warning("JSON mal formado.");
    }
  };

  return (
    <div
      className={`p-6 bg-background-950 rounded-lg border border-background-800 w-[600px] ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <h2 className="text-xl font-bold text-white m-4 pb-6">Carga Masiva de Tracks</h2>
      <div className="h-[600px] overflow-y-auto">
        <div className="flex flex-col">
          <div>
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
                  <p className="text-xs text-background-500 italic">
                    No hay artistas seleccionados
                  </p>
                ))}
            </div>
          </div>

          <AlbumSelect
            onChange={(id) => setSelectedAlbumId(id)}
            artistId={selectedArtist && selectedArtist.id ? [selectedArtist.id] : []}
          />
        </div>

        <textarea
          className="w-full h-64 p-4 bg-background-900 border border-background-800 rounded-md font-mono text-xs mb-4 text-background-100 focus:outline-none focus:ring-1 focus:ring-background-700"
          placeholder="Pega aquí el JSON del Prompt Maestro..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpload}
        className="w-full bg-white text-black font-bold py-3 rounded-md hover:bg-gray-200 transition active:scale-[0.98]"
      >
        {isPending ? "Procesando..." : "Subir Tracks al Álbum"}
      </button>
    </div>
  );
}
