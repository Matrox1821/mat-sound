import { contentProps } from "@/types";

interface CarouselCardPlayButtonProps {
  track: contentProps;
}

const PreloadTrack = ({ track }: CarouselCardPlayButtonProps) => {
  return <link rel="preload" as="audio" href={track.song} />;
};

export default PreloadTrack;
