"use client";

import { use } from "react";
import { Artist, MusicNote, Tag, Vinyl } from "./HomeIcons";

const texts = {
  tracks: "Total de Canciones",
  albums: "Álbumes Registrados",
  artists: "Artistas Totales",
  genres: "Géneros de Música",
};

export function DataCounter({
  data,
}: {
  data: Promise<{ tracks: number; albums: number; artists: number; genres: number }>;
}) {
  const counters = use(data);

  return (
    <section className="w-full h-2/10 flex gap-8">
      {Object.entries(counters).map(([key, value]) => (
        <div
          className="w-full bg-background-900 rounded-lg border border-contrast-900/80 py-4 px-5 flex gap-2"
          key={key}
        >
          <div className="h-full aspect-square bg-contrast-900/30 rounded-md flex justify-center items-center">
            {key === "tracks" && <MusicNote className="w-3/5 h-3/5 text-accent-950" />}
            {key === "albums" && <Vinyl className="w-3/5 h-3/5 text-accent-950" />}
            {key === "artists" && <Artist className="w-3/5 h-3/5 text-accent-950" />}
            {key === "genres" && <Tag className="w-3/5 h-3/5 text-accent-950 -rotate-90" />}
          </div>
          <div className="flex flex-col justify-between p-1">
            <span className="text-lg">{texts[key as keyof typeof texts]}</span>
            <span className="text-4xl font-semibold">{value}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
