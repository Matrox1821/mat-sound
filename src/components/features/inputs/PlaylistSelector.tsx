"use client";
import { playerTrackProps } from "@/types/trackProps";
import { PlaylistImage } from "../../ui/images/PlaylistImage";
import { DropdownMenu } from "../menus/DropdownMenu";
import { SaveInPlaylist } from "../../ui/buttons/SaveInPlaylist";
import { useCreatePlaylistDialogStore } from "@/store/createPlaylistDialogStore";

export default function PlaylistSelector({ track }: { track: playerTrackProps }) {
  const { toggle, setTrackId } = useCreatePlaylistDialogStore((state) => state);

  return (
    <DropdownMenu
      options={[
        ...(track.playlists && track.playlists.length > 0
          ? track.playlists.map((playlist) => ({
              render: () => (
                <div className="w-full p-2 flex items-center justify-between gap-3 hover:bg-background-950 rounded-md transition-colors group/item">
                  <div className="flex items-center gap-3">
                    <PlaylistImage
                      trackImages={playlist.tracks.map(({ track }) => ({
                        ...track,
                      }))}
                      sizeImage={40}
                    />
                    <span className="text-md font-semibold truncate max-w-[100px] overflow-ellipsis text-nowrap">
                      {playlist.name}
                    </span>
                  </div>
                  <SaveInPlaylist
                    playlistName={playlist.name}
                    playlistId={playlist.id}
                    trackId={track.id}
                    initialIsSaved={playlist.isInPlaylist}
                  />
                </div>
              ),
            }))
          : [
              {
                label: "No tienes playlists",
                className: "text-content-500 italic",
                as: "div" as const,
              },
            ]),
        {
          label: "Nueva playlist",
          image: <i className="pi pi-plus" />,
          as: "button",
          className: "justify-center border shadow-md border-background-800 mt-1",
          onClick: () => {
            setTrackId(track.id);
            toggle();
          },
        },
      ]}
      iconClassName="pi-plus"
    />
  );
}
