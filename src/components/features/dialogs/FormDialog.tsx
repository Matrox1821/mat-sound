"use client";
import { Button } from "primereact/button";
import { Dialog as PrimeReactDialog } from "primereact/dialog";
import { ReactNode, useState } from "react";
import { CreateTrackForm } from "../forms/trackForm/createTrack";
import { CreateGenreForm } from "../forms/genreForm";
import { CreateArtistForm } from "../forms/artistForm/createArtist";
import { CreateAlbumForm } from "../forms/albumForm/createAlbum";

export function FormDialog({
  data,
  type,
  children,
  newButton,
}: {
  data?: Promise<{ name: string; id: string }[] | null>;
  type?: "artist" | "album" | "track" | "genre";
  children?: ReactNode;
  newButton?: { buttonStyle?: string; buttonImage?: ReactNode; buttonLabel?: string };
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {newButton ? (
        <button className={newButton.buttonStyle} onClick={() => setVisible(true)} type="button">
          {newButton.buttonImage}
          {newButton.buttonLabel}
        </button>
      ) : (
        <Button label="Crear" icon="pi pi-plus" onClick={() => setVisible(true)} type="button" />
      )}

      <PrimeReactDialog
        className="!border-0"
        visible={visible}
        modal
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        content={() => (
          <div
            className="flex flex-col items-end p-3 gap-4 bg-background-950"
            style={{
              borderRadius: "12px",
            }}
          >
            <button
              className="h-8 w-8 rounded-full flex items-center justify-center bg-background-800 hover:bg-background-800/70 cursor-pointer"
              onClick={() => setVisible(false)}
              type="button"
            >
              <i className="pi pi-times"></i>
            </button>

            {type === "artist" && <CreateArtistForm />}
            {type === "album" && <CreateAlbumForm />}
            {type === "genre" && <CreateGenreForm />}
            {type === "track" && data && <CreateTrackForm genres={data} />}
            {children && (
              <div className="p-4 border border-background-100/20 rounded-lg">{children}</div>
            )}
          </div>
        )}
      ></PrimeReactDialog>
    </div>
  );
}
