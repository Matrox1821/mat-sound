"use client";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { ListElementsInput } from "@/components/UI/Inputs/ListElementsInput";
import { SelectInput } from "@/components/UI/Inputs/SelectInput";
import { OrderAlbumInput } from "@/components/UI/Inputs/OrderInAlbumInput";
import { createTrackServer } from "@/actions/track";
import CustomInputAdminForm from "@/components/UI/Inputs/CustomInputAdminForm";
import { getAlbumsByArtistsId, getArtists } from "@/queryFn/admin";
const initialState = {
  errors: [],
  success: false,
};
export default function Page() {
  const [artists, setArtists] = useState<any>(null);
  const [artistsId, setArtistsId] = useState<string[]>([]);
  const [albums, setAlbums] = useState<any>(null);
  const [chosenAlbums, setChosenAlbums] = useState<{ [key: string]: string }[]>([]);
  const [state, formAction] = useActionState(createTrackServer, initialState);

  useEffect(() => {
    getArtists().then((data) => setArtists(data.data.artists));
  }, []);

  useEffect(() => {
    if (artistsId.length > 0) {
      const params = new URLSearchParams();
      artistsId.forEach((artistsId) => params.append("artists_id", artistsId));
      getAlbumsByArtistsId(params.toString()).then((data) => setAlbums(data.data.albums));
    }
  }, [artistsId]);

  useEffect(() => {
    if (state.success) redirect("/admin");
  }, [state.success]);

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <form
        action={formAction}
        className="w-[850px] h-[750px] rounded-lg border-2 border-accent-400 p-8 flex flex-col gap-4 text-xs overflow-auto"
      >
        <CustomInputAdminForm title="Nombre de la Canción:" name="name" type="text" isRequired />
        <div className="flex w-full gap-4 justify-between mt-8">
          <CustomInputAdminForm title="Imagen de la Canción:" name="image" type="file" />
          <div className="w-5/12 h-12">
            <CustomInputAdminForm
              title="Audio de la Canción:"
              isAudio
              name="song"
              type="file"
              isRequired
            />
          </div>
        </div>

        <div className="flex w-full gap-4 justify-between mt-4">
          <div className="flex flex-col gap-2 relative w-full">
            <h2 className="text-base">Copyright:</h2>
            <ListElementsInput name="copyright" />
          </div>
          <label className="flex flex-col gap-2 w-6/12 ">
            <span className="text-base">Fecha de lanzamiento:</span>

            <input
              type="date"
              name="release_date"
              className="fill-accent-950 date-input text-white rounded-md bg-background-950 border-2 border-content-700 h-9 p-2"
              required
            />
          </label>
        </div>

        <div className="flex w-full gap-4">
          <CustomInputAdminForm
            title="Duracion de cancion en segundos:"
            name="duration"
            type="number"
            isRequired
            inBox
          />
          <CustomInputAdminForm
            title="Cantidad de reproducciones:"
            name="reproductions"
            type="number"
            inBox
            isRequired
          />
        </div>

        <SelectInput
          data={artists}
          name="artists_id"
          zIndex={50}
          callback={(artists: string[]) => setArtistsId(artists)}
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
          name="order_in_album"
          zIndex={20}
          title="Seleccione el orden de la cancion en su respectivo álbum:"
        />
        <button
          type="submit"
          className="bg-accent-600 text-content-900 font-normal text-xl rounded-md h-10 hover:bg-accent-800 hover:text-content-950"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
