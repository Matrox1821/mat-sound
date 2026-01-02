interface CustomTextArea {
  styles: { labelStyle?: string; titleStyle?: string; inputStyle?: string };
  title: string;
  name: string;
  isRequired: boolean;
  value?: any;
  onChange?: (value: any) => void;
}
export default function CustomTextArea({
  styles,
  title,
  name,
  isRequired,
  value,
  onChange,
}: CustomTextArea) {
  return (
    <label className={`${styles.labelStyle} flex`}>
      <h2 className={styles.titleStyle}>
        {title}
        {isRequired && <span className="text-red-400 pl-1">*</span>}
      </h2>
      <textarea
        name={name}
        required={isRequired}
        className={styles.inputStyle}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
