"use client";

import React, { useState, useMemo } from "react";
import {
  format,
  subDays,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
} from "date-fns";
import AnalyticsFilters, { Timeframe } from "./analytics-filters";
import AnalyticsSummaryCards from "./analytics-summary-cards";
import AnalyticsCharts from "./analytics-charts";
import TopSellingProducts from "./top-selling-products";
import { useAnalyticsStats } from "@/hooks/owner-site/admin/use-analytics-stats";
import { DateRange } from "react-day-picker";

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
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

    // Map timeframe to month/year if needed by backend
    // If backend only uses start/end date, timeframe might just be for UI grouping
    // But user snippet suggested month/year params too
    if (timeframe === "monthly") {
      params.month = (new Date().getMonth() + 1).toString();
    }
    if (timeframe === "yearly") {
      params.year = new Date().getFullYear().toString();
    }

    return params;
  }, [dateRange, timeframe]);

  const { data, isLoading, isError } = useAnalyticsStats(apiParams);

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-6 border-b px-5 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Sales Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor your business performance and sales trends.
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

      <AnalyticsSummaryCards data={data} isLoading={isLoading} />

      <AnalyticsCharts data={data} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

      <div className="mt-4">
        <TopSellingProducts
          title="Revenue Contribution By Product"
          products={data?.revenue_contribution_by_product || []}
          isLoading={isLoading}
          showPercentage={true}
          totalRevenue={data?.revenue}
        />
      </div>
    </div>
  );
}
