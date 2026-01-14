import CustomInputAdminForm from "@/components/ui/inputs/CustomInputAdminForm";
export function FirstStep({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
}) {
  return (
    <section className="p-8 w-full">
      <div className="flex w-full gap-4 justify-between mt-8 flex-col">
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
            isRequired
          />
          <CustomInputAdminForm
            title="Portada principal:"
            name="main_cover"
            type="file"
            value={formData.main_cover}
            onChange={(val: any) => onChange("main_cover", val)}
            isRequired
          />
        </div>
      </div>
    </section>
  );
}
