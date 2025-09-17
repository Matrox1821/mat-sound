import Carousel from "@/components/UI/Carousel";

export default async function Home() {
  return (
    <section
      className={`w-full h-full overflow-y-auto overflow-x-hidden md:pt-8 md:bg-background md:transition-[heigth] md:duration-200`}
    >
      <Carousel title="Canciones" options={{ type: ["tracks"] }} />
      <Carousel title="Artistas" options={{ type: ["artists"] }} />
      <Carousel title="Albumes" options={{ type: ["albums"] }} />
      <Carousel title="Albumes y canciones" options={{ type: ["albums", "tracks"] }} />
      <Carousel title="Recomendaciones" options={{ type: ["albums", "tracks", "artists"] }} />
    </section>
  );
}
