"use client";
import { useProgress } from "@/hooks/player/useProgress";
import { formatTime } from "@/shared/helpers";
import {
  Slider as SliderRoute,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@radix-ui/react-slider";
import { RefObject, useRef, useState, useMemo, useCallback, useEffect } from "react";

const Slider = ({ audioRef }: { audioRef: RefObject<HTMLAudioElement> }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const hoverTimeRef = useRef<HTMLTimeElement>(null);
  const { currentTime, duration, setIsDragging, setCurrentTime } = useProgress(audioRef);
  const [hoverTime, setHoverTime] = useState("0:00");
  const [hoverPosition, setHoverPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleValueChange = useCallback(
    (value: number[]) => {
      const [newCurrentTime] = value;
      if (audioRef?.current) {
        audioRef.current.currentTime = newCurrentTime;
        setCurrentTime(newCurrentTime);
      }
    },
    [audioRef]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const hover = x < 0 ? 0 : x > rect.left ? rect.left : x;
      const percentage = (hover / rect.width) * 100;
      const parcedPercentage = percentage < 0 ? 0 : percentage;
      const time = (duration * parcedPercentage) / 100;
      const hoverTimeRefSize = 36 / 2; //.hover-time element width
      setHoverPosition(
        hover < hoverTimeRefSize
          ? hoverTimeRefSize
          : hover > rect.left - hoverTimeRefSize
          ? rect.left - hoverTimeRefSize
          : hover
      );
      setIsVisible(time >= 0 && time <= duration);
      setHoverTime(formatTime(time));
    },

    [duration]
  );

  const formattedCurrentTime = formatTime(currentTime || 0);
  const formattedDuration = formatTime(duration || 0);

  return (
    <div className="flex items-center gap-2 min-w-[300px] max-w-[600px]">
      <time className="text-[12px] w-9 flex justify-center items-center">
        {formattedCurrentTime}
      </time>
      <div
        ref={sliderRef}
        className="relative flex h-8 touch-none min-w-[250px] max-w-[600px] select-none items-center slider-container"
        onPointerMove={handlePointerMove}
      >
        <SliderRoute
          className="relative flex h-8 touch-none w-full select-none items-center slider-route"
          value={[currentTime]}
          max={duration}
          min={0}
          step={1}
          onValueChange={handleValueChange}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
        >
          <SliderTrack className="slider-track relative h-[3px] grow rounded-full bg-background-500">
            <SliderRange className="absolute h-full rounded-full bg-background-50" />
          </SliderTrack>
          <SliderThumb
            className="slider-thumb block h-3 w-1 rounded-full bg-background-50 shadow-[0_0_2px_1px_rgb(0_0_0/0.45)] hover:scale-110 transition-[transform,opacity] focus:border-0"
            style={{
              opacity: 0,
            }}
            aria-label="Song progress"
          />
        </SliderRoute>
        {isVisible && (
          <time
            ref={hoverTimeRef}
            className="hover-time absolute bottom-6 bg-background-50 text-background-950 font-bold text-[12px] p-[2px] rounded-xs w-9 flex justify-center items-center transition-opacity duration-200"
            style={{
              left: `${hoverPosition - 18}px`,
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            {hoverTime}
          </time>
        )}
        {/* {isDragging && (
        )} */}
      </div>
      <time className="text-[12px] w-9 flex justify-center items-center">{formattedDuration}</time>
    </div>
  );
};

export default Slider;
