import { getTotalData, getRecentData } from "@/actions/adminHome";
import { DataCounter } from "./components/home/DataCounter";
import { Chart } from "./components/home/Chart";
import { getTopTracksService, getTracksLast30Days } from "@/shared/server/track/track.service";
import { RecentActivityCard } from "./components/home/RecentActivityCard";
import { getGenreDistribution } from "@/shared/server/genre/genre.service";
import { TopTracksCard } from "./components/home/TopTracksCard";
import { GenreDistributionCard } from "./components/home/GenreDistributionCard";

export default async function Page() {
  const dataCounter = getTotalData();
  const tracksCreated = getTracksLast30Days();
  const recentActivity = getRecentData();
  const topTracks = getTopTracksService();
  const genreDistribution = getGenreDistribution();
  return (
    <main className="w-full h-screen bg-background p-8 flex flex-col gap-8">
      <DataCounter data={dataCounter} />
      <div className="flex w-full gap-8 h-8/10">
        <div className="flex flex-col w-3/5 h-full gap-8">
          <Chart data={tracksCreated} />
          <div className="flex gap-8 flex-1 min-h-0">
            <TopTracksCard data={topTracks} />
            <GenreDistributionCard data={genreDistribution} />
          </div>
        </div>
        <RecentActivityCard data={recentActivity} />
      </div>
    </main>
  );
}
