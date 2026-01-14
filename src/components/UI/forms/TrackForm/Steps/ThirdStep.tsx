"use client";
import { OrderAlbumInput } from "@/components/ui/inputs/OrderInAlbumInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { albumAdminApi } from "@/queryFn/admin/albumApi";
import { artistAdminApi } from "@/queryFn/admin/artistApi";
import { useEffect, useState } from "react";

export function ThirdStep({ onChange }: { onChange: (field: any, value: any) => void }) {
  const [artists, setArtists] = useState<any>(null);
  const [artistsId, setArtistsId] = useState<string[]>([]);
  const [albums, setAlbums] = useState<any>(null);
  const [chosenAlbums, setChosenAlbums] = useState<{ [key: string]: string }[]>([]);

  useEffect(() => {
    artistAdminApi.getArtists().then((data: any) => setArtists(data));
  }, []);

  useEffect(() => {
    if (artistsId.length > 0) {
      const params = new URLSearchParams();
      artistsId.forEach((artistsId) => params.append("artists_id", artistsId));
      albumAdminApi.getAlbumsByArtistsId(params.toString()).then((data) => setAlbums(data));
    }
  }, [artistsId]);
  return (
    <section className="p-8 w-full">
      <SelectInput
        data={artists}
        name="artists_id"
        zIndex={50}
        callback={(artists: string[]) => {
          setArtistsId(artists);
          onChange("artists", artists);
        }}
        title="Seleccione artistas"
        options={{ isMultiple: true, sendName: true }}
      />
      <SelectInput
        data={albums}
        name="albums_id"
        zIndex={30}
        title="Seleccione álbumes"
        callback={(_, albums: { [key: string]: string }[]) => setChosenAlbums(albums)}
        options={{ isMultiple: true, sendImage: true }}
      />
      <OrderAlbumInput
        data={chosenAlbums}
        name="order_and_disk"
        zIndex={20}
        title="Seleccione el orden de la cancion en su respectivo álbum:"
        onChange={(val) => onChange("order_and_disk", val)}
      />
    </section>
  );
}
