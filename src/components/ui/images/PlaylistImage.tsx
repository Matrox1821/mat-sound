import { ImageSizes } from "@shared-types/common.types";
import { SafeImage } from "./SafeImage";

const roundedByIndex = (index: number) => {
  switch (index) {
    case 0:
      return "!rounded-tl-md";
    case 1:
      return "!rounded-tr-md";
    case 2:
      return "!rounded-br-md";
    case 3:
      return "!rounded-bl-md";
    default:
      return "!rounded-md";
  }
};

interface PlaylistImageProps {
  image?: string | null;
  trackImages?: ImageSizes[] | null;
  size?: number;
  className?: string;
  quality?: 50 | 75 | 100;
}

export const PlaylistImage = ({
  image,
  trackImages,
  size = 40,
  className,
  quality,
}: PlaylistImageProps) => {
  // --- CASO: cover único ---
  if (image || trackImages?.length === 1) {
    const src = image ?? trackImages?.[0]?.sm;

    return (
      <figure
        className={`relative rounded-md overflow-hidden bg-black/85 ${className}`}
        style={{ width: size, height: size }}
      >
        <SafeImage src={src} alt="" fill className="!object-cover" quality={quality} />
      </figure>
    );
  }

  // --- CASO: collage ---

  let images = trackImages;
  if (images && images.length === 0)
    return (
      <SafeImage src={""} alt="" height={size / 4} width={size / 4} className={`!object-cover `} />
    );

  if (images && images.length < 4)
    images = images = [...images, ...Array(4 - images.length).fill(null)];

  if (images && images.length > 4) images = images.slice(0, 4);

  return (
    <figure
      className={`rounded-md overflow-hidden w-full h-full grid grid-cols-2 grid-rows-2 bg-black/85 ${className}`}
      style={{ width: size, height: size }}
    >
      {images &&
        images.map((img: ImageSizes, i: number) => {
          if (!img) return;
          return (
            <SafeImage
              src={img && img.sm}
              quality={quality}
              alt=""
              height={size / 4}
              width={size / 4}
              className={`!object-cover !w-full !h-full ${roundedByIndex(i)}`}
              key={i}
            />
          );
        })}
    </figure>
  );
};
