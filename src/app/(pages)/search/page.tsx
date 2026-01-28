import { fetchSearchData } from "@/shared/client/adapters/fetchSearchData";
import { Results } from "./components/Results";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const params = new URLSearchParams();
  const { q } = await searchParams;
  params.set("q", q);
  const resultsPromise = fetchSearchData(params);
  return (
    <article className="w-full">
      <Results resultsPromise={resultsPromise} />
    </article>
  );
}
