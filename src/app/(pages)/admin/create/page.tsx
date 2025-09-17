"use client";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { ListElementsInput } from "@/components/UI/Inputs/ListElementsInput";
import { SelectInput } from "@/components/UI/Inputs/SelectInput";
import { OrderAlbumInput } from "@/components/UI/Inputs/OrderInAlbumInput";
import { createAlbumServer } from "@/actions/album";
import CustomInputAdminForm from "@/components/UI/Inputs/CustomInputAdminForm";
import { getArtists, getTracksByArtistsId } from "@/queryFn/admin";
const initialState = {
  errors: [],
  success: false,
};
export default function Page() {
  const [artists, setArtists] = useState<any>(null);
  const [artistsId, setArtistsId] = useState<string[]>([]);
  const [tracks, setTracks] = useState<any>(null);
  const [tracksChoiceds, setTracksChoiceds] = useState<{ [key: string]: string }[]>([]);

  const [state, formAction] = useActionState(createAlbumServer, initialState);

  useEffect(() => {
    getArtists().then((data) => setArtists(data.data.artists));
  }, []);

  useEffect(() => {
    if (artistsId.length > 0) {
      const params = new URLSearchParams();
      artistsId.forEach((artistsId) => params.append("artists_id", artistsId));
      getTracksByArtistsId(params.toString()).then((data) => setTracks(data.data.tracks));
    }
  }, [artistsId]);

  useEffect(() => {
    if (state.success) redirect("/admin");
  }, [state.success]);

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <form
        action={formAction}
        className="w-[850px] mt-8 rounded-lg border-2 border-accent-400 p-8 flex flex-col gap-4 text-xs"
      >
        <CustomInputAdminForm title="Nombre del álbum:" name="name" type="text" isRequired />
        <div className="flex w-full gap-4 justify-between mt-4">
          <CustomInputAdminForm title="Imagen del Álbum:" name="image" type="file" isRequired />
          <label className="flex flex-col gap-2 w-6/12 ">
            <span className="text-base">Fecha de lanzamiento:</span>
            <input
              type="date"
              name="release_date"
              className="fill-accent-950 date-input text-white rounded-md bg-background-950 border-2 border-content-700 h-10 p-2"
              required
            />
          </label>
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <h2 className="text-base">Copyright:</h2>
          <ListElementsInput name="copyright" />
        </div>
        <SelectInput
          data={artists}
          name="artists"
          zIndex={50}
          callback={(artists: string[]) => setArtistsId(artists)}
          title="Seleccione artistas"
          options={{ sendName: true, isRequired: true }}
        />
        <SelectInput
          data={tracks}
          name="tracks_id"
          zIndex={30}
          title="Seleccione canciones"
          callback={(_, tracks: { [key: string]: string }[]) => setTracksChoiceds(tracks)}
          options={{ isMultiple: true }}
        />
        <OrderAlbumInput
          data={tracksChoiceds}
          name="tracks_in_order"
          zIndex={20}
          title="Seleccione canciones"
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
