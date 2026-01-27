import { ContentTrack } from "@shared-types/content.types";

interface CarouselCardPlayButtonProps {
  track: ContentTrack;
}

const PreloadTrack = ({ track }: CarouselCardPlayButtonProps) => {
  return <link rel="preload" as="fetch" href={track.song} crossOrigin="anonymous" />;
};

export default PreloadTrack;
