"use client";
import { useState, useEffect, useRef } from "react";
import { artistAdminApi } from "@/queryFn/admin/artistApi";
import { SafeImage } from "@components/ui/images/SafeImage";

export function ArtistSearchInput({
  onSelect,
  placeholder,
}: {
  onSelect: (artist: any) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        const data = await artistAdminApi.getArtists(query);
        setResults(data);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        className="w-full p-3 bg-background-900 border border-background-700 rounded-md text-white focus:ring-1 focus:ring-accent-900 outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setIsOpen(true)}
      />

      {isOpen && results.length > 0 && (
        <ul className="absolute z-[100] w-full mt-1 bg-background-900 border border-background-700 rounded-md shadow-xl max-h-60 overflow-y-auto">
          {results.map((artist) => (
            <li
              key={artist.id}
              className="p-3 hover:bg-background-800 cursor-pointer flex items-center gap-3 border-b border-background-800 last:border-none"
              onClick={() => {
                onSelect(artist);
                setQuery(""); // Limpiar buscador tras seleccionar
                setIsOpen(false);
              }}
            >
              <SafeImage
                src={artist.avatar && artist.avatar.sm}
                className="!w-8 !h-8 !rounded-full !object-cover"
                alt={artist.name}
                width={10}
                height={10}
              />
              <span className="text-white text-sm">{artist.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
