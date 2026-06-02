// RecentActivityCard.tsx
"use client";

import { SafeImage } from "@/components/ui/images/SafeImage";
import { ImageSizes } from "@/types/common.types";
import { use } from "react";

type ActivityItem = {
  id: string;
  name: string;
  cover: ImageSizes | null;
  type: "artist" | "album" | "track";
  createdAt: Date;
  extra: string | null;
};

const TYPE_LABEL: Record<ActivityItem["type"], string> = {
  artist: "Artista",
  album: "Álbum",
  track: "Canción",
};

const TYPE_COLOR: Record<ActivityItem["type"], string> = {
  artist: "text-violet-400",
  album: "text-blue-400",
  track: "text-emerald-400",
};

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

function Avatar({ src, name }: { src?: string | null; name: string }) {
  if (src) {
    return (
      <figure className="relative">
        <SafeImage
          src={src}
          alt={name}
          width={36}
          height={36}
          className="w-9 h-9 rounded-md object-cover flex-shrink-0"
        />
      </figure>
    );
  }
  return (
    <div className="w-9 h-9 rounded-md bg-background-800 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-semibold text-content-900/60">
        {name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export function RecentActivityCard({ data: promiseData }: { data: Promise<ActivityItem[]> }) {
  const data = use(promiseData);

  return (
    <div className="bg-background-900 rounded-xl p-6 w-2/5 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-content-900/90 mb-4 flex-shrink-0">
        Actividad Reciente
      </h3>
      <section className=" overflow-y-auto flex-1 pr-2">
        <ul className="flex flex-col gap-3">
          {data.map((item) => (
            <li key={`${item.type}-${item.id}`} className="flex items-center gap-3">
              <Avatar src={item.cover?.sm} name={item.name} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-content-900/90 truncate">{item.name}</p>
                <p className="text-xs text-content-900/50 truncate">{item.extra}</p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-xs font-medium ${TYPE_COLOR[item.type]}`}>
                  {TYPE_LABEL[item.type]}
                </span>
                <span className="text-xs text-content-900/40">{timeAgo(item.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
