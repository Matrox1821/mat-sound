import CustomInputAdminForm from "@components/features/inputs/CustomInputAdminForm";
export function FirstStep({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
}) {
  return (
    <section className="p-8 w-full">
      <CustomInputAdminForm
        title="Nombre de la Canción:"
        name="name"
        type="text"
        value={formData.name}
        onChange={(val: any) => onChange("name", val)}
        isRequired
      />
      <div className="flex w-full gap-4 justify-between mt-8">
        <CustomInputAdminForm
          title="Imagen de la Canción:"
          name="cover"
          type="file"
          value={formData.cover}
          onChange={(val: any) => onChange("cover", val)}
        />
        <div className="w-5/12 h-12">
          <CustomInputAdminForm
            title="Audio de la Canción:"
            isAudio
            name="song"
            type="file"
            value={formData.song}
            onChange={(val: any) => onChange("song", val)}
            isRequired
          />
        </div>
      </div>
    </section>
  );
}
