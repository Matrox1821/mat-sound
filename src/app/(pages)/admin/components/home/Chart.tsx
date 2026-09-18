"use client";

import dynamic from "next/dynamic";

export const description = "A linear area chart";

const ChartContent = dynamic(() => import("./ChartContent").then((mod) => mod.ChartContent), {
  ssr: false,
  loading: () => (
    <div className="bg-background-900 rounded-xl p-6 h-[250px] flex items-center justify-center text-sm text-content-900/60">
      Cargando gráfico…
    </div>
  ),
});

export function Chart({
  data,
}: {
  data: Promise<{ day: string; month: string; monthIndex: number; tracks: number }[]>;
}) {
  return <ChartContent data={data} />;
}
