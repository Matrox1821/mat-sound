"use client";
import { PlaylistImage } from "@/components/ui/images/PlaylistImage";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { PlaylistService } from "@/types/playlist.types";
import Link from "next/link";
import { use } from "react";
import { AsideButtons } from "./buttons/AsideButtons";
import { TrackById } from "@/types/track.types";
import { User } from "@/components/ui/icons/User";

export function Aside({
  playlistPromise,
}: {
  playlistPromise: Promise<{ playlist: PlaylistService; recommendedTracks: TrackById[] | null }>;
}) {
  const playlistResponse = use(playlistPromise);
  const { playlist, recommendedTracks } = playlistResponse;
  return (
    <aside className="w-3/7 h-full relative flex justify-center">
      <div className="w-9/12 relative pt-32 flex flex-col items-center gap-8">
        <figure className="relative w-8/12 h-auto aspect-square">
          <PlaylistImage
            image={playlist.cover && `${playlist.cover.sm}?t=${playlist.updatedAt}`}
            trackImages={playlist.coverListDefault}
            quality={75}
            className="w-full! h-auto! aspect-square!"
          />
        </figure>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold">{playlist.name}</h2>
          <Link
            href={`/user/${playlist.user.username}`}
            className="flex gap-2 hover:underline text-sm items-center relative"
          >
            {playlist.user.avatar ? (
              <SafeImage
                src={playlist.user.avatar}
                alt={`${playlist.user.displayUsername} avatar`}
                height={40}
                width={40}
                className="w-6 h-6 rounded-full "
              />
            ) : (
              <User className="text-background-50 bg-background-700 rounded-full p-1" />
            )}
            {playlist.user.displayUsername}
          </Link>
          <div className="flex gap-1 text-background-200">
            <span>Lista de reproducción</span>•
            <span>
              {new Date(playlist.createdAt).toLocaleDateString("es-AR", { year: "numeric" })}
            </span>
            •<span>{playlist.tracksCount} pistas</span>
          </div>
          <AsideButtons playlist={playlist} upcoming={recommendedTracks} />
        </div>
      </div>
    </aside>
  );
}
