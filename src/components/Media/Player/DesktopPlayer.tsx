"use client";
import Image from "next/image";
import Slider from "../Slider";
import { RefObject, useRef } from "react";
import PlayerController from "../PlayerController";
import { usePlayerStore } from "@/store/playerStore";
import { useAudioController } from "@/shared/client/hooks/player/useAudioController";
import { playerTrackProps } from "@/types/trackProps";
import Link from "next/link";
import { Volume } from "../Options/Volume";
import { RightMenu } from "../Options/RightMenu";
import { ScreenPlaylistMenu } from "../Options/ScreenPlaylistMenu";

export default function DesktopPlayer() {
  const { currentTrack: track, playingFrom } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  useAudioController(audioRef);
  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      <footer
        className="flex absolute justify-between z-60 -bottom-24 left-0 items-center w-full h-24 bg-background-900 text p-2 px-4 transition-transform duration-200 border-t-2 border-background-950"
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
      <Image
        src={track.cover.sm}
        alt={track.name}
        width={64}
        height={64}
        className="rounded-md h-full w-auto"
      />
      <div
        className={`flex flex-col h-full ${
          playingFrom !== "" ? "justify-between" : "justify-center gap-2"
        }`}
      >
        <Link className="text-sm font-bold hover:underline" href={`/tracks/${track.id}`}>
          {track.name}
        </Link>
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
      <PlayerController audioRef={audioRef} />
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
