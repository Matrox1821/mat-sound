"use client";

import { use } from "react";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { ImageSizes } from "@/types/common.types";

type TopTrack = {
  id: string;
  name: string;
  cover: ImageSizes | null;
  reproductions: number;
  percentage: number;
  artists: { id: string; name: string }[];
};

export function TopTracksCard({ data: promiseData }: { data: Promise<TopTrack[]> }) {
  const data = use(promiseData);

  return (
    <div className="bg-background-900 rounded-xl p-6 flex-1 flex flex-col min-h-0">
      <h3 className="text-lg font-semibold text-content-900/90 mb-4 flex-shrink-0">
        Top Canciones
      </h3>

      <ul className="flex flex-col gap-3 overflow-hidden flex-1">
        {data.map((track, i) => (
          <li key={track.id} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <span className="text-xs text-content-900/30 w-4 flex-shrink-0">{i + 1}</span>
              {track.cover?.sm ? (
                <figure className="relative flex-shrink-0">
                  <SafeImage
                    src={track.cover.sm}
                    alt={track.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-md object-cover"
                  />
                </figure>
              ) : (
                <div className="w-8 h-8 rounded-md bg-background-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-content-900/60">
                    {track.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-content-900/90 truncate">{track.name}</p>
                <p className="text-xs text-content-900/50 truncate">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
              <span className="text-xs text-content-900/40 flex-shrink-0">
                {track.reproductions.toLocaleString("es-AR")}
              </span>
            </div>
            {/* Barra de progreso */}
            <div className="ml-7 h-1 bg-background-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${track.percentage}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
