interface CustomTextArea {
  styles: { labelStyle?: string; titleStyle?: string; inputStyle?: string };
  title: string;
  name: string;
  isRequired: boolean;
  value?: any;
  onChange?: (value: any) => void;
  defaultValue?: string;
  disabled?: boolean;
}
export function CustomTextArea({
  styles,
  title,
  name,
  isRequired,
  value,
  onChange,
  defaultValue,
  disabled = false,
}: CustomTextArea) {
  return (
    <label className={`${styles.labelStyle} flex`}>
      <h2 className={styles.titleStyle}>
        {title}
        {isRequired && <span className="text-red-400 pl-1">*</span>}
      </h2>
      <textarea
        defaultValue={defaultValue}
        name={name}
        required={isRequired}
        className={styles.inputStyle}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  );
}
