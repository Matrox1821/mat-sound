import { Results } from "./components/Results";
import { searchAction } from "@/actions/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const resultsPromise = searchAction(q);
  return (
    <article className="w-full overflow-y-auto mb-10 pr-2">
      <Results resultsPromise={resultsPromise} />
    </article>
  );
}
