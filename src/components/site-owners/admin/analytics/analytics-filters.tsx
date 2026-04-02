"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export type Timeframe = "all" | "monthly" | "yearly";

interface AnalyticsFiltersProps {
  timeframe: Timeframe;
  setTimeframe: (value: Timeframe) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  isLoading?: boolean;
}

const TIMEFRAME_OPTIONS: { label: string; value: Timeframe }[] = [
  { label: "All time", value: "all" },
  { label: "This month", value: "monthly" },
  { label: "This year", value: "yearly" },
];

export default function AnalyticsFilters({
  timeframe,
  setTimeframe,
  dateRange,
  setDateRange,
}: AnalyticsFiltersProps) {
  const isFiltered = dateRange !== undefined || timeframe !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Timeframe pill group */}
      <div className="flex items-center gap-1 rounded-lg border border-black/8 bg-gray-50 p-1">
        {TIMEFRAME_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setTimeframe(opt.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
              timeframe === opt.value
                ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex h-[38px] items-center gap-2 rounded-lg border border-black/8 bg-white px-3 text-[13px] font-medium transition-colors hover:bg-gray-50",
              dateRange ? "text-gray-900" : "text-gray-400"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            {dateRange?.from ? (
              dateRange.to ? (
                <span>
                  {format(dateRange.from, "MMM d")} —{" "}
                  {format(dateRange.to, "MMM d, yyyy")}
                </span>
              ) : (
                <span>{format(dateRange.from, "MMM d, yyyy")}</span>
              )
            ) : (
              <span>Custom range</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border border-black/8 bg-white p-0 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
          align="end"
        >
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            initialFocus
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Clear */}
      {isFiltered && (
        <button
          onClick={() => {
            setDateRange(undefined);
            setTimeframe("all");
          }}
          className="flex h-[38px] items-center gap-1.5 rounded-lg border border-black/8 bg-white px-3 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
