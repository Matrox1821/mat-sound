interface CustomCheckBox {
  styles: { labelStyle?: string; titleStyle?: string; inputStyle?: string };
  title: string;
  name: string;
  isRequired: boolean;
}
export default function CustomCheckBox({
  styles,
  title,
  name,
  isRequired,
}: CustomCheckBox) {
  return (
    <label className={`${styles.labelStyle} inline-flex`}>
      <div className={`flex w-full items-center gap-6 text`}>
        <h2 className={styles.titleStyle}>
          {title}
          {isRequired && <span className="text-red-400 pl-1">*</span>}
        </h2>
        <input
          type="checkbox"
          name={name}
          required={isRequired}
          className={`!w-5 ${styles.inputStyle}`}
        />
      </div>
    </label>
  );
}
