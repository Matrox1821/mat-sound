"use client";
import { PlaylistService } from "@/types/playlist.types";
import { Play } from "./Play";
import { EditPlaylist } from "@/components/features/dialogs/Edit";
import { EditPlaylistForm } from "@/components/features/forms/playlistForm/editPlaylist";
import { Send } from "@/components/features/dialogs/Send";
import { GET_URL } from "@/shared/utils/constants";
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
      />
      <Send
        link={`${GET_URL}playlists/${playlist.id}`}
        title={`Escucha la playlist ${playlist.name}!`}
      />
    </div>
  );
}
