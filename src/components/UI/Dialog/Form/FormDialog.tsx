"use client";
import { Button } from "primereact/button";
import { Dialog as PrimeReactDialog } from "primereact/dialog";
import { useState } from "react";
import { TrackForm } from "../../Form/TrackForm";
import { GenreForm } from "../../Form/GenreForm";
import { ArtistForm } from "../../Form/ArtistForm";
import { AlbumForm } from "../../Form/AlbumForm";

export function FormDialog({
  data,
  type,
}: {
  data?: Promise<{ name: string; id: string }[] | undefined>;
  type: "artist" | "album" | "track" | "genre";
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button label="Crear" icon="pi pi-plus" onClick={() => setVisible(true)} />
      <PrimeReactDialog
        className="!border-0"
        visible={visible}
        modal
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        content={({ hide }) => (
          <div
            className="flex flex-column p-3 gap-4 bg-background-900"
            style={{
              borderRadius: "12px",
            }}
          >
            {type === "artist" && <ArtistForm hide={hide} />}
            {type === "album" && <AlbumForm hide={hide} />}
            {type === "genre" && <GenreForm hide={hide} />}
            {type === "track" && data && <TrackForm hide={hide} genres={data} />}
          </div>
        )}
      ></PrimeReactDialog>
    </div>
  );
}
