import Image from "next/image";

const roundedByIndex = (index: number) => {
  switch (index) {
    case 0:
      return "rounded-tl-md";
    case 1:
      return "rounded-tr-md";
    case 2:
      return "rounded-br-md";
    case 3:
      return "rounded-bl-md";
    default:
      return "rounded-md";
  }
};

export const PlaylistImage = ({
  trackImages,
  image,
  imageClassName,
  sizeImage,
}: {
  trackImages?: { id: string; cover: { sm: string; md: string; lg: string } }[];
  image?: string;
  imageClassName?: string;
  sizeImage?: number;
}) => {
  if (image)
    return (
      <Image
        src={image}
        alt=""
        height={sizeImage || 40}
        width={sizeImage || 40}
        className={imageClassName}
      ></Image>
    );
  let images = trackImages;
  if (images && images.length === 0) return;
  if (images && images.length === 1)
    return (
      <Image
        src={images[0].cover.sm}
        alt=""
        width={sizeImage || 40}
        height={sizeImage || 40}
        className="h-10 w-10 rounded-md"
      />
    );
  if (images && images.length > 4) images = images.slice(0, 4);

  return (
    <figure
      className={`h-10 w-10 rounded-md bg-background grid grid-cols-2 grid-row-2 ${imageClassName}`}
    >
      {images &&
        images.map((image, i) =>
          image ? (
            <Image
              src={image.cover.sm}
              alt=""
              key={image.id}
              height={sizeImage ? sizeImage / 2 : 20}
              width={sizeImage ? sizeImage / 2 : 20}
              className={`${roundedByIndex(i)}`}
            />
          ) : null
        )}
    </figure>
  );
};
