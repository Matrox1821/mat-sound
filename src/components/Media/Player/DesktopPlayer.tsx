"use client";
import Slider from "../slider";
import { RefObject, useRef } from "react";
import PlayerController from "../playerController";
import { usePlayerStore } from "@/store/playerStore";
import { useAudioController } from "@/shared/client/hooks/player/useAudioController";
import Link from "next/link";

import { LikeButton } from "@/components/ui/buttons/Like";
import { Volume } from "../options/Volume";
import { RightMenu } from "../options/RightMenu";
import { ScreenPlaylistMenu } from "../options/ScreenPlaylistMenu";
import PlaylistSelector from "@/components/features/inputs/PlaylistSelector";
import { SafeImage } from "@/components/ui/images/SafeImage";
import { playerTrackProps } from "@/types/track.types";

export default function DesktopPlayer() {
  const { currentTrack: track, playingFrom } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  useAudioController(audioRef);
  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      <footer
        className="flex absolute justify-between z-60 -bottom-24 left-0 items-center w-full h-24 bg-background text p-2 px-4 transition-transform duration-200 border-t-2 border-background-900"
        style={{ transform: track ? "translateY(-96px)" : "" }}
      >
        {track && <CurrentMusicWidget track={track} playingFrom={playingFrom} />}
        {track && <CurrentMusicPlayer audioRef={audioRef as RefObject<HTMLAudioElement>} />}
        {track && <CurrentMusicOptions audioRef={audioRef as RefObject<HTMLAudioElement>} />}
      </footer>
    </>
  );
}

const CurrentMusicWidget = ({
  track,
  playingFrom,
}: {
  track: playerTrackProps;
  playingFrom: string;
}) => {
  return (
    <div className="flex items-center gap-4 w-1/5 h-full py-[6px]">
      <SafeImage
        src={track.cover && track.cover.sm}
        alt={track.name}
        width={64}
        height={64}
        className="!rounded-md !h-full !w-auto"
      />
      <div
        className={`flex flex-col h-full ${
          playingFrom !== "" ? "justify-between" : "justify-center gap-2"
        }`}
      >
        <div className="flex items-center gap-2">
          <Link className="text-sm font-bold hover:underline" href={`/tracks/${track.id}`}>
            {track.name}
          </Link>
          <div className="flex gap-2 items-center">
            <LikeButton trackId={track.id} />
            <PlaylistSelector track={track} />
          </div>
        </div>
        {track.artists &&
          track.artists.map((artist) => (
            <Link
              className="text-sm font-semibold text-background-300 hover:underline"
              key={artist.id}
              href={`/artists/${artist.id}`}
            >
              {artist.name}
            </Link>
          ))}
        {playingFrom && (
          <span className="text-[11px] font-semibold text-background-300 uppercase">
            Reproduciendo desde: {playingFrom}
          </span>
        )}
      </div>
    </div>
  );
};

const CurrentMusicPlayer = ({ audioRef }: { audioRef: RefObject<HTMLAudioElement> }) => {
  return (
    <div className="flex flex-col w-3/5 h-full items-center justify-center">
      <PlayerController />
      <Slider audioRef={audioRef} />
    </div>
  );
};

const CurrentMusicOptions = ({ audioRef }: { audioRef: RefObject<HTMLAudioElement> }) => {
  return (
    <div className="flex gap-4 w-1/5 h-full justify-end relative pr-4">
      <Volume audioRef={audioRef}></Volume>
      <RightMenu />
      <ScreenPlaylistMenu audioRef={audioRef as RefObject<HTMLAudioElement>} />
    </div>
  );
};
