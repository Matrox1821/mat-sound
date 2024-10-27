import { type RefObject } from "react";
import { parseAudioProgress } from "src/shared/helpers";

export function ProgressBar({ audio }: { audio: RefObject<HTMLAudioElement> }) {
  const progress = parseAudioProgress({ audio });

  return (
    <div className="w-[calc(100%-16px)] h-[3px] bg-black/50 rounded-sm mx-2 flex">
      <span
        style={{
          width: `${progress}%`,
        }}
        className="bg-white h-[3px] rounded-sm"
      />
    </div>
  );
}
