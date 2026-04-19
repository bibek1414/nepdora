"use client";

import React, { useState } from "react";
import { useUserSubscriptions } from "@/hooks/use-subscription";
import { SubscriptionHistoryTable } from "@/components/site-owners/admin/subscription/subscription-history-table";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/ui/pagination";
import { History, LayoutGrid, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubscriptionHistoryList({ showTitle = true }: { showTitle?: boolean }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUserSubscriptions(page);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">
            Error Loading History
          </h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const subscriptions = data?.results || [];

  return (
    <div className="bg-white">
      <div className={cn(
        "mx-auto mb-40",
        showTitle ? "mt-12 max-w-7xl px-6 md:px-8" : "mt-0 w-full"
      )}>
        {/* Header */}
        {showTitle && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="px-5 text-xl font-bold text-[#003d79]">
              Subscription History
            </h1>
          </div>
        )}

        <SubscriptionHistoryTable subscriptions={subscriptions} />

        {data && data.count > 10 && (
          <div className="mt-8 flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(data.count / 10)}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
