import { OrderAlbumInput } from "@/components/UI/Inputs/OrderInAlbumInput";
import { SelectInput } from "@/components/UI/Inputs/SelectInput";
import { artistAdminApi } from "@/queryFn/admin/artistApi";
import { trackAdminApi } from "@/queryFn/admin/trackApi";
import { useEffect, useState } from "react";

export function SecondStep({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
}) {
  const [artists, setArtists] = useState<any>(null);
  const [artistsId, setArtistsId] = useState<string[]>([]);

  const [tracks, setTracks] = useState<any>(null);
  const [selectedTracks, setSelectedTracks] = useState<{ [key: string]: string }[]>([]);
  useEffect(() => {
    artistAdminApi.getArtists().then((data) => setArtists(data));
  }, []);

  useEffect(() => {
    if (artistsId.length > 0) {
      const params = new URLSearchParams();
      artistsId.forEach((artistsId) => params.set("artists_id", artistsId));
      trackAdminApi.getTracksByArtistsId(params.toString()).then((data) => {
        setTracks(data);
      });
    }
  }, [artistsId]);

  return (
    <section className="p-8 w-full">
      <div className="flex w-full gap-4 justify-between mt-4 flex-col overflow-auto max-h-[600px]">
        <SelectInput
          data={artists}
          name="artists"
          zIndex={50}
          callback={(artists: string[]) => {
            onChange("artists", artists);
            setArtistsId(artists);
          }}
          title="Seleccione artistas"
          options={{ sendName: true, isRequired: true, isMultiple: true }}
        />
        <SelectInput
          data={tracks}
          name="tracks_id"
          zIndex={30}
          title="Seleccione canciones"
          callback={(_, tracks: { [key: string]: string }[]) => {
            setSelectedTracks(tracks);
          }}
          options={{ isMultiple: true }}
        />
        <OrderAlbumInput
          data={selectedTracks}
          name="orders_in_album"
          zIndex={20}
          title="Seleccione canciones"
          value={formData.orders_in_album}
          onChange={(val) => onChange("orders_in_album", val)}
        />
      </div>
    </section>
  );
}
