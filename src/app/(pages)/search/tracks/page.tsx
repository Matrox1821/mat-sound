import { fetchSearchData } from "@/shared/client/adapters/fetchSearchData";
import { Results } from "../components/Results";

export default async function SearchTracksPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const params = new URLSearchParams();
  const { q } = await searchParams;
  params.set("q", q);
  const resultsPromise = fetchSearchData(params, "tracks");
  return (
    <section className="h-10/12 overflow-y-scroll ">
      <Results resultsPromise={resultsPromise} />
    </section>
  );
}
