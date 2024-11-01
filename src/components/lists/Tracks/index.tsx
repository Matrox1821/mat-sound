// SongList.tsx
import React, { Suspense } from "react";

// Este componente carga y muestra cada canción
const List = React.lazy(() => import("./List"));

export default function Tracks() {
  return (
    <Suspense fallback={<div>Loading songs...</div>}>
      <List type="c" />
    </Suspense>
  );
}
