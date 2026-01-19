import CustomInputAdminForm from "@/components/features/inputs/CustomInputAdminForm";
export function FirstStep({
  formData,
  onChange,
  cover,
  song,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
  cover?: string;
  song?: string | null;
}) {
  return (
    <section className="p-4 w-full flex flex-col gap-12">
      <CustomInputAdminForm
        title="Nombre de la Canción:"
        name="name"
        type="text"
        value={formData.name}
        onChange={(val: any) => onChange("name", val)}
        isRequired
      />
      <div className="flex w-full gap-4 justify-between ">
        <CustomInputAdminForm
          title="Imagen de la Canción:"
          name="cover"
          type="file"
          value={formData.cover}
          onChange={(val: any) => onChange("cover", val)}
          defaultImage={cover}
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
            defaultAudio={song}
          />
        </div>
      </div>
    </section>
  );
}
