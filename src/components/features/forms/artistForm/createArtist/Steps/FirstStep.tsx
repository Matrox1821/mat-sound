import CustomInputAdminForm from "@components/features/inputs/CustomInputAdminForm";
export function FirstStep({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
}) {
  return (
    <section className="p-4 w-full">
      <div className="flex w-full gap-4 justify-between flex-col">
        <CustomInputAdminForm
          title="Nombre del artista:"
          name="name"
          type="text"
          value={formData.name}
          onChange={(val: any) => onChange("name", val)}
          isRequired
        />
        <div className="flex w-full gap-4 justify-between mt-8">
          <CustomInputAdminForm
            title="Avatar:"
            name="avatar"
            type="file"
            value={formData.avatar}
            onChange={(val: any) => onChange("avatar", val)}
          />
          <CustomInputAdminForm
            title="Portada principal:"
            name="mainCover"
            type="file"
            value={formData.mainCover}
            onChange={(val: any) => onChange("mainCover", val)}
          />
        </div>
      </div>
    </section>
  );
}
