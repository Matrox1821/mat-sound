"use client";
import { PlaylistImage } from "@components/ui/images/PlaylistImage";
import { DropdownMenu } from "../menus/DropdownMenu";
import { SaveInPlaylist } from "@components/ui/buttons/SaveInPlaylist";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { usePlaylistStore } from "@/store/playlistStore";
import { playerTrackProps } from "@shared-types/track.types";
import { useAppUIStore } from "@/store/appUIStore";

export function PlaylistSelector({ track }: { track: playerTrackProps }) {
  const { openPlaylistDialog } = useAppUIStore((state) => state);
  const session = authClient.useSession();
  const { error } = useToast();
  const { playlists: playlistMap } = usePlaylistStore((s) => s);
  const getImages = usePlaylistStore((state) => state.getPlaylistDisplayImages);
  const playlists = [...playlistMap.values()];

  return (
    <DropdownMenu
      options={[
        ...(playlists && playlists.length > 0
          ? playlists.map(({ id, name }) => ({
              render: () => (
                <div className="w-full p-2 flex items-center justify-between gap-3 hover:bg-background-950 rounded-md transition-colors group/item">
                  <div className="flex items-center gap-3">
                    <PlaylistImage trackImages={getImages(id)} size={40} className="!w-10 !h-10" />
                    <span className="text-md font-semibold truncate max-w-[100px] overflow-ellipsis text-nowrap">
                      {name}
                    </span>
                  </div>
                  <SaveInPlaylist
                    playlistName={name}
                    playlistId={id}
                    track={{ id: track.id, cover: track.cover }}
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
          className: "justify-center border shadow-md border-background-800 mt-1 cursor-pointer",
          onClick: () => {
            if (!session.data?.user) {
              error("No tienes una sesión iniciada.");
            } else {
              openPlaylistDialog(track.id);
            }
          },
          closeOnClick: true,
        },
      ]}
      iconClassName="pi-plus"
    />
  );
}
