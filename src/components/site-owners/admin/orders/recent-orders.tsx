"use client";

import React, { useState, useRef } from "react";
import {
  useOrders,
  useUpdateOrderStatus,
} from "@/hooks/owner-site/admin/use-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, ArrowRight } from "lucide-react";
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
import Link from "next/link";
import { OrderDialog } from "./order-dialog";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const RecentOrdersSkeleton = () => {
  return (
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
  );
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: {
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    confirmed: {
      variant: "secondary" as const,
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    processing: {
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    shipped: {
      variant: "secondary" as const,
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    delivered: {
      variant: "secondary" as const,
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    cancelled: {
      variant: "destructive" as const,
      className: "",
    },
    open: {
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
  };

  const config =
    statusConfig[status?.toLowerCase() as keyof typeof statusConfig] ||
    statusConfig.pending;

  return (
    <Badge variant={config.variant} className={config.className}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
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
  ] || { label: paymentType || "Unknown", color: "bg-gray-100 text-gray-800" };

  return (
    <Badge variant="secondary" className={config.color}>
      {config.label}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const RecentOrders = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useOrders({
    page: 1,
    page_size: 10,
  });

  const updateOrderStatus = useUpdateOrderStatus();

  const orders = ordersResponse?.results || [];

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 pb-6">
            <RecentOrdersSkeleton />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load recent orders. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="gap-0 border-none py-0 shadow-none">
        <CardHeader className="mt-10 flex flex-row items-center justify-between space-y-0 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Recent Orders</h1>

          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                No orders yet
              </h3>
              <p className="text-sm text-gray-500">
                You haven&apos;t received any orders yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden px-4">
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
                        <div className="font-medium text-[#4D7399] capitalize">
                          {order.customer_name}
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentBadge(order.is_paid)}</TableCell>
                      <TableCell>
                        {getPaymentTypeBadge(order.payment_type)}
                      </TableCell>
                      <TableCell className="font-medium">
                        Rs.{parseFloat(order.total_amount).toFixed(2)}
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

      {/* Order Dialog */}
      <OrderDialog
        orders={orders}
        currentOrderId={selectedOrderId}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onOrderChange={handleOrderChange}
      />
    </>
  );
};

export default RecentOrders;
