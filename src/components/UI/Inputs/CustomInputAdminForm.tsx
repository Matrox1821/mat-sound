import { CustomInput } from "./CustomInput";

export default function CustomInputAdminForm(props: {
  title: string;
  type: "text" | "textarea" | "checkbox" | "file" | "number" | "email" | "password";
  name: string;
  isRequired?: boolean;
  isMultiple?: boolean;
  isAudio?: boolean;
  inBox?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}) {
  return (
    <CustomInput
      {...props}
      styles={{
        labelStyle: `${props.inBox ? "flex-col gap-2 w-full" : "flex-col gap-2"}`,
        titleStyle: "text-base",
        inputStyle: `w-full bg-background-950 border-2 border-content-700 rounded-md focus-visible:border-accent-900 focus:border-2 outline-none ${
          props.type === "textarea" ? "h-32 py-1 pl-1 text-sm" : "h-8 py-4 pl-1"
        }`,
        previewImageStyle: `${
          props.isMultiple
            ? "h-24 verflow-y-auto w-full grid gap-2 grid-cols-3"
            : "h-22 w-22 flex justify-center"
        }  items-center p-2 overflow-x-hidden border-2 border-accent-700 rounded-md`,
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
