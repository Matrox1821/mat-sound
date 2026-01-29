import { CSSProperties } from "react";
import { CustomInput } from "./CustomInput";

export function CustomInputAdminForm({
  disabled = false,
  ...props
}: {
  title: string;
  type: "text" | "textarea" | "checkbox" | "file" | "number" | "email" | "password";
  name: string;
  isRequired?: boolean;
  isMultiple?: boolean;
  isAudio?: boolean;
  inBox?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  defaultImage?: string;
  defaultImages?: string[] | null;
  defaultAudio?: string | null;
  disabled?: boolean;
  cssStyles?: CSSProperties;
}) {
  return (
    <CustomInput
      disabled={disabled}
      {...props}
      cssStyles={props.cssStyles}
      styles={{
        labelStyle: `${props.inBox ? "flex-col gap-2 w-full" : "flex-col gap-2"}`,
        titleStyle: "text-base",
        inputStyle: `w-full bg-background border border-background-100/50 rounded-md focus-visible:border-accent-900/60 focus:border outline-none ${
          props.type === "textarea" ? "h-32 py-1 pl-1 text-sm" : "h-10 py-4 pl-1"
        }`,
        previewImageStyle: `${
          props.isMultiple
            ? "w-full grid gap-2 grid-cols-6 justify-items-center"
            : "h-22 w-22 flex justify-center"
        }  items-center p-2 overflow-x-hidden border border-background-100/50 rounded-md`,
      }}
      options={{
        isRequired: Boolean(props.isRequired),
        isMultiple: Boolean(props.isMultiple),
        isAudio: Boolean(props.isAudio),
        inBox: Boolean(props.inBox),
      }}
    />
  );
}
