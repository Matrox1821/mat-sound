"use client";
import { SafeImage } from "@components/ui/images/SafeImage";
import { MediaCard } from "@/types/content.types";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { searchAction } from "@/actions/search";
import { ProgressSpinner } from "primereact/progressspinner";
import { PlaylistImage } from "@/components/ui/images/PlaylistImage";

export function Search() {
  const searchParams = useSearchParams();

  const [result, setResult] = useState<MediaCard[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 150);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsLoading(true);
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    redirect(`/search?q=${encodeURIComponent(query)}`);
  };

  const closeDropdown = () => setIsFocused(false);

  useEffect(() => {
    let isMounted = true;

    if (!query.trim()) {
      setResult(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await searchAction(query);
        if (isMounted) {
          setResult(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error en búsqueda:", error);
        if (isMounted) setIsLoading(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <form className="!relative" onSubmit={onSearchSubmit}>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          placeholder="Search"
          className="!rounded-full !h-10 !shadow-md !border-background-800/65 w-[400px] transition-[width] duration-300 focus-visible:!border-accent-900/60 !bg-background-900"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") onSearchSubmit(e);
          }}
        />
      </IconField>

      {isFocused && query.trim() && (
        <div className="absolute top-full left-0 mt-2 w-[400px] overflow-hidden rounded-xl border border-background-700/50 bg-background-900 z-50 shadow-lg">
          {isLoading ? (
            <div className="flex w-full items-center justify-center py-2">
              <ProgressSpinner className="h-10! [&>svg>circle]:stroke-accent-700!" />
            </div>
          ) : result && result.length > 0 ? (
            <SearchResults results={result} onClose={closeDropdown} />
          ) : (
            <p className="p-4 text-sm text-background-300">
              No se encontraron resultados para{" "}
              <span className="font-semibold text-content-900">{query}</span>
            </p>
          )}
        </div>
      )}
    </form>
  );
}

function SearchResults({ results, onClose }: { results: MediaCard[]; onClose: () => void }) {
  return (
    <section className="overflow-y-scroll max-h-[60vh]">
      <ul className="p-4 flex flex-col gap-6">
        {results.map((res) => (
          <SearchResultItem key={res.id} res={res} onClose={onClose} />
        ))}
      </ul>
    </section>
  );
}

function SearchResultItem({ res, onClose }: { res: MediaCard; onClose: () => void }) {
  return (
    <li className="flex gap-5">
      <Link href={`/${res.type}/${res.id}`} onClick={onClose} className="relative shrink-0">
        {res.type === "playlists" ? (
          <PlaylistImage
            image={res.image?.sm}
            trackImages={res.images}
            quality={75}
            className="!w-12 !h-12"
          />
        ) : (
          <SafeImage
            src={res.image?.sm}
            alt={res.title}
            height={48}
            width={48}
            unoptimized
            className={`!w-12 !h-12 ${res.type === "artists" ? "!rounded-full" : "!rounded-md"}`}
          />
        )}
      </Link>

      <span className="w-2/3 flex flex-col">
        <Link
          href={`/${res.type}/${res.id}`}
          className="line-clamp-1 text-base font-semibold overflow-hidden overflow-ellipsis"
          onClick={onClose}
        >
          {res.title}
        </Link>

        {res.type === "playlists" && (
          <span className="text-sm text-background-300 font-semibold">
            <Link href={`/user/${res.user.username}`} className="hover:underline" onClick={onClose}>
              {res.user.name}
            </Link>
          </span>
        )}

        {(res.type === "tracks" || res.type === "albums") && res.artists && (
          <span className="flex gap-1 text-sm text-background-300 font-semibold">
            {res.type === "tracks" ? "Canción •" : "Álbum •"}
            <span className="flex gap-1">
              {res.artists.map((artist, i) => (
                <div key={res.id + artist.id}>
                  <Link
                    href={`/artists/${artist.id}`}
                    className="hover:underline"
                    onClick={onClose}
                  >
                    {artist.name}
                  </Link>
                  {i < res.artists!.length - 1 && ","}
                </div>
              ))}
            </span>
          </span>
        )}
      </span>
    </li>
  );
}
