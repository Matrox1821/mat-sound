import { Play } from "@/components/UI/Icons/Playback/Play";
import { artistTracksProps } from "@/types";
import Image from "next/image";

export default async function Sample({ newTrack }: { newTrack: artistTracksProps[] | null }) {
  if (!newTrack) return null;
  return (
    <button
      className="h-[49px] w-[39px] rounded-[7px] flex justify-center items-center bg-[rgba(var(--bg),1)] image-button relative z-0 overflow-hidden cursor-pointer hover:[&>span>span]:!opacity-100"
      /* onClick={handleClick} */
    >
      <span className="bg-[rgba(var(--bg),1)] p-[3px] rounded-[5px] relative z-20">
        <Image
          src={newTrack[0].cover?.sm || ""}
          alt={newTrack[0].name}
          width={30}
          height={40}
          className="h-[39px] w-[29px] object-cover rounded-[4px] relative"
        />
        <span className="absolute z-30 top-0 mt-[3px] h-[39px] w-[29px] flex items-center justify-center bg-background-900/60 opacity-0">
          <Play className="pi pi-sort-down-fill text-content-950 !h-5 !w-5"></Play>
        </span>
      </span>
    </button>
  );
}
