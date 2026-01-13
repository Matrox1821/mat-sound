"use client";
import Image from "next/image";
import Link from "next/link";
import { Pause } from "@/components/UI/Icons/Playback/Pause";
import { Play } from "@/components/UI/Icons/Playback/Play";
import { formatTime } from "@/shared/utils/helpers";
import { useUIStore } from "@/store/activeStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";
import { playerTrackProps } from "@/types/trackProps";
import { LikeButton } from "../Buttons/Like";
import { Options } from "../Buttons/Options";
import { Bookmark } from "../Icons/Bookmark";
import { SaveInPlaylist } from "../Buttons/SaveInPlaylist";

interface TrackTableProps {
  tracks: playerTrackProps[];
  upcomingTracks?: playerTrackProps[];
  showCover?: boolean;
  playingFromLabel: string;
}

export default function TrackTable({
  tracks,
  upcomingTracks,
  showCover,
  playingFromLabel,
}: TrackTableProps) {
  const { setTrack, setUpcoming, currentTrack, setPlayingFrom } = usePlayerStore();
  const { isPlaying, play, pause } = usePlaybackStore();
  const { playerBarIsActive, activePlayerBar } = useUIStore();

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
      if (upcomingTracks) {
        setTrack(track, []);
        setUpcoming(upcomingTracks);
      } else {
        setTrack(track, tracks);
      }

      setPlayingFrom(playingFromLabel);
      play();
    }
  };

  return (
    <table className="w-full border-separate border-spacing-y-1">
      <thead>
        <tr className="uppercase h-12 text-background-400 text-xs font-semibold">
          <th className="w-12 text-center">#</th>
          {showCover && <th className="w-12"></th>}
          <th className="text-start pl-4">Título</th>
          <th className="text-start">Artista</th>
          <th className="w-24 text-start">Dur.</th>
          <th className="w-10"></th>
          <th className="w-20"></th>
        </tr>
      </thead>
      <tbody>
        {tracks &&
          tracks.map((track, i) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <tr
                key={track.id}
                className="h-12 hover:bg-background-950/90 transition-colors group"
              >
                <td className="text-center rounded-l-xl relative">
                  <button
                    onClick={(e) => handlePlay(e, track)}
                    className="cursor-pointer w-full h-full flex items-center justify-center"
                  >
                    {isCurrent ? (
                      <div className="text-accent-900  flex items-center">
                        {isPlaying ? (
                          <Pause className="w-4 h-4 hidden group-hover:block " />
                        ) : (
                          <Play className="w-4 h-4 hidden group-hover:block" />
                        )}
                        <span className="group-hover:!hidden pi pi-volume-up" />
                      </div>
                    ) : (
                      <div className="hover">
                        <span className="group-hover:hidden text-background-400">{i + 1}</span>
                        <Play className="hidden group-hover:block w-4 h-4 mx-auto" />
                      </div>
                    )}
                  </button>
                </td>

                {showCover && (
                  <td className="w-12">
                    <Image
                      src={track.cover.sm}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </td>
                )}

                <td
                  className={`pl-4 text-sm font-semibold ${
                    isCurrent ? "text-accent-900" : "text-white"
                  }`}
                >
                  {track.name}
                </td>

                <td className="text-sm font-semibold text-background-300">
                  {track.artists?.map((artist, idx) => (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.id}`}
                      className="hover:underline"
                    >
                      {artist.name}
                      {track.artists && idx < track.artists.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </td>

                <td className="text-sm text-background-400">{formatTime(track.duration)}</td>

                <td className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Options
                    options={[
                      {
                        label: "Nueva playlist",
                        buttonClassName: "flex items-center justify-center gap-3",
                      },
                    ]}
                  />
                  {/* <button className="pi pi-ellipsis-h cursor-pointer hover:text-white pt-[6px]" /> */}
                </td>

                <td className="rounded-r-xl">
                  <div className="flex items-center gap-4">
                    <LikeButton
                      trackId={track.id}
                      initialIsLiked={track.isLiked ?? false}
                      initialCount={track?.likes ?? 0}
                    />
                    <Options
                      options={[
                        ...(track.playlists && track.playlists.length > 0
                          ? track.playlists.map((playlist) => ({
                              label: playlist.name,
                              imagePosition: "left" as const,
                              buttonClassName: "flex items-center justify-between gap-3 px-3",

                              image: (
                                <PlaylistImage
                                  trackImages={playlist.tracks.map(({ track }) => ({ ...track }))}
                                />
                              ),
                              select: (
                                <SaveInPlaylist
                                  playlistName={playlist.name}
                                  playlistId={playlist.id}
                                  trackId={track.id}
                                  initialIsSaved={playlist.isInPlaylist}
                                />
                              ),
                            }))
                          : [{ label: "No tienes playlists" }]),
                        {
                          label: "Nueva playlist",
                          icon: <i className="pi pi-plus"></i>,
                          buttonClassName: "flex items-center justify-center gap-3",
                          iconPosition: "left",
                          trackId: track.id,
                        },
                      ]}
                      iconClassName="pi-plus"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
const PlaylistImage = ({
  trackImages,
}: {
  trackImages: { id: string; cover: { sm: string; md: string; lg: string } }[];
}) => {
  if (trackImages.length === 0) return;
  if (trackImages.length === 1)
    return (
      <Image src={trackImages[0].cover.sm} alt="" width={40} height={40} className="h-10 w-10" />
    );

  return (
    <figure className="h-10 w-10 rounded-md bg-background grid grid-cols-2 grid-row-2 ">
      {trackImages.map((image) =>
        image ? <Image src={image.cover.sm} alt="" key={image.id} height={20} width={20} /> : null
      )}
    </figure>
  );
};
