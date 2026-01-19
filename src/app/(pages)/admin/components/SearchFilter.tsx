"use client";

import { useDebounce } from "@/shared/client/hooks/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchFilterProps {
  queryName: string; // Ejemplo: "query", "name", "genre", "city"
  placeholder?: string;
  className?: string;
}

export function SearchFilter({
  queryName,
  placeholder = "Buscar...",
  className = "max-w-md",
}: SearchFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Inicializamos con el valor actual de ese parámetro específico en la URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get(queryName) || "");

  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentParamValue = searchParams.get(queryName) || "";

    if (debouncedSearch !== currentParamValue) {
      // Al filtrar, casi siempre queremos volver a la página 1
      params.set("page", "1");

      if (debouncedSearch) {
        params.set(queryName, debouncedSearch);
      } else {
        params.delete(queryName);
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, queryName, pathname, replace, searchParams]);

  return (
    <div className={`w-full relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-background-950 border border-background-200/50 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-accent-500 transition-colors"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute right-3 top-2.5 text-background-200 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  );
}
