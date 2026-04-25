"use client";
import { use } from "react";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { Play } from "@/components/ui/icons/playback/Play";
import { formatTime } from "@/shared/utils/helpers";
import { PlaylistService } from "@/types/playlist.types";
import { DropdownMenu } from "@/components/features/menus/DropdownMenu";
import { LikeButton } from "@/components/ui/buttons/LikeButton";
import { PlaylistSelector } from "@/components/features/inputs/PlaylistSelector";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { GET_URL } from "@/shared/utils/constants";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { useAppUIStore } from "@/store/appUIStore";
import { playerTrackProps, TrackById } from "@/types/track.types";
import { Pause } from "@/components/ui/icons/playback/Pause";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import Link from "next/link";

export function Playlist({
  playlistPromise,
}: {
  playlistPromise: Promise<{ playlist: PlaylistService; recommendedTracks: TrackById[] | null }>;
}) {
  const playlistResponse = use(playlistPromise);
  const { playlist, recommendedTracks } = playlistResponse;
  const { setTrack, setUpcoming, getCurrentTrack, setPlayingFrom } = usePlayerStore();
  const { isPlaying, play, pause } = usePlaybackStore();
  const { playerBarIsActive, activePlayerBar } = useAppUIStore();
  const { message } = useToast();
  const currentTrack = getCurrentTrack();

  if (!playlistResponse) return null;

  const { tracks } = playlist;
  const newTracks = tracks.map((track) => parseTrackByPlayer(track));
  const parsedUpcoming = recommendedTracks?.map((track) => parseTrackByPlayer(track));

  const handlePlay = (e: any, track: playerTrackProps) => {
    e.stopPropagation();
    if (!playerBarIsActive) activePlayerBar();

    if (track.id === currentTrack?.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      if (parsedUpcoming) {
        setTrack(track, newTracks);
        setUpcoming(parsedUpcoming);
      } else {
        setTrack(track, newTracks);
      }

      setPlayingFrom({ from: playlist.name, href: `playlists/${playlist.id}` });
      play();
    }
  };
  console.log(playlist);
  return (
    <section className="bg-background">
      {tracks.length > 0 ? (
        <ul className="flex flex-col gap-2 h-screen overflow-auto pr-26 pt-32">
          {tracks.map((track: any) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <li
                key={track.id}
                className="flex gap-2 hover:bg-background-400/20 items-center p-2 rounded-lg group relative justify-between"
              >
                <div className="flex relative gap-2">
                  <figure className="flex relative items-center justify-center h-12! w-12!">
                    <SafeImage
                      src={track.cover.sm}
                      alt=""
                      width={40}
                      height={40}
                      className="h-12! w-12! rounded! absolute! group-hover:brightness-25"
                    />
                    <button
                      onClick={(e) => handlePlay(e, track)}
                      className="cursor-pointer w-full h-full flex items-center justify-center"
                    >
                      {isCurrent ? (
                        <div className="text-accent-900  flex items-center">
                          {isPlaying ? (
                            <Pause className="w-6 h-6 hidden group-hover:block " />
                          ) : (
                            <Play className="w-6 h-6 hidden group-hover:block" />
                          )}
                          <span className="group-hover:!hidden pi pi-volume-up" />
                        </div>
                      ) : (
                        <Play className="opacity-0 group-hover:opacity-100 w-6 h-6 mx-auto absolute" />
                      )}
                    </button>
                  </figure>
                  <div>
                    <h3>{track.name}</h3>
                    {track.artists &&
                      track.artists.length > 0 &&
                      track.artists.map(({ name, id }: any) => (
                        <Link
                          href={`/artists/${id}`}
                          key={id}
                          className="hover:underline text-sm text-content-900/80"
                        >
                          {name}
                        </Link>
                      ))}
                  </div>
                </div>
                <span className="text-background-200/70 group-hover:hidden  absolute right-2">
                  {formatTime(track.duration)}
                </span>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu
                    options={[
                      {
                        label: "Compartir link",
                        image: <i className="pi pi-share-alt" />,
                        iconPosition: "left",
                        onClick: async () => {
                          await navigator.clipboard.writeText(`${GET_URL}tracks/${track.id}`);
                          message("Copiado al portapapeles");
                        },
                        closeOnClick: true,
                      },
                    ]}
                  />
                  <LikeButton track={track} />
                  <PlaylistSelector track={track} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <article className="w-full flex justify-center">
          <span className="bg-amber-600/20 border border-amber-600/50 p-1 rounded-md text-amber-600 ">
            Esta playlist aún no tiene canciones.
          </span>
        </article>
      )}
    </section>
  );
}
