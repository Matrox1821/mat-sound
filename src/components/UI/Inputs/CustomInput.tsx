import CustomFiles from "./CustomInputs/CustomFiles";
import CustomTextArea from "./CustomInputs/CustomTextArea";
import CustomCheckBox from "./CustomInputs/CustomCheckBox";

interface CustomInputProps {
  title: string;
  name: string;
  type:
    | "text"
    | "textarea"
    | "checkbox"
    | "file"
    | "number"
    | "email"
    | "password";
  styles: {
    labelStyle: string;
    titleStyle: string;
    inputStyle: string;
    previewImageStyle: string;
  };
  options: {
    isRequired: boolean;
    isMultiple: boolean;
    isAudio: boolean;
    inBox: boolean;
  };
}
export function CustomInput({
  title,
  name,
  type,
  options,
  styles,
}: CustomInputProps) {
  switch (type) {
    case "checkbox":
      return (
        <CustomCheckBox
          styles={styles}
          isRequired={Boolean(options.isRequired)}
          name={name}
          title={title}
        />
      );
    case "textarea":
      return (
        <CustomTextArea
          styles={styles}
          isRequired={Boolean(options.isRequired)}
          name={name}
          title={title}
        />
      );

    case "file":
      return (
        <CustomFiles
          styles={styles}
          options={options}
          name={name}
          title={title}
        />
      );

    default:
      return (
        <label className={`${styles.labelStyle} flex`}>
          <h2 className={styles.titleStyle}>
            {title}
            {options.isRequired && <span className="text-red-400 pl-1">*</span>}
          </h2>
          <input
            type={type}
            name={name}
            required={options.isRequired}
            className={styles.inputStyle}
          />
        </label>
      );
  }
}
