import { MediaCard } from "@/types/content.types";

interface CarouselCardPlayButtonProps {
  track: MediaCard;
}

export const PreloadTrack = ({ track }: CarouselCardPlayButtonProps) => {
  if (track.type !== "tracks" || !track.song) return;
  return <link rel="preload" as="fetch" href={track.song} crossOrigin="anonymous" />;
};
