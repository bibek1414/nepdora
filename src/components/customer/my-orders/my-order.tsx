"use client";

import React from "react";
import {
  useMyOrders,
  useMyOrderStatusCounts,
  useCalculatedMyOrderStatusCounts,
} from "@/hooks/customer/my-order";
import { useAuth } from "@/hooks/customer/use-auth";
import OrderFilters from "./order-filters";
import OrdersList from "./order-list";
import Pagination from "@/components/ui/pagination";
import LoadingSpinner from "./loading-spinner";
import EmptyState from "./empty-state";
import ErrorState from "./error-state";
import {
  OrderFilters as OrderFiltersType,
  StatusCounts,
} from "@/types/customer/my-orders";

const MyOrders: React.FC = () => {
  const [filters, setFilters] = React.useState<OrderFiltersType>({
    status: "all",
    search: "",
    page: 1,
    page_size: 5,
    ordering: "-created_at",
  });

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    data: apiStatusCounts,
    isLoading: isStatusCountsLoading,
    error: statusCountsError,
    refetch: refetchStatusCounts,
  } = useMyOrderStatusCounts({
    enabled: isAuthenticated,
  });

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useMyOrders(filters, {
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const orders = ordersData?.results || [];

  const calculatedStatusCounts = useCalculatedMyOrderStatusCounts(orders);

  const statusCounts: StatusCounts = apiStatusCounts || calculatedStatusCounts;

  const isLoading = isOrdersLoading || isStatusCountsLoading;
  const error = ordersError || statusCountsError;

  const currentPageSize = filters.page_size ?? 5;
  const currentPage = filters.page ?? 1;

  const pagination = {
    count: ordersData?.count || 0,
    next: ordersData?.next || null,
    previous: ordersData?.previous || null,
    currentPage: currentPage,
    totalPages: Math.ceil((ordersData?.count || 0) / currentPageSize),
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setFilters(prev => ({
      ...prev,
      page_size: newPageSize,
      page: 1,
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({
      ...prev,
      search,
      page: 1,
    }));
  };

  const handleRetry = () => {
    refetchOrders();
    refetchStatusCounts();
  };

  // Show loading spinner while checking authentication status
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  // Only show login message after auth check is complete and user is not authenticated
  if (!isAuthLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Please Login
          </h2>
          <p className="text-gray-600">
            You need to be logged in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Track and manage your orders
          </p>
        </div>

        <OrderFilters
          filters={filters}
          statusCounts={statusCounts}
          onStatusFilter={handleStatusFilter}
          onSearchChange={handleSearchChange}
        />

        {!isLoading && !error && (
          <div className="mb-6 text-sm text-gray-600">
            Showing{" "}
            {orders.length > 0 ? (currentPage - 1) * currentPageSize + 1 : 0} -{" "}
            {Math.min(
              (currentPage - 1) * currentPageSize + orders.length,
              pagination.count
            )}{" "}
            of {pagination.count} orders
            {filters.status !== "all" && ` (${filters.status})`}
            {filters.search && ` matching "${filters.search}"`}
            {statusCountsError && (
              <span className="ml-2 text-amber-600">
                (Status counts unavailable - showing calculated values)
              </span>
            )}
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {error && !statusCountsError && (
          <ErrorState error={error.message} onRetry={handleRetry} />
        )}

        {ordersError && statusCountsError && (
          <ErrorState
            error="Failed to load orders and status counts"
            onRetry={handleRetry}
          />
        )}

        {!isLoading && !ordersError && orders.length === 0 && (
          <EmptyState filters={filters} />
        )}

        {!isLoading && !ordersError && orders.length > 0 && (
          <>
            <OrdersList orders={orders} />
            {pagination.totalPages > 1 && (
              <Pagination
                count={pagination.count}
                pageSize={currentPageSize}
                hasNext={!!ordersData?.next}
                hasPrevious={!!ordersData?.previous}
                onPageSizeChange={handlePageSizeChange}
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                showFirstLast={true}
                maxVisiblePages={7}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
