import Image from "next/image";
import { useState } from "react";

interface CustomFiles {
  styles: {
    labelStyle?: string;
    titleStyle?: string;
    inputStyle?: string;
    previewImageStyle?: string;
  };
  title: string;
  name: string;
  options: { isRequired: boolean; isAudio: boolean; isMultiple: boolean };
  onChange?: (value: any) => void;
}
export default function CustomFiles({ styles, title, name, options, onChange }: CustomFiles) {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [audioName, setAudioName] = useState<string>("");
  return (
    <div
      className={`${
        options.isAudio
          ? "flex flex-col items-center gap-2"
          : options.isMultiple
          ? "flex flex-col gap-2"
          : "flex h-22 gap-4"
      }`}
    >
      <label className={`${styles.labelStyle} flex`}>
        <h2 className={styles.titleStyle}>
          {title}
          {options.isRequired && <span className="text-red-400 pl-1">*</span>}
        </h2>
        <span
          className={`flex items-center ${styles.inputStyle} ${
            options.isMultiple ? "" : "justify-center !p-2"
          }`}
        >
          {options.isAudio
            ? "Ingrese un audio"
            : `Ingrese ${options.isMultiple ? "al menos una imágen" : "una imágen"}`}
          <input
            type="file"
            name={name}
            required={options.isRequired}
            className="hidden"
            multiple={options.isMultiple}
            onChange={({ currentTarget: { files } }: React.ChangeEvent<HTMLInputElement>) => {
              if (files && files.length > 0) {
                if (options.isAudio) {
                  const file = files[0];
                  setAudioName(files[0].name);
                  onChange?.(file);
                  return;
                }
                setPreviewImages([]);
                setPreviewImage("");
                if (options.isMultiple) {
                  const selectedFiles: File[] = Array.from(files);
                  onChange?.(selectedFiles);
                  selectedFiles.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewImages((prev) => [...prev, reader.result as string]);
                    };
                    reader.readAsDataURL(file);
                  });
                } else {
                  const file = files[0];
                  onChange?.(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
        </span>
      </label>
      {options.isAudio && audioName !== "" ? (
        <span className="h-full flex items-center text-base font-bold text-accent-950">
          {audioName}
        </span>
      ) : (
        <ImagesPreview
          previewImage={previewImage}
          previewImages={previewImages}
          previewImageStyle={styles.previewImageStyle}
        />
      )}
    </div>
  );
}

const ImagesPreview = ({
  previewImages,
  previewImage,
  previewImageStyle,
}: {
  previewImages: string[];
  previewImage: string;
  previewImageStyle?: string;
}) => {
  return (
    <div
      className={
        previewImages.length !== 0 || previewImage !== ""
          ? `imagePreviewScroll ${previewImageStyle}`
          : ""
      }
    >
      {previewImages.length > 0 &&
        previewImages.map((image, index) => (
          <Image
            width={64}
            height={64}
            key={index}
            src={image}
            alt=""
            className="w-16 h-16 object-cover rounded-xs"
          />
        ))}
      {previewImage !== "" ? (
        <Image
          width={64}
          height={64}
          src={previewImage}
          alt=""
          className="w-16 h-16 object-cover rounded-xs"
        />
      ) : (
        <div className="w-22 h-22 object-cover rounded-xs" />
      )}
    </div>
  );
};
