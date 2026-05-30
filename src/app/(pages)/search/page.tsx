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
    <section className="w-full overflow-y-auto mb-6 pr-2">
      <Results resultsPromise={resultsPromise} />
    </section>
  );
}
