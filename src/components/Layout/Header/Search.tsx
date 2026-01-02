"use client";
import { fetchSearchData } from "@/shared/client/adapters/fetchSearchData";
import { useClickAway } from "@/shared/client/hooks/ui/useClickAway";
import { GET_URL } from "@/shared/utils/constants";
import { ImageSizes } from "@/types/apiTypes";
import { APITrack } from "@/types/trackProps";
import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const wrapperRef = useRef<HTMLFormElement>(null);

  const [search, setSearch] = useState(new URLSearchParams(searchParams));
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

  useClickAway(wrapperRef, () => setVisible(false));

  useEffect(() => {
    // Si borra el texto, reseteamos todo
    if (!query.trim()) {
      setResult(null);
      setVisible(false);
      return;
    }

    // Esperamos 300ms antes de llamar a la base de datos
    const timer = setTimeout(async () => {
      const params = new URLSearchParams();
      params.set("q", query);

      const data = await fetchSearchData(params);
      setResult(data);
      // SOLO MOSTRAR si el usuario sigue enfocado en el input
      const isFocused = document.activeElement === wrapperRef.current?.querySelector("input");
      if (isFocused && data && data?.length > 0) {
        setVisible(true);
      }
    }, 300);

    return () => clearTimeout(timer); // Limpieza del timer
  }, [query]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setVisible(false);
    redirect(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <form className="relative" ref={wrapperRef}>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search"></InputIcon>
        <InputText
          placeholder="Search"
          className={`!rounded-full !h-10 !shadow-md !border-background-800/65 w-[400px] transition-[width] duration-300  focus-visible:!border-accent-900/60 !bg-background-900 `}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") onSearchSubmit(e);
          }}
          onClick={() => {
            if (result && result.length > 0) setVisible(true);
          }}
          defaultValue={query}
        ></InputText>
      </IconField>
      <Dialog
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        modal={false}
        dismissableMask
        closeOnEscape={false}
        showHeader={false}
        pt={{
          mask: {
            className: "!animate-none !transition-none",
          },
          content: {
            className: "!animate-none !transition-none",
          },
        }}
        position="top-right"
        className={`!transition-none !animate-none absolute w-[400px] top-14 right-4 overflow-hidden rounded-xl mt-2 border-[1px] border-background-700/50  [&>.p-dialog-content]:!p-0 ${
          visible ? "" : "hidden"
        }`}
      >
        <section className=" bg-background-900 overflow-y-scroll max-h-[60vh]">
          {query !== "" && result && result.length > 0 && (
            <ul className="p-4 flex flex-col gap-6">
              {result.map((res) => (
                <li key={res.id} className="flex gap-5">
                  <Link href={`/${res.type}s/${res.id}`}>
                    <Image
                      src={res.image.sm}
                      alt={res.name}
                      height={48}
                      width={48}
                      unoptimized
                      className={`w-12 h-12 ${
                        res.type === "artist" ? "rounded-full" : "rounded-md"
                      }`}
                    />
                  </Link>
                  <span className="w-2/3 flex flex-col">
                    <Link
                      href={`/${res.type}s/${res.id}`}
                      className="line-clamp-1 text-base font-semibold overflow-hidden overflow-ellipsis"
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
          )}
          {(search.toString() !== "" && !result) ||
            (result?.length === 0 && (
              <span className="w-full flex flex-col p-20 gap-4 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M8.5 9.56v6.067a3.5 3.5 0 1 0 1.496 2.702L10 18.25v-7.19l3.552 3.553a3.5 3.5 0 0 0 4.835 4.835l2.332 2.332a.75.75 0 0 0 1.061-1.06L3.28 2.22a.75.75 0 1 0-1.06 1.06zm8.78 8.782a2 2 0 0 1-2.623-2.623zM6.5 16.5a2 2 0 1 1 0 4a2 2 0 0 1 0-4m10-3.5q-.155 0-.305.013l3.792 3.792a4 4 0 0 0 .009-.476L20 16.25V2.75a.75.75 0 0 0-.965-.718l-10 3a.75.75 0 0 0-.45.371L10 6.818v-.51l8.5-2.55v2.434l-7.02 2.106l1.204 1.205L18.5 7.758v5.87a3.5 3.5 0 0 0-2-.628"
                  ></path>
                </svg>
                <span>No hay resultados</span>
              </span>
            ))}
        </section>
      </Dialog>
    </form>
  );
}
