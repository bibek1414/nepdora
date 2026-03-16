"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsStats, DailyStat } from "@/types/owner-site/admin/stats";
import { Badge } from "@/components/ui/badge";

interface AnalyticsChartsProps {
  data?: AnalyticsStats;
  isLoading?: boolean;
}

export default function AnalyticsCharts({ data, isLoading }: AnalyticsChartsProps) {
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
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sales Trend</CardTitle>
        </CardHeader>
        <CardContent className="">
          <TrendChart dailyStats={data?.daily_stats || []} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-start gap-4">
            <CardTitle className="text-lg font-semibold">Order Channel Distribution</CardTitle>
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
                    <span>{item.count} orders ({((item.count / data.orders) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div 
                      className={`h-full ${item.pos_order ? "bg-orange-500" : "bg-blue-500"} transition-all duration-1000`} 
                      style={{ width: `${(item.count / data.orders) * 100}%` }}
                    />
                  </div>
                  <div className="text-left text-xs text-muted-foreground">
                    Rs. {item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Order Status Distribution</CardTitle>
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
                  <div className="text-left text-xs text-muted-foreground">
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
  if (!dailyStats.length) return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>;

  const maxRevenue = Math.max(...dailyStats.map(d => d.revenue), 1);
  const maxOrders = Math.max(...dailyStats.map(d => d.orders), 1);
  
  const width = 1000;
  const height = 250;
  const padding = 40;
  const innerWidth = width - (padding * 2);
  const innerHeight = height - (padding * 2);

  const getPoints = (type: "revenue" | "orders") => {
    return dailyStats.map((d, i) => {
      const x = padding + (i / (dailyStats.length - 1 || 1)) * innerWidth;
      const val = type === "revenue" ? d.revenue : d.orders;
      const max = type === "revenue" ? maxRevenue : maxOrders;
      const y = height - padding - (val / max) * innerHeight;
      return `${x},${y}`;
    }).join(" ");
  };

  const revenuePoints = getPoints("revenue");
  const orderPoints = getPoints("orders");

  return (
    <div className="relative h-full w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line 
            key={i}
            x1={padding} 
            y1={height - padding - p * innerHeight} 
            x2={width - padding} 
            y2={height - padding - p * innerHeight} 
            stroke="#e2e8f0" 
            strokeDasharray="4 4" 
          />
        ))}

        {/* Revenue Area (Gradient) */}
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M ${padding},${height-padding} L ${revenuePoints} L ${width-padding},${height-padding} Z`}
          fill="url(#revenueGradient)"
        />

        {/* Revenue Line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={revenuePoints}
        />

        {/* Order Line */}
        <polyline
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={orderPoints}
        />

        {/* X-axis labels (Dates) */}
        {dailyStats.filter((_, i) => i % Math.ceil(dailyStats.length / 5) === 0).map((d, i, arr) => {
          const x = padding + (dailyStats.indexOf(d) / (dailyStats.length - 1 || 1)) * innerWidth;
          return (
            <text 
              key={i} 
              x={x} 
              y={height - 10} 
              textAnchor="middle" 
              fontSize="12" 
              fill="#64748b"
            >
              {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </text>
          );
        })}
      </svg>
      <div className="absolute top-0 right-0 flex gap-4 text-xs font-medium">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span>Revenue</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-purple-500" style={{ border: '2px dashed white' }} />
          <span>Orders</span>
        </div>
      </div>
    </div>
  );
}
