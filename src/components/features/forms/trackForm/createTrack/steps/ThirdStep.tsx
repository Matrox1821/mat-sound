"use client";
import { OrderAlbumInput } from "@components/features/inputs/OrderInAlbumInput";
import { SelectInput } from "@components/features/inputs/SelectInput";
import { albumAdminApi } from "@/queryFn/admin/albumApi";
import { artistAdminApi } from "@/queryFn/admin/artistApi";
import { useEffect, useState } from "react";

interface Element {
  cover?: { sm: string };
  name: string;
  id: string;
  artist?: { name: string };
  [key: string]: any;
}

export function ThirdStep({ onChange }: { onChange: (field: any, value: any) => void }) {
  const [artists, setArtists] = useState<any>(null);
  const [artistsId, setArtistsId] = useState<string[]>([]);
  const [albums, setAlbums] = useState<any>(null);
  const [chosenAlbums, setChosenAlbums] = useState<Element[]>([]);

  useEffect(() => {
    artistAdminApi.getArtists().then((data: any) => setArtists(data));
  }, []);

  useEffect(() => {
    if (artistsId.length > 0) {
      albumAdminApi.getAlbumsByArtistsId(artistsId).then((data) => setAlbums(data));
    }
  }, [artistsId]);
  return (
    <section className="p-8 w-full">
      <SelectInput
        data={artists}
        name="artistsId"
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
        name="albumsId"
        zIndex={30}
        title="Seleccione álbumes"
        callback={(_, albums: { [key: string]: string }[]) => {
          const parsedAlbums: Element[] = albums.map((album) => ({
            id: album.id,
            name: album.name,
          }));

          setChosenAlbums(parsedAlbums);
        }}
        options={{ isMultiple: true, sendName: true }}
      />
      <OrderAlbumInput
        data={chosenAlbums}
        name="orderAndDisk"
        zIndex={20}
        title="Seleccione el orden de la cancion en su respectivo álbum:"
        onChange={(val) => onChange("orderAndDisk", val)}
      />
    </section>
  );
}
