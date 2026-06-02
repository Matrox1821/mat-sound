"use client";

import { use } from "react";

type Genre = {
  id: string;
  name: string;
  tracks: number;
  percentage: number;
};

const COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];

export function GenreDistributionCard({ data: promiseData }: { data: Promise<Genre[]> }) {
  const data = use(promiseData);

  return (
    <div className="bg-background-900 rounded-xl p-6 flex-1 flex flex-col min-h-0">
      <h3 className="text-lg font-semibold text-content-900/90 mb-4 flex-shrink-0">Géneros</h3>

      <ul className="flex flex-col gap-3 overflow-hidden flex-1">
        {data.map((genre, i) => (
          <li key={genre.id} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${COLORS[i % COLORS.length]}`} />
              <span className="text-sm text-content-900/80 flex-1 truncate">{genre.name}</span>
              <span className="text-xs text-content-900/40 flex-shrink-0">
                {genre.tracks} tracks
              </span>
            </div>
            <div className="ml-4 h-1 bg-background-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${COLORS[i % COLORS.length]}`}
                style={{ width: `${genre.percentage}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
