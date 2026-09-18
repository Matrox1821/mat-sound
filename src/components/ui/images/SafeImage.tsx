"use client";
import Image from "next/image";
import { NoImage } from "../icons/NoImage";
import { CSSProperties, useState } from "react";
import { Skeleton } from "primereact/skeleton";

interface ImageSetter {
  src?: string | null;
  height?: number;
  width?: number;
  alt?: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
  quality?: number;
  skeleton?: boolean;
  unoptimized?: boolean;
  style?: CSSProperties;
  sizes?: string;
  fill?: boolean;
}

export const SafeImage = ({
  src,
  sizes,
  height,
  width,
  alt = "",
  className,
  fetchPriority = "high",
  quality,
  unoptimized = false,
  skeleton = true,
  style,
  fill = false,
}: ImageSetter) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoading(true);
    setError(false);
  }

  if (!src || src === "" || error) {
    return (
      <div className={`flex items-center justify-center rounded-md ${className} `}>
        <NoImage className={`opacity-20 ${className}`} />
      </div>
    );
  }

  return (
    <>
      {skeleton && isLoading && (
        <Skeleton
          className={`aspect-square! absolute! h-full! w-full! ${className}`}
          style={style}
        />
      )}

      <Image
        style={style}
        src={src}
        alt={alt}
        height={height}
        width={width}
        fetchPriority={fetchPriority}
        quality={quality}
        sizes={sizes}
        className={`${className} ${
          isLoading ? "opacity-0 invisible" : "opacity-100 visible transition-opacity duration-300"
        }`}
        loading="eager"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        priority
        fill={fill}
        unoptimized={unoptimized}
      />
    </>
  );
};
