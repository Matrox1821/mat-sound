"use client";
import { ReactNode, useState } from "react";
import { SafeImage } from "../images/SafeImage";

interface CustomFiles {
  title: string;
  name: string;
  onChange?: (value: any) => void;
  defaultImage?: string | null;
  disabled?: boolean;
  children?: ReactNode;
}
export function CustomAvatarFile({
  title,
  name,
  onChange,
  defaultImage = "",
  disabled = false,
  children,
}: CustomFiles) {
  const [previewImage, setPreviewImage] = useState<string>(defaultImage || "");
  return (
    <div className={`flex h-full gap-4`}>
      <label className={` flex`}>
        <span className={`flex items-center justify-center cursor-pointer  gap-4`}>
          <input
            type="file"
            name={name}
            className="hidden"
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.currentTarget.files && e.currentTarget.files.length > 0) {
                setPreviewImage("");
                const file = e.currentTarget.files[0];
                const reader = new FileReader();
                onChange?.(e);
                reader.onloadend = () => {
                  setPreviewImage(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {children ? children : <ImagesPreview previewImage={previewImage} />}
          <h2 className="">{title}</h2>
        </span>
      </label>
    </div>
  );
}

const ImagesPreview = ({ previewImage }: { previewImage: string }) => {
  return (
    <div className="!h-full relative">
      {previewImage !== "" ? (
        <SafeImage
          width={64}
          height={64}
          src={previewImage}
          alt=""
          className={`!h-full !object-cover !rounded-xs !aspect-square`}
        />
      ) : (
        <div className="h-full aspect-square rounded-xs border border-dashed border-background-50/60 flex items-center justify-center text-background-50/80">
          img
        </div>
      )}
    </div>
  );
};
