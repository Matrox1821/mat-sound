import CustomInputAdminForm from "@/components/features/inputs/CustomInputAdminForm";
export function FirstStep({
  formData,
  onChange,
  avatar,
  mainCover,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
  avatar?: string;
  mainCover?: string | null;
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
            defaultImage={avatar}
            isRequired
            disabled={false}
          />
          <CustomInputAdminForm
            title="Portada principal:"
            name="mainCover"
            type="file"
            value={formData.mainCover}
            onChange={(val: any) => onChange("mainCover", val)}
            isRequired
            defaultImage={mainCover || ""}
            disabled={false}
          />
        </div>
      </div>
    </section>
  );
}
