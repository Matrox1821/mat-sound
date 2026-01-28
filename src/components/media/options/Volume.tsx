"use client";
import { usePlaybackStore } from "@/store/playbackStore";
import { RefObject, useCallback } from "react";
import {
  Slider as SliderRoute,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@radix-ui/react-slider";

export const Volume = ({ audioRef }: { audioRef: RefObject<HTMLAudioElement> }) => {
  const { volume, setVolume } = usePlaybackStore((state) => state);

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      const [newCurrentVolume] = value;
      if (audioRef?.current) {
        audioRef.current.volume = newCurrentVolume;
        setVolume(newCurrentVolume);
      }
    },
    [audioRef, setVolume],
  );

  return (
    <div className="flex items-center gap-2 relative justify-center group">
      <div className="left-0 w-8 h-20 absolute -translate-y-3/4 bg-background-800 border-[1px] border-background-300 -right-2  items-center justify-center rounded-md hidden group-hover:!flex">
        <div className="relative flex h-20 touch-none w-8 select-none items-center slider-container py-2 justify-center">
          <SliderRoute
            className="relative flex w-[3px] h-full touch-none select-none items-center slider-route justify-center"
            value={[volume]}
            max={1}
            min={0}
            step={0.05}
            orientation="vertical"
            onValueChange={handleVolumeChange}
          >
            <SliderTrack className="slider-track relative w-[3px] h-full grow rounded-full bg-background-500">
              <SliderRange className="absolute w-full rounded-full bg-background-50" />
            </SliderTrack>
            <SliderThumb
              className="volume opacity-100 flex h-1 w-[15px] rounded-full bg-background-50 shadow-[0_0_2px_1px_rgb(0_0_0/0.45)] hover:scale-110 focus:border-0 "
              aria-label="Song progress"
            />
          </SliderRoute>
        </div>
      </div>

      <span className="w-8 h-8 flex items-center justify-center">
        <i
          className={`relative  cursor-pointer !text-xl ${
            volume === 0
              ? "pi pi-volume-off"
              : volume <= 0.4
                ? "pi pi-volume-down"
                : "pi pi-volume-up"
          }`}
        />
      </span>
      {/* <button
        className="relative flex items-center cursor-pointer"
        onClick={() => setIsVisible(!isVisible)}
      >
      </button> */}
    </div>
  );
};
