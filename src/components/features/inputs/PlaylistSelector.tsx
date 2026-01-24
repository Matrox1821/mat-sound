"use client";
import { PlaylistImage } from "../../ui/images/PlaylistImage";
import { DropdownMenu } from "../menus/DropdownMenu";
import { SaveInPlaylist } from "../../ui/buttons/SaveInPlaylist";
import { useCreatePlaylistDialogStore } from "@/store/createPlaylistDialogStore";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { usePlaylistStore } from "@/store/playlistStore";
import { playerTrackProps } from "@/types/track.types";

export default function PlaylistSelector({ track }: { track: playerTrackProps }) {
  const { toggle, setTrackId } = useCreatePlaylistDialogStore((state) => state);
  const session = authClient.useSession();
  const { error } = useToast();
  const playlists = usePlaylistStore((state) => state.playlists);
  const getImages = usePlaylistStore((state) => state.getPlaylistDisplayImages);
  return (
    <DropdownMenu
      options={[
        ...(playlists && [...playlists].length > 0
          ? [...playlists].map(([id, data]) => ({
              render: () => (
                <div className="w-full p-2 flex items-center justify-between gap-3 hover:bg-background-950 rounded-md transition-colors group/item">
                  <div className="flex items-center gap-3">
                    <PlaylistImage
                      trackImages={getImages(id)}
                      sizeImage={40}
                      imageClassName="!w-10 !h-10"
                    />
                    <span className="text-md font-semibold truncate max-w-[100px] overflow-ellipsis text-nowrap">
                      {data.name}
                    </span>
                  </div>
                  <SaveInPlaylist
                    playlistName={data.name}
                    playlistId={data.id}
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
          className: "justify-center border shadow-md border-background-800 mt-1",
          onClick: () => {
            if (!session.data?.user) {
              error("No tienes una sesión iniciada.");
            } else {
              setTrackId(track.id);
              toggle();
            }
          },
        },
      ]}
      iconClassName="pi-plus"
    />
  );
}
