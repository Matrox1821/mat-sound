import { usePlayerStore } from "src/store/playerStore";

export function CurrentTrack() {
  const { currentMusic } = usePlayerStore((state) => state);

  return (
    <div className="flex justify-center items-center w-full">
      <img
        src={currentMusic.track?.image}
        alt={currentMusic.track?.name}
        className="w-10 h-10 rounded-md"
      />

      <div className="flex p-2 w-full flex-col justify-center items-start">
        <h3 className="font-semibold text-base">{currentMusic.track?.name}</h3>
        <span className="font-normal text-xs">
          {currentMusic.track?.artist?.name}
        </span>
      </div>
    </div>
  );
}
