import { useState } from "react";

interface CustomInputProps {
  title: string;
  name: string;
  type: "text" | "textarea" | "checkbox" | "file" | "number";
  isRequired?: boolean;
  labelStyle: string;
  titleStyle: string;
  inputStyle: string;
  isMultiple?: boolean;
  previewImageStyle?: string;
  isAudio?: boolean;
}
export function CustomInput({
  title,
  name,
  type,
  isRequired,
  labelStyle,
  titleStyle,
  inputStyle,
  isMultiple,
  previewImageStyle,
  isAudio,
}: CustomInputProps) {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [audioName, setAudioName] = useState<string>("");
  console.log(audioName);
  switch (type) {
    case "checkbox":
      return (
        <label className={`${labelStyle} inline-flex`}>
          <div className={`flex w-full items-center gap-6 text`}>
            <h2 className={titleStyle}>
              {title}
              {isRequired && <span className="text-red-400 pl-1">*</span>}
            </h2>
            <input
              type={type}
              name={name}
              required={isRequired}
              className={`!w-5 ${inputStyle}`}
            />
          </div>
        </label>
      );
    case "text":
    case "number":
      return (
        <label className={`${labelStyle} flex`}>
          <h2 className={titleStyle}>
            {title}
            {isRequired && <span className="text-red-400 pl-1">*</span>}
          </h2>
          <input
            type={type}
            name={name}
            required={isRequired}
            className={inputStyle}
          />
        </label>
      );
    case "textarea":
      return (
        <label className={`${labelStyle} flex`}>
          <h2 className={titleStyle}>
            {title}
            {isRequired && <span className="text-red-400 pl-1">*</span>}
          </h2>
          <textarea name={name} required={isRequired} className={inputStyle} />
        </label>
      );

    case "file":
      return (
        <div
          className={`${
            isAudio
              ? "flex flex-col items-center gap-2"
              : isMultiple
              ? "flex flex-col gap-2"
              : "flex h-22 gap-4 pr-24"
          }`}
        >
          <label className={`${labelStyle} flex`}>
            <h2 className={titleStyle}>
              {title}
              {isRequired && <span className="text-red-400 pl-1">*</span>}
            </h2>
            <span
              className={`flex items-center ${inputStyle} ${
                isMultiple ? "" : "justify-center !p-2"
              }`}
            >
              {isAudio
                ? "Ingrese un audio"
                : `Ingrese ${
                    isMultiple ? "al menos una imágen" : "una imágen"
                  }`}
              <input
                type={type}
                name={name}
                required={isRequired}
                className="hidden"
                multiple={isMultiple}
                onChange={({
                  currentTarget: { files },
                }: React.ChangeEvent<HTMLInputElement>) => {
                  if (files && files.length > 0) {
                    if (isAudio) {
                      setAudioName(files[0].name);
                      return;
                    }
                    setPreviewImages([]);
                    setPreviewImage("");
                    if (isMultiple) {
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImages((prev) => [
                            ...prev,
                            reader.result as string,
                          ]);
                        };
                        reader.readAsDataURL(file);
                      }
                    } else {
                      const file = files[0];
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
          {isAudio && audioName !== "" ? (
            <span className="h-full flex items-center text-base font-bold text-accent">
              {audioName}
            </span>
          ) : (
            <ImagesPreview
              previewImage={previewImage}
              previewImages={previewImages}
              previewImageStyle={previewImageStyle}
            />
          )}
        </div>
      );

    default:
      return null;
  }
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
          <img
            key={index}
            src={image}
            alt=""
            className="w-16 h-16 object-cover rounded-xs"
          />
        ))}
      {previewImage !== "" ? (
        <img
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
