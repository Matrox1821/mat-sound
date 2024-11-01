import type { trackProps } from "src/types";

interface Props {
  track: trackProps;
  hasTransition?: boolean;
}

export default function Track({ track, hasTransition }: Props) {
  return (
    <li
      className="flex-[0_0_9rem] w-96 rounded-lg color-[rgba(var(--content),1)] duration-150 gap-2"
      style={{
        viewTransitionName: hasTransition
          ? `${track.id}-to-background`
          : undefined,
      }}
    >
      <a
        id={track.id}
        className="flex flex-col rounded-lg color-[rgba(var(--content),1)] duration-150 gap-2 track"
        href={`/track/${track.id}`}
      >
        <img
          src={track.image}
          alt={track.name}
          className="object-fill aspect-square w-full rounded-md"
          style={{
            viewTransitionName: hasTransition
              ? `${track.id}-to-page`
              : undefined,
          }}
          loading="lazy"
        />
        <h2
          className="font-normal text-base m-0 leading-5"
          style={{
            overflowWrap: "anywhere",
            viewTransitionName: hasTransition
              ? `${track.id}-to-title`
              : undefined,
          }}
        >
          {track.name}
        </h2>
        <span
          className="text-xs font-medium opacity-70"
          style={{
            overflowWrap: "anywhere",
            viewTransitionName: hasTransition
              ? `${track.id}-to-artist`
              : undefined,
          }}
        >
          {track.artist?.name}
        </span>
      </a>
    </li>
  );
}
