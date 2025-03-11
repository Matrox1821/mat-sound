import { CustomInput } from "./CustomInput";

export default function CustomInputAdminForm(props: {
  title: string;
  type:
    | "text"
    | "textarea"
    | "checkbox"
    | "file"
    | "number"
    | "email"
    | "password";
  isRequired?: boolean;
  name: string;
  isMultiple?: boolean;
  inBox?: boolean;
  isAudio?: boolean;
}) {
  return (
    <CustomInput
      {...props}
      labelStyle={`${props.inBox ? "flex-col gap-2 w-full" : "flex-col gap-2"}`}
      titleStyle="text-base"
      inputStyle={`w-full bg-background border-2 border-content/70 rounded-md focus-visible:border-accent/90 focus:border-2 outline-none ${
        props.type === "textarea" ? "h-32 py-1 pl-1 text-sm" : "h-8 py-4 pl-1"
      }`}
      previewImageStyle={`${
        props.isMultiple
          ? "h-24 verflow-y-auto w-full grid gap-2 grid-cols-3"
          : "h-22 w-22 flex justify-center"
      }  items-center p-2 overflow-x-hidden border-2 border-accent/70 rounded-md`}
    />
  );
}
