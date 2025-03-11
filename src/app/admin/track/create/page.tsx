"use client";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { CustomInput } from "@/components/input/CustomInput";
import { ListElementsInput } from "@/components/input/ListElementsInput";
import { adminQuery } from "@/queryFn";
import { SelectInput } from "@/components/input/SelectInput";
import { OrderAlbumInput } from "@/components/input/OrderInAlbumInput";
import { createTrackServer } from "@/actions/track";
const initialState = {
  errors: [],
  success: false,
};
export default function Page() {
  const [artists, setArtists] = useState<any>(null);
  const [artistsId, setArtistsId] = useState<string[]>([]);
  const [albums, setAlbums] = useState<any>(null);
  const [chosenAlbums, setChosenAlbums] = useState<{ [key: string]: string }[]>(
    []
  );
  const [state, formAction] = useActionState(createTrackServer, initialState);

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
        .getAlbumsByArtistsId(params.toString())
        .then((data) => setAlbums(data.data.albums));
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
        title="Nombre de la Canción:"
        name="name"
        type="text"
        isRequired
      />
      <div className="flex w-full gap-4 justify-between mt-8">
        <CustomInputAdminForm
          title="Imagen de la Canción:"
          name="image"
          type="file"
        />
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
            className="fill-accent date-input text-white rounded-md bg-background border-2 border-content/70 h-9 p-2"
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
        isMultiple
      />
      <SelectInput
        data={albums}
        name="albums_id"
        sendImage
        zIndex={30}
        title="Seleccione álbumes"
        callback={(_, albums: { [key: string]: string }[]) =>
          setChosenAlbums(albums)
        }
        isMultiple
      />
      <OrderAlbumInput
        data={chosenAlbums}
        name="order_in_album"
        zIndex={20}
        title="Seleccione el orden de la cancion en su respectivo álbum:"
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
  type: "text" | "textarea" | "checkbox" | "file" | "number";
  isRequired?: boolean;
  isAudio?: boolean;
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
