"use client";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { useEffect, useState } from "react";

interface Element {
  avatar?: { sm: string; md: string; lg: string };
  cover?: { sm: string; md: string; lg: string };
  name: string;
  id: string;
  [key: string]: any;
}

export function SelectInput({
  name,
  data,
  zIndex = 30,
  title,
  options: { isRequired, isMultiple, sendName },
  callback,
  initialElements,
}: {
  name: string;
  data: Element[];
  zIndex?: number;
  title: string;
  options: { isRequired?: boolean; isMultiple?: boolean; sendName?: boolean };
  initialElements?: Element[];
  callback?: (value: string[], elements: Element[]) => void;
}) {
  const [elements, setElements] = useState<Element[]>(initialElements || []);
  const [value, setValue] = useState<string[]>(initialElements?.map((e) => e.id) || []);
  const [valueWithName, setValueWithName] = useState(
    initialElements?.map((e) => ({ id: e.id, name: e.name })) || [],
  );

  useEffect(() => {
    if (initialElements && initialElements.length > 0) {
      setElements(initialElements);
      setValue(initialElements.map((e) => e.id));
      setValueWithName(initialElements.map((e) => ({ id: e.id, name: e.name })));
    }
  }, [initialElements]);

  useEffect(() => {
    if (callback) callback(value, elements);
  }, [value, elements]); // Eliminado callback de dependencias para evitar loops si el padre no usa useCallback

  const toggleElement = (item: Element) => {
    const isSelected = elements.find((e) => e.id === item.id);

    if (isSelected) {
      // Remover
      const newElements = elements.filter((e) => e.id !== item.id);
      setElements(newElements);
      setValue(newElements.map((e) => e.id));
      setValueWithName(newElements.map((e) => ({ id: e.id, name: e.name })));
    } else {
      // Agregar
      if (isMultiple) {
        setElements((prev) => [...prev, item]);
        setValue((prev) => [...prev, item.id]);
        setValueWithName((prev) => [...prev, { id: item.id, name: item.name }]);
      } else {
        setElements([item]);
        setValue([item.id]);
        setValueWithName([{ id: item.id, name: item.name }]);
      }
    }
  };

  return (
    <div style={{ zIndex }} className="flex flex-col gap-4 w-full">
      {/* Título y Badges de Resumen */}
      <div className="flex gap-2 items-center justify-between">
        <h2
          className={`text-sm font-bold tracking-wider uppercase ${!data?.length ? "text-background-200" : "text-background-100"}`}
        >
          {title} {isRequired && <span className="text-red-400">*</span>}
        </h2>

        {/* Chips/Badges de elementos seleccionados */}
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {elements.map((el) => (
            <div
              key={el.id}
              className="flex items-center gap-2 bg-accent-900/20 border border-accent-900/50 text-white px-2 py-1 rounded-md text-xs"
            >
              <span>{el.name}</span>
              <button
                type="button"
                onClick={() => toggleElement(el)}
                className="hover:text-white text-accent-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Input oculto para FormData */}
      <input
        value={JSON.stringify(sendName ? valueWithName : value) || "none"}
        name={name}
        className="hidden"
        readOnly
      />

      {/* El Grid con Scroll */}
      <div
        className={`bg-background-950 border border-background-50/80 rounded-lg p-3 ${!data || data.length === 0 ? "!h-12 !border-background-100/30" : ""}`}
      >
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar ${!data || data.length === 0 ? "!p-0" : ""}`}
        >
          {data && data.length > 0 ? (
            data.map((item) => {
              const isSelected = elements.some((e) => String(e.id) === String(item.id));
              const source = item.avatar || item.cover;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleElement(item)}
                  className={`flex items-center gap-3 p-2 rounded-md border transition-all text-left
                    ${
                      isSelected
                        ? "bg-accent-900/40 border-accent-800"
                        : "bg-background-900 border-background-800 hover:border-background-400"
                    }`}
                >
                  <SafeImage
                    width={40}
                    height={40}
                    src={source && source.sm}
                    alt={item.name}
                    className="!w-10 !h-10 !rounded !shadow-sm !object-cover !flex-shrink-0"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className={`text-sm font-medium truncate ${isSelected ? "text-white" : "text-background-50"}`}
                    >
                      {item.name}
                    </span>
                    {item.artist?.name && (
                      <span className="text-[10px] text-background-50 truncate italic">
                        {item.artist.name}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center text-background-200/70 text-sm italic">
              Sin elementos disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
