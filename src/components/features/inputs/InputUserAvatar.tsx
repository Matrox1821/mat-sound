"use client";
import { CustomAvatarFile } from "@/components/ui/customInputs/CustomAvatarFile";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/ui/images/ImageCropper";
import Image from "next/image";
import { useState } from "react";

const urlToFile = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "user-avatar", { type: blob.type });

    return file;
  } catch (error) {
    console.error("Error converting URL to file:", error);
    return null;
  }
};

interface ImageCropper {
  onChange?: (value: any) => void;
  setIsCropping: (value: boolean) => void;
  defaultImage?: string | null;
  isCropping: boolean;
}

export const InputUserAvatar = ({
  defaultImage = "",
  onChange,
  setIsCropping,
  isCropping,
}: ImageCropper) => {
  const [file, setFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(new Date().toString());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCropping(true);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCroppedImage(null);
    }
  };
  const handleCancel = () => {
    setIsCropping(false);
    setFile(null);
    setCroppedImage(null);
    // Al cambiar la key, React destruye y vuelve a crear el componente CustomAvatarFile,
    // limpiando efectivamente el input file interno.
    setInputKey(new Date().toString());
  };
  const handleCropComplete = async (croppedImgBase64: string) => {
    setCroppedImage(croppedImgBase64); // Actualizamos la vista previa local

    // Convertimos y enviamos al padre
    const fileData = await urlToFile(croppedImgBase64);
    if (fileData) {
      onChange?.(fileData);
      setIsCropping(false); // Cerramos el menú AQUI, cuando ya tenemos el dato seguro
    }
  };
  return (
    <>
      <div className="flex !h-22 w-full bg-background rounded-md border border-background-200/50 p-3 items-center gap-4">
        <CustomAvatarFile
          key={inputKey}
          title="Editar foto de perfil"
          name="avatarImage"
          defaultImage={defaultImage}
          onChange={handleFileChange}
        >
          {croppedImage && (
            <Image
              src={croppedImage}
              alt="Cropped"
              className="h-full w-auto aspect-square rounded-lg"
              height={30}
              width={30}
            />
          )}
        </CustomAvatarFile>
      </div>

      {file && isCropping && (
        <div className={`flex flex-col items-center gap-4 `}>
          <ImageCrop file={file} aspect={1} onCrop={handleCropComplete}>
            <ImageCropContent className="max-w-sm" />
            <div className="mt-2 flex justify-center gap-2">
              <ImageCropReset onClick={handleCancel} />
              <ImageCropApply
                onClick={async () => {
                  if (!croppedImage) return;
                  urlToFile(croppedImage).then((data) => {
                    onChange?.(data);
                    setIsCropping(false);
                  });
                }}
              />
            </div>
          </ImageCrop>
        </div>
      )}
    </>
  );
};
