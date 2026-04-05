"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import AnalyticsFilters, { Timeframe } from "./analytics-filters";
import AnalyticsSummaryCards from "./analytics-summary-cards";
import AnalyticsCharts from "./analytics-charts";
import TopSellingProducts from "./top-selling-products";
import { useAnalyticsStats } from "@/hooks/owner-site/admin/use-analytics-stats";
import { DateRange } from "react-day-picker";

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<Timeframe>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const apiParams = useMemo(() => {
    const params: {
      start_date?: string;
      end_date?: string;
      month?: string;
      year?: string;
    } = {};

    if (dateRange?.from) {
      params.start_date = format(dateRange.from, "yyyy-MM-dd");
    }
    if (dateRange?.to) {
      params.end_date = format(dateRange.to, "yyyy-MM-dd");
    }

    if (timeframe === "monthly") {
      params.month = (new Date().getMonth() + 1).toString();
    }
    if (timeframe === "yearly") {
      params.year = new Date().getFullYear().toString();
    }

    return params;
  }, [dateRange, timeframe]);

  const { data, isLoading } = useAnalyticsStats(apiParams);

  return (
    <div className="flex flex-col gap-8 px-6 py-7">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-black/6 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-gray-900">
              Sales Overview
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Monitor your business performance and sales trends across all
            channels.
          </p>
        </div>
        <AnalyticsFilters
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          dateRange={dateRange}
          setDateRange={setDateRange}
          isLoading={isLoading}
        />
      </div>

      {/* Summary Metrics */}
      <AnalyticsSummaryCards data={data} isLoading={isLoading} />

      {/* Charts */}
      <AnalyticsCharts data={data} isLoading={isLoading} />

      {/* Product Tables - Top & Least */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopSellingProducts
          title="Top Selling Products"
          products={data?.top_selling_products || []}
          isLoading={isLoading}
        />
        <TopSellingProducts
          title="Least Selling Products"
          products={data?.least_selling_products || []}
          isLoading={isLoading}
        />
      </div>

      {/* Revenue Contribution */}
      <TopSellingProducts
        title="Revenue Contribution by Product"
        products={data?.revenue_contribution_by_product || []}
        isLoading={isLoading}
        showPercentage={true}
        totalRevenue={data?.revenue}
      />
    </div>
  );
}
