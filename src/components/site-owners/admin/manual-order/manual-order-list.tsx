"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ManualOrderDialog } from "./manual-order-dialog";
import { CreateManualOrderDialog } from "./create-manual-order-dialog";
import { orderApi } from "@/services/api/owner-sites/admin/orders";
import type { OrderPaginationParams } from "@/types/owner-site/admin/orders";
import type { Order } from "@/types/owner-site/admin/orders";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "warning" },
  processing: { label: "Processing", color: "info" },
  completed: { label: "Completed", color: "success" },
  cancelled: { label: "Cancelled", color: "destructive" },
  all: { label: "All", color: "default" },
} as const;

export function ManualOrderList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Helper function to safely cast status to OrderStatus
  const getValidStatus = (status: string): OrderStatus => {
    return status === "pending" ||
      status === "processing" ||
      status === "completed" ||
      status === "cancelled"
      ? (status as OrderStatus)
      : "pending";
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: OrderPaginationParams = {
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
        status:
          statusFilter !== "all" ? (statusFilter as OrderStatus) : undefined,
        sortBy: "created_at",
        sortOrder: "desc",
      };

      const response = await orderApi.getOrders(params);
      setOrders(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Failed to fetch manual orders:", error);
      toast.error("Failed to load manual orders");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
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

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      // Validate the status is a valid OrderStatus
      const validStatus: OrderStatus =
        newStatus === "pending" ||
        newStatus === "processing" ||
        newStatus === "completed" ||
        newStatus === "cancelled"
          ? (newStatus as OrderStatus)
          : "pending";

      await orderApi.updateOrderStatus(orderId, {
        status: validStatus,
      });
      toast.success("Order status updated successfully");

      // Refresh orders
      const response = await orderApi.getOrders({
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setOrders(response.results);
    } catch (error) {
      console.error("Error updating order status:", error);
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

  const handleRowClick = useCallback(
    (orderId: number, event: React.MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }
      handleOpenDialog(orderId);
    },
    []
  );

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-9"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={value => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <CreateManualOrderDialog />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
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
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map(order => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={e => handleRowClick(order.id, e)}
                >
                  <TableCell className="font-medium">
                    #{order.order_number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {order.customer_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    Rs.{parseFloat(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div
                      ref={dropdownRef}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      <Select
                        value={order.status}
                        onValueChange={value =>
                          handleStatusChange(order.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.filter(
                            opt => opt.value !== "all"
                          ).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(prev => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Order Dialog */}
      <ManualOrderDialog
        orders={orders}
        currentOrderId={selectedOrderId}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onOrderChange={handleOrderChange}
      />
    </div>
  );
}
