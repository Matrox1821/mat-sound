"use client";
import { createArtistsBulkServer } from "@/actions/artist";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { artistBulkSchema } from "@/shared/utils/schemas/bulkValidations";
import { useState } from "react";
import z from "zod";

export function BulkArtistUpload() {
  const [jsonInput, setJsonInput] = useState("");
  const { success, error, warning } = useToast();

  const handleUpload = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);

      const validation = z.array(artistBulkSchema).safeParse(parsedData);

      if (!validation.success) {
        const firstError = validation.error.issues[0];
        warning(`Error en el formato: ${firstError.path.join(".")} - ${firstError.message}`);
        return;
      }

      const response = await createArtistsBulkServer(parsedData);

      if (response) {
        success("¡Carga exitosa!");
        setJsonInput("");
      } else {
        error("Error en el servidor al procesar la carga.");
      }
    } catch {
      warning("JSON mal formado. Asegúrate de que sea un array válido.");
    }
  };

  return (
    <div className="p-6 bg-background-950 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-white">Carga Masiva de Artistas</h2>
        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
          Formato: Artist[]
        </span>
      </div>

      <textarea
        className="w-full h-64 p-4 bg-background-900 border border-background-800 rounded-md font-mono text-sm mb-4 text-background-100 focus:outline-none focus:ring-2 focus:ring-background-700 transition"
        placeholder={`[
  {
    "name": "Artista",
    "description": "...",
    "listeners": 1234,
    "genres": ["Pop"]
  }
]`}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      <button
        onClick={handleUpload}
        className="bg-background-800/70 cursor-pointer text-white px-6 py-2 rounded-md hover:bg-background-700 transition border border-background-700 active:scale-95"
      >
        Procesar Artistas
      </button>
    </div>
  );
}
