"use client";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { CustomInput } from "@/components/input/CustomInput";
import { ListElementsInput } from "@/components/input/ListElementsInput";
import { adminQuery } from "@/queryFn";
import { SelectInput } from "@/components/input/SelectInput";
import { OrderAlbumInput } from "@/components/input/OrderInAlbumInput";
import { createAlbumServer } from "@/actions/album";
const initialState = {
  errors: [],
  success: false,
};
export default function Page() {
  const [artists, setArtists] = useState<any>(null);
  const [artistsId, setArtistsId] = useState<string[]>([]);
  const [tracks, setTracks] = useState<any>(null);
  const [tracksChoiceds, setTracksChoiceds] = useState<
    { [key: string]: string }[]
  >([]);

  const [state, formAction] = useActionState(createAlbumServer, initialState);

  useEffect(() => {
    adminQuery()
      .getArtists()
      .then((data) => setArtists(data.data.artists));
  }, []);

  useEffect(() => {
    if (artistsId.length > 0) {
      const params = new URLSearchParams();
      artistsId.forEach((artistsId) => params.append("artists_id", artistsId));
      adminQuery()
        .getTracksByArtistsId(params.toString())
        .then((data) => setTracks(data.data.tracks));
    }
  }, [artistsId]);

  useEffect(() => {
    if (state.success) redirect("/admin");
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="w-[850px] mt-8 rounded-lg border-2 border-[rgba(var(--accent),.4)] p-8 flex flex-col gap-4 text-xs"
    >
      <CustomInputAdminForm
        title="Nombre del álbum:"
        name="name"
        type="text"
        isRequired
      />
      <div className="flex w-full gap-4 justify-between mt-4">
        <CustomInputAdminForm
          title="Imagen del Álbum:"
          name="image"
          type="file"
          isRequired
        />
        <label className="flex flex-col gap-2 w-6/12 ">
          <span className="text-base">Fecha de lanzamiento:</span>

          <input
            type="date"
            name="release_date"
            className="fill-accent date-input text-white rounded-md bg-background border-2 border-content/70 h-10 p-2"
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
        name="artists_id"
        zIndex={50}
        callback={(artists: string[]) => setArtistsId(artists)}
        title="Seleccione artistas"
      />
      <SelectInput
        data={tracks}
        name="tracks_id"
        zIndex={30}
        title="Seleccione canciones"
        callback={(_, tracks: { [key: string]: string }[]) =>
          setTracksChoiceds(tracks)
        }
        isMultiple
      />
      <OrderAlbumInput
        data={tracksChoiceds}
        name="tracks_in_order"
        zIndex={20}
        title="Seleccione canciones"
        isMultiple
      />
      <button
        type="submit"
        className="bg-accent/60 text-content/90 font-normal text-xl rounded-md h-10 hover:bg-accent/80 hover:text-content"
      >
        Ingresar
      </button>
    </form>
  );
}

function CustomInputAdminForm(props: {
  title: string;
  type: "text" | "textarea" | "checkbox" | "file";
  isRequired?: boolean;
  name: string;
  isMultiple?: boolean;
  inBox?: boolean;
}) {
  return (
    <CustomInput
      {...props}
      labelStyle={`${props.inBox ? "flex-col gap-2 w-full" : "flex-col gap-2"}`}
      titleStyle="text-base"
      inputStyle={`w-full bg-background border-2 border-content/70 rounded-md focus-visible:border-accent/90 focus:border-2 outline-none ${
        props.type === "textarea" ? "h-32 py-1 pl-1 text-sm" : "h-8 py-4 pl-1"
      }`}
      previewImageStyle={`${
        props.isMultiple
          ? "h-24 verflow-y-auto w-full grid gap-2 grid-cols-3"
          : "h-22 w-22 flex justify-center"
      }  items-center p-2 o overflow-x-hidden border-2 border-accent/70 rounded-md`}
    />
  );
}
