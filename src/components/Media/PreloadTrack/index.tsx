import { ContentElement } from "@/types/content.types";

interface CarouselCardPlayButtonProps {
  track: ContentElement;
}

const PreloadTrack = ({ track }: CarouselCardPlayButtonProps) => {
  return <link rel="preload" as="fetch" href={track.song} crossOrigin="anonymous" />;
};

export default PreloadTrack;
