"use client";
import { PlaylistService } from "@/types/playlist.types";
import { Play } from "./Play";
import { EditPlaylist } from "@/components/features/dialogs/Edit";
import { EditPlaylistForm } from "@/components/features/forms/playlistForm/editPlaylist";
import { Send } from "@/components/features/dialogs/Send";
import { Save } from "./Save";
import { TrackById } from "@/types/track.types";

export function AsideButtons({
  playlist,
  upcoming,
}: {
  playlist: PlaylistService | null;
  upcoming: TrackById[] | null;
}) {
  if (!playlist) return;
  return (
    <div className="flex gap-4 items-center">
      {playlist.canEdit ? (
        <EditPlaylist>
          <EditPlaylistForm playlist={playlist} />
        </EditPlaylist>
      ) : (
        <Save playlist={playlist} />
      )}
      <Play
        tracksList={playlist.tracks}
        currently={playlist.tracks[0]}
        upcoming={upcoming}
        playlistName={playlist.name}
        playlistId={playlist.id}
      />
      <Send
        link={`playlists/${playlist.id}`}
        title={`Escucha la playlist ${playlist.name}!`}
        className="bg-background-100/20! w-10! h-10! text-white!"
        svgClassName="h-8 pr-0.5 pt-0.5"
      />
    </div>
  );
}
