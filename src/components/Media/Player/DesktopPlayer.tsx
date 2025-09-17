"use client";
import { contentProps } from "@/types";
import Image from "next/image";
import Slider from "../Slider";
import { RefObject, useRef } from "react";
import PlayerController from "../PlayerController";
import { usePlayerStore } from "@/store/playerStore";
import { useAudioController } from "@/hooks/player/useAudioController";
export default function DesktopPlayer() {
  const { currentTrack: track } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  useAudioController(audioRef);
  return (
    <>
      <audio ref={audioRef} preload="auto" />
      <footer
        className="flex absolute justify-between z-30 -bottom-24 left-0 items-center w-full h-24 bg-background-900 text p-2 px-4 transition-transform duration-200 border-t-2 border-background-950"
        style={{ transform: track ? "translateY(-96px)" : "" }}
      >
        {track && <CurrentMusicWidget track={track} />}
        {track && <CurrentMusicPlayer audioRef={audioRef as RefObject<HTMLAudioElement>} />}
        <span>X</span>
      </footer>
    </>
  );
}

const CurrentMusicWidget = ({ track }: { track: contentProps }) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={typeof track.image === "string" ? track.image : track.image[0]}
        alt={track.name}
        width={64}
        height={64}
        className="rounded-md"
      />
      <div className="flex flex-col">
        <h3 className="text-sm font-bold">{track.name}</h3>
        <p className="text-xs text-background-500 ">{track.name}</p>
      </div>
    </div>
  );
};

const CurrentMusicPlayer = ({ audioRef }: { audioRef: RefObject<HTMLAudioElement> }) => {
  return (
    <div className="flex flex-col gap-2 min-w-[300px] max-w-[600px] h-full items-center justify-center">
      <PlayerController audioRef={audioRef} />
      <Slider audioRef={audioRef} />
    </div>
  );
};
