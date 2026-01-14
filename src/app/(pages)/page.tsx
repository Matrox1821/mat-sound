import Carousel from "@/components/ui/carousels";

export default async function Home() {
  return (
    <section
      className={`flex flex-col gap-12 w-full h-full overflow-y-auto overflow-x-hidden md:pt-8 md:bg-background md:transition-[heigth] md:duration-200 lg:pt-24 lg:pl-18`}
    >
      <Carousel title="Canciones" options={{ type: ["tracks"] }} />
      <Carousel title="Artistas" options={{ type: ["artists"] }} />
      <Carousel title="Albumes" options={{ type: ["albums"] }} />
      <Carousel title="Albumes y canciones" options={{ type: ["albums", "tracks"] }} />
      <Carousel title="Recomendaciones" options={{ type: ["albums", "tracks", "artists"] }} />
    </section>
  );
}
