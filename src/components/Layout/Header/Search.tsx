"use client";
import { SafeImage } from "@components/ui/images/SafeImage";
import { fetchSearchData } from "@/shared/client/adapters/fetchSearchData";
import { useClickAway } from "@/shared/client/hooks/ui/useClickAway";
import { ImageSizes } from "@shared-types/common.types";
import { APITrack } from "@shared-types/trackProps";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const wrapperRef = useRef<HTMLFormElement>(null);

  const [result, setResult] = useState<
    | {
        id: string;
        name: string;
        image: ImageSizes;
        type?: "track" | "album" | "artist";
        artists?: { id: string; name: string }[];
        tracks?: APITrack[];
      }[]
    | null
  >(null);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);

  useClickAway(wrapperRef, () => {
    setVisible(false);
    setIsFocused(false);
  });

  // Manejar el blur con un pequeño delay para permitir clicks en los links
  const handleBlur = () => {
    setTimeout(() => {
      const isClickInside = wrapperRef.current?.contains(document.activeElement);
      if (!isClickInside) {
        setIsFocused(false);
        setVisible(false);
      }
    }, 150);
  };

  useEffect(() => {
    // Variable para evitar actualizar el estado si el componente se desmonta
    // o si el query cambia antes de que termine el fetch
    let isMounted = true;

    const timer = setTimeout(async () => {
      // Si está vacío, limpiamos inmediatamente
      if (!query.trim()) {
        if (isMounted) {
          setResult(null);
          setVisible(false);
        }
        return;
      }

      const params = new URLSearchParams();
      params.set("q", query);

      try {
        const data = await fetchSearchData(params);

        // Solo actualizamos si esta petición sigue siendo la última (isMounted)
        if (isMounted) {
          setResult(data);

          const inputFocused =
            document.activeElement === wrapperRef.current?.querySelector("input");

          if (inputFocused && data && data.length > 0) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      } catch (error) {
        console.error("Error en búsqueda:", error);
      }
    }, 300);

    return () => {
      isMounted = false; // Marcamos como "cancelado" para el fetch anterior
      clearTimeout(timer);
    };
  }, [query]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setVisible(false);
    redirect(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <form className="!relative" ref={wrapperRef}>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search"></InputIcon>
        <InputText
          placeholder="Search"
          className={`!rounded-full !h-10 !shadow-md !border-background-800/65 w-[400px] transition-[width] duration-300  focus-visible:!border-accent-900/60 !bg-background-900 `}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (result && result.length > 0) {
              setVisible(true);
            }
          }}
          onBlur={handleBlur}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") onSearchSubmit(e);
          }}
          onClick={() => {
            if (result && result.length > 0) setVisible(true);
          }}
          defaultValue={query}
        ></InputText>
      </IconField>
      {visible && isFocused && result && result.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-[400px] overflow-hidden rounded-xl border-[1px] border-background-700/50 bg-background-900 z-50 shadow-lg">
          <section className="overflow-y-scroll max-h-[60vh]">
            <ul className="p-4 flex flex-col gap-6">
              {result.map((res) => (
                <li key={res.id} className="flex gap-5">
                  <Link
                    href={`/${res.type}s/${res.id}`}
                    onClick={() => {
                      setVisible(false);
                      setIsFocused(false);
                    }}
                  >
                    <SafeImage
                      src={res.image && res.image.sm}
                      alt={res.name}
                      height={48}
                      width={48}
                      unoptimized
                      className={`!w-12 !h-12 ${
                        res.type === "artist" ? "!rounded-full" : "!rounded-md"
                      }`}
                    />
                  </Link>
                  <span className="w-2/3 flex flex-col">
                    <Link
                      href={`/${res.type}s/${res.id}`}
                      className="line-clamp-1 text-base font-semibold overflow-hidden overflow-ellipsis"
                      onClick={() => {
                        setVisible(false);
                        setIsFocused(false);
                      }}
                    >
                      {res.name}
                    </Link>
                    {res.artists && (
                      <span className="flex gap-2 text-sm text-background-300 font-semibold">
                        {res.type === "track" ? "Canción •" : "Álbum •"}
                        <span className="flex gap'2">
                          {res.artists.map((artist, i) => (
                            <Link
                              href={`/artists/${artist.id}`}
                              className="hover:underline"
                              key={res.id + artist.id}
                              onClick={() => {
                                setVisible(false);
                                setIsFocused(false);
                              }}
                            >
                              {artist.name}
                              {res.artists!.length - 1 < i && ","}
                            </Link>
                          ))}
                        </span>
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </form>
  );
}
