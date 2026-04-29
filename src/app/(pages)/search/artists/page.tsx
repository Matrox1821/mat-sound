import { Results } from "../components/Results";
import { searchAction } from "@/actions/search";

export default async function SearchArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const resultsPromise = searchAction(q, "artists");
  return (
    <article>
      <Results resultsPromise={resultsPromise} />
    </article>
  );
}
