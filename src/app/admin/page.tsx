export default function Page() {
  return (
    <main className="col-span-full row-span-full flex justify-center items-center">
      <nav className="w-[350px] rounded-lg border-2 border-accent/40 p-8 flex flex-col gap-8">
        <a
          href="/admin/track/create"
          className="text-2xl font-semibold cursor-pointer"
        >
          Agregar Cancion
        </a>
        <a
          href="/admin/album/create"
          className="text-2xl font-semibold cursor-pointer"
        >
          Agregar Album
        </a>
        <a
          href="/admin/artist/create"
          className="text-2xl font-semibold cursor-pointer"
        >
          Agregar Artista
        </a>
      </nav>
    </main>
  );
}
