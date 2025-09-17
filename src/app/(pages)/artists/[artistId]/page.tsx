import Background from "@/components/Layout/Background";
import Cover from "@/components/Layout/Cover";
import NewArtistTrack from "@/components/UI/Cards/NewArtistTrack";
import Carousell from "@/components/UI/Carousel";
import PopularTracks from "@/components/UI/List/PopularTracks";
import Image from "next/image";
import getArtist from "@/hooks/db/useArtist";
import { Skeleton } from "primereact/skeleton";

export default async function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = await params;
  const { artist } = await getArtist(artistId);

  if (!artist) return null;

  return (
    <section className="w-full z-20 h-full flex flex-col md:relative md:bg-background-950 md:transition-[heigth] md:duration-200 overflow-y-auto focus-visible:outline-0">
      <figure className="w-full h-[calc(1/2*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center object-cover">
        {artist.pageCover ? (
          <Image
            src={artist.pageCover}
            alt={artist.name}
            width={2160}
            height={1080}
            className="opacity-80 object-cover w-full h-full"
          />
        ) : (
          <Skeleton width="100%" height="100%" borderRadius="0" />
        )}
      </figure>

      <div className="absolute z-30 top-0 left-0 w-full flex flex-col focus:none">
        <Cover artist={artist} />
        <Background image={artist.pageCover}>
          <div className="flex gap-8 w-full">
            <PopularTracks artistId={artist.id} />
            <NewArtistTrack
              artistId={artist.id}
              artistImage={artist.image}
              artistName={artist.name}
            />
          </div>
          <Carousell
            title="Álbumes"
            options={{ type: ["albums"] }}
            filter={{ type: "artists", id: artist.id }}
          />
        </Background>
      </div>
    </section>
  );
}
