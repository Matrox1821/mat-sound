interface CustomTextArea {
  styles: { labelStyle?: string; titleStyle?: string; inputStyle?: string };
  title: string;
  name: string;
  isRequired: boolean;
}
export default function CustomTextArea({
  styles,
  title,
  name,
  isRequired,
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
      />
    </label>
  );
}
