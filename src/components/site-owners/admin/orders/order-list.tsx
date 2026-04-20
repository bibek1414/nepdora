"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useOrders,
  useUpdateOrderStatus,
} from "@/hooks/owner-site/admin/use-orders";
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
import { OrderPaginationParams } from "@/types/owner-site/admin/orders";
import { toast } from "sonner";
import { OrderDialog } from "./order-dialog";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { Package, Search } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_PILL_STYLES: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
  open: "bg-blue-50 text-blue-700",
};

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  cod: "COD",
  esewa: "eSewa",
  khalti: "Khalti",
  card: "Card",
};

const ITEMS_PER_PAGE = 25;

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatMoney = (value: string | number | undefined | null) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const OrderTableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100">
            <TableHead className="px-5 py-3.5">Order</TableHead>
            <TableHead className="px-5 py-3.5">Date</TableHead>
            <TableHead className="px-5 py-3.5">Customer</TableHead>
            <TableHead className="px-5 py-3.5">Payment</TableHead>
            <TableHead className="px-5 py-3.5">Type</TableHead>
            <TableHead className="px-5 py-3.5">Total</TableHead>
            <TableHead className="px-5 py-3.5 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map(index => (
            <TableRow key={index} className="border-b border-gray-50">
              <TableCell className="px-5 py-4">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="px-5 py-4">
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="px-5 py-4">
                <Skeleton className="h-4 w-36" />
              </TableCell>
              <TableCell className="px-5 py-4">
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell className="px-5 py-4">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="px-5 py-4">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="px-5 py-4 text-right">
                <Skeleton className="ml-auto h-8 w-[120px] rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const getStatusPill = (status: string) => (
  <Badge
    variant="secondary"
    className={`rounded-full border-0 px-3 py-1 text-[12px] font-medium shadow-none ${
      STATUS_PILL_STYLES[status?.toLowerCase()] || "bg-slate-100 text-slate-700"
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
);

const getPaymentBadge = (isPaid: boolean | undefined) => (
  <span
    className={`text-[13px] font-medium ${
      isPaid ? "text-emerald-600" : "text-gray-500"
    }`}
  >
    {isPaid ? "Paid" : "Unpaid"}
  </span>
);

export default function OrdersPage({ isPOS = false }: { isPOS?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showManualOnly, setShowManualOnly] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateOrderStatus = useUpdateOrderStatus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, showManualOnly]);

  const queryParams = useMemo<OrderPaginationParams>(
    () => ({
      page: currentPage,
      page_size: ITEMS_PER_PAGE,
      search: debouncedSearch || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      is_manual: showManualOnly ? true : undefined,
      pos_order: isPOS ? true : undefined,
    }),
    [currentPage, debouncedSearch, statusFilter, showManualOnly, isPOS]
  );

  const { data: ordersResponse, isLoading, error } = useOrders(queryParams);
  const orders = ordersResponse?.results || [];
  const totalPages = ordersResponse
    ? Math.ceil(ordersResponse.count / ITEMS_PER_PAGE)
    : 0;

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({
        id: orderId,
        statusData: { status: newStatus },
      });
      toast.success("Order status updated successfully");
    } catch {
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

  const handleRowClick = (orderId: number, event: React.MouseEvent) => {
    if (
      dropdownRef.current &&
      dropdownRef.current.contains(event.target as Node)
    ) {
      return;
    }

    handleOpenDialog(orderId);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setShowManualOnly(false);
  };

  if (isLoading && !ordersResponse) {
    return (
      <div className={isPOS ? "w-full" : "min-h-screen bg-white"}>
        <div
          className={
            isPOS ? "w-full" : "mx-auto max-w-[1200px] px-6 py-10 md:px-10"
          }
        >
          <OrderTableSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={isPOS ? "w-full" : "min-h-screen bg-white"}>
        <div
          className={
            isPOS ? "w-full" : "mx-auto max-w-[1200px] px-6 py-10 md:px-10"
          }
        >
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
    <div className={isPOS ? "w-full" : "min-h-screen bg-white"}>
      <div
        className={
          isPOS ? "w-full" : "mx-auto max-w-[1200px] px-6 py-10 md:px-10"
        }
      >
        {!isPOS && (
          <header className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-gray-900">
                Orders
              </h1>
              <p className="text-[15px] text-gray-500">
                Manage fulfillment and review customer purchases.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  className="h-11 rounded-full border-gray-200 bg-white pr-4 pl-11 text-[14px] shadow-none placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
                />
              </div>
              <ManualOrderDialog />
            </div>
          </header>
        )}

        {isPOS && (
          <div className="mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                className="h-11 rounded-full border-gray-200 bg-white pr-4 pl-11 text-[14px] shadow-none placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        )}

        {!isPOS && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition ${
                statusFilter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {STATUS_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition ${
                  statusFilter === option.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowManualOnly(prev => !prev)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition ${
                showManualOnly
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {showManualOnly ? "Manual only" : "Manual orders"}
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-200 bg-white py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
              <Package className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-900">
              No orders found
            </h3>

            <Button
              variant="link"
              onClick={handleClearFilters}
              className="mt-2 cursor-pointer text-sm text-blue-600"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 text-gray-500">
                    <TableHead className="px-5 py-3.5 text-[13px] font-medium">
                      Order
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-[13px] font-medium">
                      Date
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-[13px] font-medium">
                      Customer
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-[13px] font-medium">
                      Payment
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-[13px] font-medium">
                      Type
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-[13px] font-medium">
                      Total
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-right text-[13px] font-medium">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow
                      key={order.id}
                      onClick={event => handleRowClick(order.id, event)}
                      className="cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50/70"
                    >
                      <TableCell className="px-5 py-4 text-[14px] font-medium text-gray-900">
                        #{order.order_number}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] text-gray-500">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[14px] font-medium text-gray-900 capitalize">
                        {order.customer_name}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {getPaymentBadge(order.is_paid)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] text-gray-500">
                        {PAYMENT_TYPE_LABELS[order.payment_type || ""] ||
                          order.payment_type ||
                          "Unknown"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[14px] font-medium text-gray-900">
                        Rs. {formatMoney(order.total_amount)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div
                          onClick={event => event.stopPropagation()}
                          className="inline-flex items-center justify-end gap-2"
                        >
                          {!isPOS && (
                            <Select
                              value={order.status}
                              onValueChange={value =>
                                handleStatusChange(order.id, value)
                              }
                              disabled={updateOrderStatus.isPending}
                            >
                              <SelectTrigger className="h-9 w-[144px] cursor-pointer rounded-full border-gray-200 bg-white text-[12px] font-medium shadow-none">
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
                          )}
                          {isPOS && getStatusPill(order.status)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <p className="text-[12px] text-gray-500">
                  Showing {orders.length} results
                </p>
                <SimplePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}

        <OrderDialog
          orders={orders}
          currentOrderId={selectedOrderId}
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
          onOrderChange={setSelectedOrderId}
        />
      </div>
    </div>
  );
}
