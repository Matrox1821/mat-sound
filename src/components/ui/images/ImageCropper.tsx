"use client";

import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type PercentCrop,
  type PixelCrop,
  type ReactCropProps,
} from "react-image-crop";
import Image from "next/image";
import "react-image-crop/dist/ReactCrop.css";

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined,
): PercentCrop =>
  centerCrop(
    aspect
      ? makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          aspect,
          mediaWidth,
          mediaHeight,
        )
      : { x: 0, y: 0, width: 90, height: 90, unit: "%" },
    mediaWidth,
    mediaHeight,
  );

const getCroppedImg = async (
  imageSrc: HTMLImageElement,
  pixelCrop: PixelCrop,
  maxImageSize: number, // en bytes
  quality = 0.9, // Calidad inicial
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  const scaleX = imageSrc.naturalWidth / imageSrc.width;
  const scaleY = imageSrc.naturalHeight / imageSrc.height;

  // 1. Calculamos el tamaño real del recorte
  let targetWidth = Math.floor(pixelCrop.width * scaleX);
  let targetHeight = Math.floor(pixelCrop.height * scaleY);

  // 2. IMPORTANTE: Limitamos la resolución máxima a 1024x1024.
  // Esto evita que suban imágenes de 4000px que pesan mucho y rompen el servidor,
  // pero mantiene calidad HD.
  const MAX_DIMENSION = 1024;
  if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
    const ratio = targetWidth / targetHeight;
    if (targetWidth > targetHeight) {
      targetWidth = MAX_DIMENSION;
      targetHeight = Math.floor(MAX_DIMENSION / ratio);
    } else {
      targetHeight = MAX_DIMENSION;
      targetWidth = Math.floor(MAX_DIMENSION * ratio);
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    imageSrc,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  // Intentar convertir
  const tryCompress = async (q: number): Promise<string> => {
    // Usamos JPEG o WEBP. WebP es mejor, pero JPEG es más compatible si el servidor procesa.
    // Usaremos WEBP que es lo que tenías.
    const url = canvas.toDataURL("image/webp", q);
    const res = await fetch(url);
    const blob = await res.blob();

    // Si el archivo sigue siendo muy grande y la calidad es aceptable, reducimos calidad
    if (blob.size > maxImageSize && q > 0.5) {
      return tryCompress(q - 0.1); // Recursividad bajando calidad
    }
    return url;
  };

  return tryCompress(quality);
};
interface ImageCropContextType {
  file: File;
  maxImageSize: number;
  imgSrc: string;
  crop: PercentCrop | undefined;
  completedCrop: PixelCrop | null;
  imgRef: RefObject<HTMLImageElement | null>;
  onCrop?: (croppedImage: string) => void;
  reactCropProps: Omit<ReactCropProps, "onChange" | "onComplete" | "children">;
  handleChange: (pixelCrop: PixelCrop, percentCrop: PercentCrop) => void;
  handleComplete: (pixelCrop: PixelCrop, percentCrop: PercentCrop) => Promise<void>;
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>) => void;
  applyCrop: () => Promise<void>;
  resetCrop: () => void;
}

const ImageCropContext = createContext<ImageCropContextType | null>(null);

const useImageCrop = () => {
  const context = useContext(ImageCropContext);
  if (!context) {
    throw new Error("ImageCrop components must be used within ImageCrop");
  }
  return context;
};

export type ImageCropProps = {
  file: File;
  maxImageSize?: number;
  onCrop?: (croppedImage: string) => void;
  children: ReactNode;
  onChange?: ReactCropProps["onChange"];
  onComplete?: ReactCropProps["onComplete"];
} & Omit<ReactCropProps, "onChange" | "onComplete" | "children">;

export const ImageCrop = ({
  file,
  // Bajamos el default a 4MB para asegurar que entra en Server Actions
  maxImageSize = 1024 * 1024 * 4,
  onCrop,
  children,
  onChange,
  onComplete,
  ...reactCropProps
}: ImageCropProps) => {
  // ... (refs y estados iguales) ...
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [initialCrop, setInitialCrop] = useState<PercentCrop>();

  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
    reader.readAsDataURL(file);
  }, [file]);

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const newCrop = centerAspectCrop(width, height, reactCropProps.aspect);
      setCrop(newCrop);
      setInitialCrop(newCrop);
    },
    [reactCropProps.aspect],
  );

  // ... handlers handleChange y handleComplete iguales ...
  const handleChange = (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    setCrop(percentCrop);
    onChange?.(pixelCrop, percentCrop);
  };

  const handleComplete = async (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    setCompletedCrop(pixelCrop);
    onComplete?.(pixelCrop, percentCrop);
  };

  const applyCrop = async () => {
    if (!(imgRef.current && completedCrop)) return;

    // Usamos la nueva función
    const croppedImage = await getCroppedImg(imgRef.current, completedCrop, maxImageSize);

    onCrop?.(croppedImage);
  };

  // ... resto del componente (resetCrop, contextValue, return) igual ...
  const resetCrop = () => {
    if (initialCrop) {
      setCrop(initialCrop);
      setCompletedCrop(null);
    }
  };

  const contextValue: ImageCropContextType = {
    file,
    maxImageSize,
    imgSrc,
    crop,
    completedCrop,
    imgRef,
    onCrop,
    reactCropProps,
    handleChange,
    handleComplete,
    onImageLoad,
    applyCrop,
    resetCrop,
  };

  return <ImageCropContext.Provider value={contextValue}>{children}</ImageCropContext.Provider>;
};
export interface ImageCropContentProps {
  style?: CSSProperties;
  className?: string;
}

export const ImageCropContent = ({ style }: ImageCropContentProps) => {
  const { imgSrc, crop, handleChange, handleComplete, onImageLoad, imgRef, reactCropProps } =
    useImageCrop();

  const shadcnStyle = {
    "--rc-border-color": "var(--color-border)",
    "--rc-focus-color": "var(--color-primary)",
  } as CSSProperties;

  return (
    <ReactCrop
      className={"max-h-[277px] max-w-full"}
      crop={crop}
      onChange={handleChange}
      onComplete={handleComplete}
      style={{ ...shadcnStyle, ...style }}
      {...reactCropProps}
    >
      {imgSrc && (
        <Image
          alt="crop"
          className="size-full"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          onLoad={onImageLoad}
          ref={imgRef}
          src={imgSrc}
        />
      )}
    </ReactCrop>
  );
};

export type ImageCropApplyProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const ImageCropApply = ({ onClick, ...props }: ImageCropApplyProps) => {
  const { applyCrop } = useImageCrop();

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    await applyCrop();
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      size="icon"
      variant="ghost"
      type="button"
      className="flex items-center gap-2 cursor-pointer bg-accent-900/20 border border-accent-900/50 p-2 leading-0 rounded-md hover:bg-accent-900/30"
      {...(props as any)}
    >
      <i className="size-4 pi pi-check" /> Aceptar
    </button>
  );
};

export type ImageCropResetProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const ImageCropReset = ({ onClick, ...props }: ImageCropResetProps) => {
  const { resetCrop } = useImageCrop();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    resetCrop();
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      size="icon"
      variant="ghost"
      type="button"
      className="flex items-center gap-2 cursor-pointer bg-red-700/20 border border-red-700/50 p-2 leading-0 rounded-md hover:bg-red-700/30"
      {...(props as any)}
    >
      <i className="size-4 pi pi-times" /> Cancelar
    </button>
  );
};

// Keep the original Cropper component for backward compatibility
export type CropperProps = Omit<ReactCropProps, "onChange"> & {
  file: File;
  maxImageSize?: number;
  onCrop?: (croppedImage: string) => void;
  onChange?: ReactCropProps["onChange"];
};

export const Cropper = ({
  onChange,
  onComplete,
  onCrop,
  style,
  className,
  file,
  maxImageSize,
  ...props
}: CropperProps) => (
  <ImageCrop
    file={file}
    maxImageSize={maxImageSize}
    onChange={onChange}
    onComplete={onComplete}
    onCrop={onCrop}
    {...(props as any)}
  >
    <ImageCropContent className={className} style={style} />
  </ImageCrop>
);
