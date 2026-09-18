"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";

const CHART_COLOR = "#3b82f6";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { day: string; month: string } }[];
}) {
  if (!active || !payload?.length) return null;

  const { day, month } = payload[0].payload;

  return (
    <div className="bg-background text-content-900/90 shadow-md text-sm py-1.5 px-3 rounded-sm">
      <div className="text-content-900/60 mb-0.5">
        {day} de {month}
      </div>
      <span style={{ fontWeight: 600 }}>{payload[0].value}</span>
      <span className="ml-1 text-content-900/60">canciones agregadas</span>
    </div>
  );
}

function CustomXTick({ x, y, payload, data, chartWidth }: any) {
  const item = data[payload.index];
  if (!item) return null;

  const isFirstOfMonth =
    payload.index === 0 || data[payload.index - 1]?.monthIndex !== item.monthIndex;

  const isLastOfMonth =
    payload.index === data.length - 1 || data[payload.index + 1]?.monthIndex !== item.monthIndex;

  const monthDays = data.filter((d: any) => d.monthIndex === item.monthIndex);
  const monthStartIndex = data.findIndex((d: any) => d.monthIndex === item.monthIndex);
  const isMiddleOfMonth = payload.index === monthStartIndex + Math.floor(monthDays.length / 2);
  const isOnlyDay = monthDays.length === 1;

  const tickWidth = chartWidth / data.length;
  const monthWidth = monthDays.length * tickWidth;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="#9ca3af" fontSize={11}>
        {item.day}
      </text>

      {isOnlyDay && <line x1={0} y1={16} x2={0} y2={28} stroke="#4b5563" strokeWidth={1} />}

      {isFirstOfMonth && !isOnlyDay && (
        <>
          <line x1={0} y1={16} x2={0} y2={24} stroke="#4b5563" strokeWidth={1} />
          {isFirstOfMonth && !isOnlyDay && (
            <>
              <line x1={0} y1={16} x2={0} y2={24} stroke="#4b5563" strokeWidth={1} />
              <line
                x1={0}
                y1={24}
                x2={monthWidth - tickWidth - 3}
                y2={24}
                stroke="#4b5563"
                strokeWidth={1}
              />
            </>
          )}
        </>
      )}

      {isLastOfMonth && !isOnlyDay && (
        <line x1={0} y1={16} x2={0} y2={24} stroke="#4b5563" strokeWidth={1} />
      )}

      {isMiddleOfMonth && (
        <text x={0} y={38} textAnchor="middle" fill="#6b7280" fontSize={11}>
          {item.month.slice(0, 3)}
        </text>
      )}
    </g>
  );
}

function niceStep(roughStep: number) {
  const pow10 = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const candidates = [1, 2, 5, 10];
  for (const c of candidates) {
    if (roughStep <= c * pow10) return c * pow10;
  }
  return 10 * pow10;
}

export function ChartContent({
  data,
}: {
  data: Promise<{ day: string; month: string; monthIndex: number; tracks: number }[]>;
}) {
  const chartData = use(data);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setChartWidth(entry.contentRect.width);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { yDomain, yTicks } = useMemo(() => {
    const maxValue = Math.max(0, ...chartData.map((d) => d.tracks ?? 0));
    const minCeiling = 5;
    const ceiling = Math.max(minCeiling, maxValue);

    const step = niceStep(ceiling / 5);
    const roundedMax = Math.ceil(ceiling / step) * step;

    const ticks: number[] = [];
    for (let v = 0; v <= roundedMax; v += step) ticks.push(v);

    return { yDomain: [0, roundedMax] as [number, number], yTicks: ticks };
  }, [chartData]);

  return (
    <div className="bg-background-900 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="m-0 text-lg font-semibold text-content-900/90">
          Tendencias de Crecimiento del Catálogo
        </h3>
      </div>

      <div className="w-full h-[250px] min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="flex items-start"
          ref={containerRef}
        >
          <AreaChart data={chartData} margin={{ left: -36, right: 12, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="desktopGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid className="stroke-background" />
            <XAxis
              dataKey="day"
              tickMargin={8}
              tick={<CustomXTick data={chartData} chartWidth={chartWidth} />}
              height={60}
              tickLine={{ stroke: "black", strokeWidth: 2 }}
            />
            <YAxis
              dataKey="tracks"
              domain={yDomain}
              ticks={yTicks}
              allowDecimals={false}
              tickMargin={5}
              tick={{ fontSize: 12, fill: "var(--chart-axis-color, #9ca3af)" }}
              tickFormatter={(v: any) => v}
              axisLine={{ stroke: "black", strokeWidth: 2 }}
              tickLine={{ stroke: "black", strokeWidth: 2 }}
            />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Area
              dataKey="tracks"
              type="linear"
              fill="url(#desktopGradient)"
              stroke={CHART_COLOR}
              strokeWidth={2}
              dot={{ r: 4, fill: CHART_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: CHART_COLOR, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
