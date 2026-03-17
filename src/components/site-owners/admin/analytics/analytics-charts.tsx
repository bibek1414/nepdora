"use client";

import React from "react";
import { Chart } from "chart.js/auto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsStats, DailyStat } from "@/types/owner-site/admin/stats";
import { Badge } from "@/components/ui/badge";

interface AnalyticsChartsProps {
  data?: AnalyticsStats;
  isLoading?: boolean;
}

export default function AnalyticsCharts({
  data,
  isLoading,
}: AnalyticsChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0!">
          <CardTitle className="text-lg font-semibold">Sales Trend</CardTitle>
        </CardHeader>
        <CardContent className="px-0!">
          <TrendChart dailyStats={data?.daily_stats || []} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-start gap-4 px-0!">
            <CardTitle className="px-0 text-lg font-semibold">
              Order Channel Distribution
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Count</Badge>
              <Badge variant="outline">Amount</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.channel_distribution.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-start gap-4 text-sm font-medium">
                    <span>{item.pos_order ? "POS" : "Online"}</span>
                    <span>
                      {item.count} orders (
                      {((item.count / data.orders) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full ${item.pos_order ? "bg-orange-500" : "bg-blue-500"} transition-all duration-1000`}
                      style={{ width: `${(item.count / data.orders) * 100}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground text-left text-xs">
                    Rs. {item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none">
          <CardHeader className="px-0!">
            <CardTitle className="text-lg font-semibold">
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.status_distribution.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-start gap-4 text-sm font-medium">
                    <span className="capitalize">{item.status}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-green-500 transition-all duration-1000"
                      style={{ width: `${(item.count / data.orders) * 100}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground text-left text-xs">
                    Rs. {item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrendChart({ dailyStats }: { dailyStats: DailyStat[] }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const chartRef = React.useRef<Chart | null>(null);

  React.useEffect(() => {
    if (!canvasRef.current || !dailyStats.length) return;

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const labelColor = isDark ? "#888780" : "#64748b";

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
              if (!chartArea) return "rgba(59,130,246,0.1)";
              const grad = c.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );
              grad.addColorStop(0, "rgba(59,130,246,0.22)");
              grad.addColorStop(1, "rgba(59,130,246,0)");
              return grad;
            },
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: isDark ? "#1e1e1e" : "#fff",
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
            borderWidth: 2,
            borderDash: [5, 4],
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: "#8b5cf6",
            pointBorderColor: isDark ? "#1e1e1e" : "#fff",
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
            backgroundColor: isDark ? "#2c2c2a" : "#ffffff",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            borderWidth: 1,
            titleColor: isDark ? "#c2c0b6" : "#3d3d3a",
            bodyColor: isDark ? "#888780" : "#64748b",
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
                const numericValue = typeof v === "string" ? parseFloat(v) : v;
                return (
                  "Rs." +
                  (numericValue >= 1000
                    ? (numericValue / 1000).toFixed(0) + "k"
                    : numericValue)
                );
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
      <div className="text-muted-foreground flex h-full items-center justify-center">
        No data available
      </div>
    );

  return (
    <div className="relative w-full" style={{ height: 260 }}>
      <canvas ref={canvasRef} />
      <div className="text-muted-foreground absolute top-0 right-6 flex gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
          <span>Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0 w-3 border-t-2 border-dashed border-purple-500" />
          <span>Orders</span>
        </div>
      </div>
    </div>
  );
}
