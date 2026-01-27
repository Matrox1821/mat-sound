import { fetchSearchData } from "@/shared/client/adapters/fetchSearchData";
import Results from ".@components/Results";

export default async function SearchArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const params = new URLSearchParams();
  const { q } = await searchParams;
  params.set("q", q);
  const resultsPromise = fetchSearchData(params, "artists");
  return (
    <article>
      <Results resultsPromise={resultsPromise} />
    </article>
  );
}
