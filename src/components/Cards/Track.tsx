import Image from "next/image";

const styles = {
  base: "w-96 color-content duration-150 gap-2 active:scale-[.98] active:opacity-80 relative",
  sm: "!flex-[0_0_7rem]",
  inGrid: "!h-12 !w-full !bg-[rgb(255,255,255,0.1)] !rounded-[4px]",
  inColumn: "!w-full active:!scale-[.98] !rounded-lg",
};

export default function Track({ track }: any) {
  return (
    <li className="w-96 color-content duration-150 gap-2 active:scale-[.98] active:opacity-80 relative">
      <a
        id={track.id}
        className="flex color-[rgba(var(--content),1)] duration-150 gap-2 track"
        /* class:list={
          isGrid
            ? "items-center overflow-x-hidden grid-title"
            : isColumn
            ? "flex gap-2 w-full h-full p-2 items-center rounded-lg"
            : "flex-col rounded-lg"
        } */
        href={`/track/${track.id}`}
      >
        <Image
          src={track.image}
          alt={track.name}
          width={10}
          height={10}
          className="object-fill aspect-square"
          /* class:list={
            isGrid
              ? "w-12 h-12 rounded-[4px]"
              : isColumn
              ? "object-fill aspect-square w-12 rounded-sm"
              : "w-full  rounded-md"
          } */
          loading="lazy"
          quality={50}
        />
        <span
        /*  class:list={
            isColumn
              ? "flex flex-col items-start overflow-hidden text-start w-full"
              : ""
          } */
        >
          <h2
            style={{ overflowWrap: "anywhere" }}
            className="m-0 leading-5"
            /*  class:list={
              isGrid
                ? "font-semibold text-sm overflow-hidden text-ellipsis mr-1"
                : isColumn
                ? "font-normal text-xl m-0 leading-7 overflow-hidden text-ellipsis w-full text-nowrap"
                : "font-normal text-[18px]"
            } */
          >
            {track.name}
          </h2>
          {/*  {!isGrid && (
            <span className="text-xs font-medium opacity-70">
              Single • {track.artist?.name}
            </span>
          )} */}
        </span>
      </a>
    </li>
  );
}
