import { ImageSizes } from "@/types/common.types";
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

export const PlaylistImage = ({
  trackImages,
  image,
  imageClassName,
  sizeImage,
}: {
  trackImages?: ImageSizes[] | null;
  image?: string;
  imageClassName?: string;
  sizeImage?: number;
}) => {
  if (image || trackImages?.length === 1)
    return (
      <figure className={`h-10 w-10 rounded-md bg-black/85 ${imageClassName}`}>
        <SafeImage
          src={trackImages?.length === 1 ? trackImages[0].sm : image}
          alt=""
          height={sizeImage || 40}
          width={sizeImage || 40}
          className={`!object-fill !aspect-square !w-full !h-full !rounded-md`}
        />
      </figure>
    );
  let images = trackImages;
  if (images && images.length === 0) return;

  if (images && images.length < 4)
    images = images = [...images, ...Array(4 - images.length).fill(null)];

  if (images && images.length > 4) images = images.slice(0, 4);
  return (
    <figure
      className={`h-10 w-10 rounded-md bg-black/85 grid grid-cols-2 grid-row-2 objec ${imageClassName}`}
    >
      {images &&
        images.map((image, i) => {
          if (image && image.sm) {
            return (
              <SafeImage
                src={image && image.sm}
                alt=""
                key={`playlist-image-${i}`}
                height={sizeImage ? sizeImage / 2 : 20}
                width={sizeImage ? sizeImage / 2 : 20}
                className={`!w-5 !h-5 ${roundedByIndex(i)}`}
              />
            );
          }
          return (
            <div
              className="!w-5 !h-5"
              style={{ width: `${sizeImage}px`, height: `${sizeImage}px` }}
              key={i}
            ></div>
          );
        })}
    </figure>
  );
};
