"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useOrders,
  useUpdateOrderStatus,
} from "@/hooks/owner-site/admin/use-orders";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManualOrderDialog } from "./manual-order-dialog";
import { Order, OrderPaginationParams } from "@/types/owner-site/admin/orders";
import { toast } from "sonner";
import { OrderDialog } from "./order-dialog";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { Package, Search, X } from "lucide-react";

// Status configuration for filtering and display
const STATUS_CONFIG = {
  all: { label: "All", color: "default" },
  pending: { label: "Pending", color: "warning" },
  confirmed: { label: "Confirmed", color: "warning" },
  processing: { label: "Processing", color: "info" },
  shipped: { label: "Shipped", color: "success" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Cancelled", color: "destructive" },
  open: { label: "Open", color: "info" },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map(i => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ITEMS_PER_PAGE = 25;

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showManualOnly, setShowManualOnly] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateOrderStatus = useUpdateOrderStatus();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, showManualOnly]);

  // Prepare query parameters
  const queryParams = useMemo<OrderPaginationParams>(
    () => ({
      page: currentPage,
      page_size: ITEMS_PER_PAGE,
      search: debouncedSearch || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      sortBy: "created_at",
      sortOrder: "desc",
      is_manual: showManualOnly ? true : undefined,
    }),
    [currentPage, debouncedSearch, statusFilter, showManualOnly]
  );

  const { data: ordersResponse, isLoading, error } = useOrders(queryParams);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const config =
      STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.all;
    return (
      <Badge
        variant={
          config.color === "success"
            ? "default"
            : config.color === "warning"
              ? "secondary"
              : config.color === "destructive"
                ? "destructive"
                : "outline"
        }
        className={
          config.color === "success"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : config.color === "warning"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : config.color === "info"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                : ""
        }
      >
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (isPaid: boolean | undefined) => {
    return isPaid ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Paid
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Unpaid
      </Badge>
    );
  };

  const getPaymentTypeBadge = (paymentType: string | undefined) => {
    const paymentTypeConfig = {
      cod: { label: "COD", color: "bg-blue-100 text-blue-800" },
      esewa: { label: "eSewa", color: "bg-purple-100 text-purple-800" },
      khalti: { label: "Khalti", color: "bg-purple-100 text-purple-800" },
      card: { label: "Card", color: "bg-gray-100 text-gray-800" },
    };

    const config = paymentTypeConfig[
      paymentType as keyof typeof paymentTypeConfig
    ] || {
      label: paymentType || "Unknown",
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({
        id: orderId,
        statusData: { status: newStatus },
      });
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleOpenDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrderId(null);
  };

  const handleOrderChange = (orderId: number) => {
    setSelectedOrderId(orderId);
  };

  const handleRowClick = (orderId: number, event: React.MouseEvent) => {
    // Check if the click was inside the status dropdown
    if (
      dropdownRef.current &&
      dropdownRef.current.contains(event.target as Node)
    ) {
      return; // Don't open the dialog if clicking on the dropdown
    }

    handleOpenDialog(orderId);
  };

  const handleManualOrdersToggle = () => {
    setShowManualOnly(!showManualOnly);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setShowManualOnly(false);
  };

  const totalPages = ordersResponse
    ? Math.ceil(ordersResponse.count / ITEMS_PER_PAGE)
    : 0;
  const orders = ordersResponse?.results || [];

  if (isLoading && !ordersResponse) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-[#003d79]">Orders</h1>
          </div>
          <OrderTableSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-[#003d79]">Orders</h1>
          </div>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load orders. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#003d79]">Orders</h1>
          </div>
          <ManualOrderDialog />
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-full px-4 py-1 text-xs font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/60 hover:bg-black/10"
              }`}
            >
              All
            </button>
            {STATUS_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value as any)}
                className={`rounded-full px-4 py-1 text-xs font-medium transition-colors ${
                  statusFilter === option.value
                    ? "bg-black text-white"
                    : "bg-black/5 text-black/60 hover:bg-black/10"
                }`}
              >
                {option.label}
              </button>
            ))}
            <button
              onClick={handleManualOrdersToggle}
              disabled={isLoading}
              className={`rounded-full px-4 py-1 text-xs font-medium transition-colors ${
                showManualOnly
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/60 hover:bg-black/10"
              }`}
            >
              {showManualOnly ? "Show All Orders" : "Manual Orders"}
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-lg bg-white">
          <div className="p-0">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center border-t border-black/5 bg-white py-12 text-center">
                <div className="mb-4 rounded-full bg-black/5 p-4">
                  <Package className="h-10 w-10 text-black/20" />
                </div>
                <h3 className="mb-1 text-sm font-medium text-black">
                  No orders found
                </h3>
                <p className="text-xs text-black/40">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="link"
                  onClick={handleClearFilters}
                  className="mt-2 text-xs text-[#003d79]"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-black/5">
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Order
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Date
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Customer
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Payment
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Payment Type
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Total
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow
                        key={order.id}
                        className="group cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
                        onClick={e => handleRowClick(order.id, e)}
                      >
                        <TableCell className="px-6 py-4">
                          <span className="text-sm font-bold text-[#003d79]">
                            #{order.order_number}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-xs text-black/60">
                            {formatDate(order.created_at)}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-sm font-normal text-black capitalize">
                            {order.customer_name}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getPaymentBadge(order.is_paid)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getPaymentTypeBadge(order.payment_type)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-sm font-semibold text-black">
                            रु {order.total_amount?.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div
                            ref={dropdownRef}
                            onClick={e => e.stopPropagation()}
                          >
                            <Select
                              value={order.status}
                              onValueChange={value =>
                                handleStatusChange(order.id, value)
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px] border-black/5 bg-black/5 text-xs font-medium focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map(option => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-xs"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-black/5 bg-white px-6 py-4">
            <div className="text-[10px] text-black/40">
              Showing {orders.length} results
            </div>
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      {/* Order Dialog */}
      <OrderDialog
        orders={orders}
        currentOrderId={selectedOrderId}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onOrderChange={handleOrderChange}
      />
    </div>
  );
}
