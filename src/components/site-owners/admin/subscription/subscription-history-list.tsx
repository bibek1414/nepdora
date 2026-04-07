"use client";

import React, { useState } from "react";
import { useUserSubscriptions } from "@/hooks/use-subscription";
import { SubscriptionHistoryTable } from "@/components/site-owners/admin/subscription/subscription-history-table";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/ui/pagination";
import { History } from "lucide-react";

export function SubscriptionHistoryList() {
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
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
          Subscription History
        </h1>
        <p className="text-muted-foreground text-sm">
          View your past subscription plans, payments, and billing cycles.
        </p>
      </div>

      <SubscriptionHistoryTable subscriptions={subscriptions} />

      {data && data.count > 10 && (
        <div className="flex justify-end pt-4">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(data.count / 10)}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
