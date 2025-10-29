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

import { Package, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Order, OrderPaginationParams } from "@/types/owner-site/admin/orders";
import { toast } from "sonner";
import { OrderDialog } from "./order-dialog";

// Status configuration for filtering and display
const STATUS_CONFIG = {
  all: { label: "All", color: "default" },
  pending: { label: "Pending", color: "warning" },
  processing: { label: "Processing", color: "info" },
  shipped: { label: "Shipped", color: "success" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Cancelled", color: "destructive" },
  open: { label: "Open", color: "info" },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
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
  }, [statusFilter]);

  // Prepare query parameters
  const queryParams = useMemo<OrderPaginationParams>(
    () => ({
      page: currentPage,
      page_size: ITEMS_PER_PAGE,
      search: debouncedSearch || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      sortBy: "created_at",
      sortOrder: "desc",
    }),
    [currentPage, debouncedSearch, statusFilter]
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

  const totalPages = ordersResponse
    ? Math.ceil(ordersResponse.count / ITEMS_PER_PAGE)
    : 0;
  const orders = ordersResponse?.results || [];

  if (isLoading && !ordersResponse) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-black">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your customer orders
          </p>
        </div>
        <OrderTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-black">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your customer orders
          </p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load orders. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-black">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track your customer orders
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 placeholder:text-gray-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="flex items-center gap-2"
          >
            All
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "processing" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("processing")}
          >
            Processing
          </Button>
          <Button
            variant={statusFilter === "shipped" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("shipped")}
          >
            Shipped
          </Button>
          <Button
            variant={statusFilter === "delivered" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("delivered")}
          >
            Delivered
          </Button>
          <Button
            variant={statusFilter === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="mb-2 text-lg font-semibold">
                {debouncedSearch || statusFilter !== "all"
                  ? "No orders found"
                  : "No orders yet"}
              </h3>
              <p className="text-muted-foreground">
                {debouncedSearch || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't received any orders yet."}
              </p>
              {(debouncedSearch || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
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
                  {orders.map(order => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={e => handleRowClick(order.id, e)}
                    >
                      <TableCell className="font-medium text-[#4D7399]">
                        {order.order_number}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[#4D7399]">
                          {order.customer_name}
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentBadge(order.is_paid)}</TableCell>
                      <TableCell>
                        {getPaymentTypeBadge(order.payment_type)}
                      </TableCell>
                      <TableCell className="font-medium">
                        Rs.{order.total_amount}
                      </TableCell>
                      <TableCell>
                        <div ref={dropdownRef}>
                          <Select
                            value={order.status}
                            onValueChange={value =>
                              handleStatusChange(order.id, value)
                            }
                            disabled={updateOrderStatus.isPending}
                          >
                            <SelectTrigger className="w-auto min-w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
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
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, ordersResponse?.count || 0)}{" "}
            of {ordersResponse?.count || 0} orders
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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
