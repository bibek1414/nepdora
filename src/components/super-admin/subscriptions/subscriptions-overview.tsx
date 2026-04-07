"use client";

import React, { useState, useEffect } from "react";
import { useAllSubscriptions } from "@/hooks/use-subscription";
import { SubscriptionsTable } from "@/components/super-admin/subscriptions/subscriptions-table";
import { SubscriptionsHeader } from "@/components/super-admin/subscriptions/subscriptions-header";
import Pagination from "@/components/ui/pagination";
import { useDebouncer } from "@/hooks/use-debouncer";

export function SubscriptionsOverview() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncer(search, 500);

  const { data, isLoading, isError } = useAllSubscriptions(
    page,
    debouncedSearch
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">
            Error Loading Subscriptions
          </h3>
          <p className="text-muted-foreground">
            Please check your permissions and try again.
          </p>
        </div>
      </div>
    );
  }

  const subscriptions = data?.results || [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <SubscriptionsHeader search={search} setSearch={setSearch} />

      <SubscriptionsTable subscriptions={subscriptions} isLoading={isLoading} />

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
