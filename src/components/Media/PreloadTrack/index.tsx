import { contentProps } from "@/types/common.types";

interface CarouselCardPlayButtonProps {
  track: contentProps;
}

const PreloadTrack = ({ track }: CarouselCardPlayButtonProps) => {
  return <link rel="preload" as="fetch" href={track.song} crossOrigin="anonymous" />;
};

export default PreloadTrack;
