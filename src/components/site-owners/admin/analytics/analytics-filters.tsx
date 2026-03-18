"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export type Timeframe = "monthly" | "yearly";

interface AnalyticsFiltersProps {
  timeframe: Timeframe;
  setTimeframe: (value: Timeframe) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  isLoading?: boolean;
}

export default function AnalyticsFilters({
  timeframe,
  setTimeframe,
  dateRange,
  setDateRange,
  isLoading,
}: AnalyticsFiltersProps) {
  const isFiltered = dateRange !== undefined || timeframe !== "monthly";

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      {/* Timeframe Tabs */}
      <Tabs
        value={timeframe}
        onValueChange={value => setTimeframe(value as Timeframe)}
        className="w-full sm:w-auto"
      >
        <TabsList className="w-full border bg-slate-50/50 shadow-none sm:w-auto">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start bg-white text-left font-normal shadow-none sm:w-[300px]",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto border bg-white p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            initialFocus
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Clear Filters Button */}
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 border bg-white px-3 text-xs text-gray-800 shadow-none hover:bg-slate-50"
          onClick={() => {
            setDateRange(undefined);
            setTimeframe("monthly");
          }}
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
