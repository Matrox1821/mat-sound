"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface Element {
  cover?: { sm: string };
  name: string;
  id: string;
  artist?: { name: string };
  [key: string]: any;
}

// Definimos el tipo del objeto de orden para claridad
type TracksOrderMap = { [key: string]: { order: number; disk: number } };

export function OrderAlbumInput({
  name,
  data,
  zIndex = 30,
  title,
  onChange,
  initialValues, // Nueva Prop para los valores por defecto
}: {
  name: string;
  data: Element[];
  zIndex?: number;
  title: string;
  onChange?: (value: TracksOrderMap) => void;
  initialValues?: TracksOrderMap; // { "id": { order: 1, disk: 1 } }
}) {
  // Inicializamos con initialValues si existen, si no, objeto vacío
  const [value, setValue] = useState<TracksOrderMap>(initialValues || {});
  const isFirstRender = useRef(true);

  // Sincronizar el estado interno si los valores iniciales cambian externamente
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setValue(initialValues);
    }
  }, [initialValues]);

  // Notificar al padre solo cuando el valor cambie realmente
  useEffect(() => {
    // Evitamos disparar el onChange en el primer render si no hay cambios
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange?.(value);
  }, [value, onChange]);

  const isDataEmpty = !data || data.length === 0;

  const handleInputChange = (id: string, field: "order" | "disk", val: number) => {
    setValue((prev) => ({
      ...prev,
      [id]: {
        disk: field === "disk" ? val : (prev[id]?.disk ?? 1),
        order: field === "order" ? val : (prev[id]?.order ?? 0),
      },
    }));
  };

  return (
    <div style={{ zIndex }} className="flex flex-col gap-4 w-full">
      <h2
        className={`text-sm font-bold tracking-wider uppercase ${isDataEmpty ? "text-background-100" : "text-background-400"}`}
      >
        {title}
      </h2>

      <input value={JSON.stringify(value)} name={name} className="hidden" readOnly />

      <div className="flex flex-col gap-2">
        {isDataEmpty ? (
          <div className="p-4 border border-dashed border-background-200/50 rounded-md text-background-200/70 text-sm italic text-center">
            No existen elementos elegidos para configurar la posición
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {data.map((item) => (
              <li
                key={item.id}
                className="w-full flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-background-950 border border-background-200/60 rounded-lg gap-4"
              >
                <div className="flex items-center gap-3">
                  {item.cover && item.cover.sm !== "" && (
                    <Image
                      src={item.cover.sm}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded shadow-md object-cover"
                    />
                  )}
                  <div className="flex flex-col max-w-[200px]">
                    <span className="text-sm font-bold text-white truncate">{item.name}</span>
                    {item.artist && (
                      <span className="text-xs text-white truncate italic">{item.artist.name}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-8 bg-background-900 py-2 px-6 rounded-md border border-background-200 w-full md:w-auto justify-around">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-white">Disco:</span>
                    <input
                      type="number"
                      min={1}
                      // Aquí detecta el valor del mapa o usa 1 por defecto
                      value={value[item.id]?.disk ?? 1}
                      className="bg-accent-950/20 border border-accent-950/50 h-8 w-14 rounded text-white font-bold text-center outline-none pr-1"
                      onChange={(e) => handleInputChange(item.id, "disk", Number(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-white">Orden:</span>
                    <input
                      type="number"
                      min={0}
                      // Aquí detecta el valor del mapa o usa 0 por defecto
                      value={value[item.id]?.order ?? 0}
                      className="bg-accent-950/20 border border-accent-950/50 h-8 w-14 rounded text-white font-bold text-center outline-none pr-1"
                      onChange={(e) => handleInputChange(item.id, "order", Number(e.target.value))}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
