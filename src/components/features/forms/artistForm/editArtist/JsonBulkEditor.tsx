"use client";
import { useState } from "react";

interface JsonBulkEditorProps {
  onConfirm: (data: Record<string, string>) => void;
}

export function JsonBulkEditor({ onConfirm }: JsonBulkEditorProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    try {
      if (!jsonText.trim()) return;

      const parsed = JSON.parse(jsonText);

      if (!Array.isArray(parsed)) {
        setError("El JSON debe ser un array de objetos.");
        return;
      }

      // Aplanamos el array de objetos: [{city: "Madrid"}, {city: "Tokyo"}] -> {city: "Tokyo"}
      // O si vienen pares: [{"Instagram": "url"}, {"Twitter": "url"}]
      const flattened = parsed.reduce((acc, curr) => {
        if (typeof curr === "object" && curr !== null) {
          return { ...acc, ...curr };
        }
        return acc;
      }, {});

      onConfirm(flattened);
      setError(null);
    } catch {
      setError("Formato JSON inválido.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background-950 w-[600px]">
      <h3 className="text-white font-bold">Pegar JSON</h3>
      <textarea
        className="w-full h-92 p-2 bg-background-900 border border-background-700 rounded-md font-mono text-sm text-white focus:outline-none focus:border-accent-700"
        placeholder='[{"Clave": "Valor"}, {"OtraClave": "OtroValor"}]'
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
      <button
        type="button"
        onClick={handleProcess}
        className="bg-accent-700 hover:bg-accent-600 text-white py-2 rounded-md transition"
      >
        Confirmar y Cargar
      </button>
    </div>
  );
}