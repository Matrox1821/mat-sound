import CustomCheckBox from "@components/ui/inputs/customInputs/CustomCheckBox";
import CustomFiles from "@components/ui/inputs/customInputs/CustomFiles";
import CustomTextArea from "@components/ui/inputs/customInputs/CustomTextArea";

interface CustomInputProps {
  title: string;
  name: string;
  value?: any;
  onChange?: (value: any) => void;
  type: "text" | "textarea" | "checkbox" | "file" | "number" | "email" | "password";
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
  value,
  onChange,
}: CustomInputProps) {
  switch (type) {
    case "checkbox":
      return (
        <CustomCheckBox
          styles={styles}
          isRequired={Boolean(options.isRequired)}
          name={name}
          title={title}
          value={value}
          onChange={onChange}
        />
      );
    case "textarea":
      return (
        <CustomTextArea
          styles={styles}
          isRequired={Boolean(options.isRequired)}
          name={name}
          title={title}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );

    case "file":
      return (
        <CustomFiles
          styles={styles}
          options={options}
          name={name}
          title={title}
          onChange={onChange}
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
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </label>
      );
  }
}
