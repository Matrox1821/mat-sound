import { Results } from "../components/Results";
import { searchAction } from "@/actions/search";

export default async function SearchTracksPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const resultsPromise = searchAction(q, "tracks");
  return (
    <section className="h-10/12 overflow-y-scroll ">
      <Results resultsPromise={resultsPromise} />
    </section>
  );
}
