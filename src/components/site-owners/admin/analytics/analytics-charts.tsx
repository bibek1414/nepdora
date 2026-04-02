"use client";

import React from "react";
import { Chart } from "chart.js/auto";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsStats, DailyStat } from "@/types/owner-site/admin/stats";

interface AnalyticsChartsProps {
  data?: AnalyticsStats;
  isLoading?: boolean;
}

// Status badge color map
const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-500",
  pending: "bg-amber-400",
  processing: "bg-blue-500",
  cancelled: "bg-red-400",
  delivered: "bg-teal-500",
  shipped: "bg-indigo-400",
};

export default function AnalyticsCharts({
  data,
  isLoading,
}: AnalyticsChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  const totalOrders = data?.orders || 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Sales Trend — full-width left column */}
      <div className="overflow-hidden rounded-xl border border-black/7 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:col-span-2">
        <div className="flex items-center justify-between border-b border-black/6 px-6 py-4">
          <div>
            <p className="text-[15px] font-semibold text-gray-900">
              Sales Trend
            </p>
            <p className="text-[13px] text-gray-500">
              Revenue and orders over time
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
              <span className="text-[12px] font-medium text-gray-500">
                Revenue
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0 w-4 border-t-2 border-dashed border-violet-500" />
              <span className="text-[12px] font-medium text-gray-500">
                Orders
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-5">
          <TrendChart dailyStats={data?.daily_stats || []} />
        </div>
      </div>

      {/* Right column: Channel + Status */}
      <div className="flex flex-col gap-6">
        {/* Channel Distribution */}
        <div className="rounded-xl border border-black/7 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="mb-4 text-[15px] font-semibold text-gray-900">
            Order Channels
          </p>
          <div className="flex flex-col gap-4">
            {data?.channel_distribution.map((item, i) => {
              const pct = Math.round((item.count / totalOrders) * 100);
              const isPos = item.pos_order;
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${isPos ? "bg-orange-400" : "bg-blue-500"}`}
                      />
                      <span className="font-medium text-gray-700">
                        {isPos ? "POS" : "Online"}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {pct}%
                      <span className="ml-1 font-normal text-gray-400">
                        ({item.count})
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isPos ? "bg-orange-400" : "bg-blue-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Rs. {item.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
            {(!data?.channel_distribution ||
              data.channel_distribution.length === 0) && (
              <p className="text-[13px] text-gray-400">No data available</p>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="rounded-xl border border-black/7 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="mb-4 text-[15px] font-semibold text-gray-900">
            Order Status
          </p>
          <div className="flex flex-col gap-3">
            {data?.status_distribution.map((item, i) => {
              const pct = Math.round((item.count / totalOrders) * 100);
              const barColor =
                STATUS_COLORS[item.status.toLowerCase()] ?? "bg-slate-400";
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium capitalize text-gray-700">
                      {item.status}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {pct}%
                      <span className="ml-1 font-normal text-gray-400">
                        ({item.count})
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Rs. {item.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
            {(!data?.status_distribution ||
              data.status_distribution.length === 0) && (
              <p className="text-[13px] text-gray-400">No data available</p>
            )}
          </div>
        </div>

        {/* Top Cities */}
        {data?.top_cities && data.top_cities.length > 0 && (
          <div className="rounded-xl border border-black/7 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="mb-4 text-[15px] font-semibold text-gray-900">
              Top Cities
            </p>
            <div className="flex flex-col gap-3">
              {(() => {
                const maxCount = data.top_cities[0]?.count || 1;
                return data.top_cities.map((item, i) => {
                  const barPct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-medium text-gray-700">
                          {item.city}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {item.count}
                          <span className="ml-1 font-normal text-gray-400">
                            order{item.count !== 1 ? "s" : ""}
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-indigo-400 transition-all duration-700"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400">
                        Rs. {item.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrendChart({ dailyStats }: { dailyStats: DailyStat[] }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const chartRef = React.useRef<Chart | null>(null);

  React.useEffect(() => {
    if (!canvasRef.current || !dailyStats.length) return;

    const gridColor = "rgba(0,0,0,0.05)";
    const labelColor = "#94a3b8";

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: dailyStats.map(d =>
          new Date(d.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        ),
        datasets: [
          {
            label: "Revenue",
            data: dailyStats.map(d => d.revenue),
            yAxisID: "yRev",
            borderColor: "#3b82f6",
            backgroundColor: (ctx: any) => {
              const { ctx: c, chartArea } = ctx.chart;
              if (!chartArea) return "rgba(59,130,246,0.08)";
              const grad = c.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );
              grad.addColorStop(0, "rgba(59,130,246,0.18)");
              grad.addColorStop(1, "rgba(59,130,246,0)");
              return grad;
            },
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            fill: "origin",
            tension: 0.4,
          },
          {
            label: "Orders",
            data: dailyStats.map(d => d.orders),
            yAxisID: "yOrd",
            borderColor: "#8b5cf6",
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: "#8b5cf6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#ffffff",
            borderColor: "rgba(0,0,0,0.08)",
            borderWidth: 1,
            titleColor: "#1e293b",
            bodyColor: "#64748b",
            padding: 10,
            callbacks: {
              label: (ctx: any) => {
                if (ctx.dataset.label === "Revenue")
                  return ` Rs. ${ctx.parsed.y.toLocaleString()}`;
                return ` ${ctx.parsed.y} orders`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: labelColor, font: { size: 11 }, maxRotation: 0 },
            border: { display: false },
          },
          yRev: {
            position: "left",
            grid: { color: gridColor },
            ticks: {
              color: labelColor,
              font: { size: 11 },
              callback: (v: string | number) => {
                const n = typeof v === "string" ? parseFloat(v) : v;
                return "Rs." + (n >= 1000 ? (n / 1000).toFixed(0) + "k" : n);
              },
            },
            border: { display: false },
          },
          yOrd: {
            position: "right",
            grid: { display: false },
            ticks: { color: "#8b5cf6", font: { size: 11 } },
            border: { display: false },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [dailyStats]);

  if (!dailyStats.length)
    return (
      <div className="flex h-[220px] items-center justify-center text-[13px] text-gray-400">
        No data available for this period
      </div>
    );

  return (
    <div className="relative w-full" style={{ height: 220 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
