"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Wallet,
  History,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  usePaymentHistory,
  useTenantCentralPayments,
} from "@/hooks/owner-site/admin/use-payment-history";
import {
  PaymentHistory,
  TenantCentralPayment,
} from "@/types/owner-site/admin/payment-gateway";
import { PaymentDetailsDialog } from "@/components/site-owners/admin/payments/payment-details-dialog";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { Package } from "lucide-react";
import { PaymentStatsCards } from "@/components/site-owners/admin/payments/stats-cards";
import { useTenantPaymentSummary } from "@/hooks/owner-site/admin/use-payment-history";
import { useUnreadCounts } from "@/hooks/owner-site/admin/use-stats";

const ITEMS_PER_PAGE = 20;
type PaymentViewType = "nepdora" | "own";

interface PaymentsClientProps {
  showTitle?: boolean;
  initialView?: PaymentViewType;
  hideTabs?: boolean;
}

export default function PaymentsClient({
  showTitle = true,
  initialView = "nepdora",
  hideTabs = false,
}: PaymentsClientProps) {
  const [selectedView, setSelectedView] =
    useState<PaymentViewType>(initialView);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [selectedView, debouncedSearch]);

  const { data: summary, isLoading: loadingSummary } = useTenantPaymentSummary(
    user?.sub_domain || ""
  );

  const { data: centralPaymentsData, isLoading: loadingCentral } =
    useTenantCentralPayments({
      tenant: user?.sub_domain || "",
      page,
      page_size: ITEMS_PER_PAGE,
      search: debouncedSearch,
    });

  const { data: ownHistoryData, isLoading: loadingOwn } = usePaymentHistory({
    page,
    page_size: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  const isLoading = selectedView === "nepdora" ? loadingCentral : loadingOwn;
  const currentData =
    selectedView === "nepdora"
      ? centralPaymentsData?.results || []
      : ownHistoryData?.results || [];

  const totalCount =
    selectedView === "nepdora"
      ? centralPaymentsData?.count || 0
      : ownHistoryData?.count || 0;

  const { data: unreadCounts } = useUnreadCounts();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const tabs = [
    {
      id: "nepdora" as PaymentViewType,
      label: "Nepdora Payment",
      icon: Wallet,
      count: unreadCounts?.unread_tenant_payments || 0,
    },
    {
      id: "own" as PaymentViewType,
      label: "Own History",
      icon: History,
      count: unreadCounts?.unread_own_payment || 0,
    },
  ];

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
          <p className="text-xs text-black/40">Loading payments...</p>
        </div>
      );
    }

    if (currentData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center border-t border-black/5 bg-white py-12 text-center">
          <div className="mb-4 rounded-full bg-black/5 p-4">
            <Package className="h-10 w-10 text-black/20" />
          </div>
          <h3 className="mb-1 text-sm font-medium text-black">
            No payment records found
          </h3>
          <p className="text-xs text-black/40">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5">
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Order Details
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Type
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Amount
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Status
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Products
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item: any) => (
            <TableRow
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                setIsDialogOpen(true);
              }}
              className={cn(
                "group cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2",
                !item.is_read && "bg-blue-50/50"
              )}
            >
              <TableCell className="px-6 py-4">
                <span
                  className={cn(
                    "text-sm font-normal",
                    !item.is_read ? "font-bold text-[#003d79]" : "text-black"
                  )}
                >
                  {item.additional_info?.order_id || "No Order ID"}
                </span>
                <p className="text-[10px] text-black/40">
                  TXN: {item.transaction_id}
                </p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="text-xs text-black/60 capitalize">
                  {item.payment_type}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="text-sm font-semibold text-[#003d79]">
                  Rs. {item.pay_amount}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                    item.status === "received" || item.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  {Array.isArray(item.products_purchased) &&
                  item.products_purchased.length > 0 ? (
                    <>
                      {item.products_purchased.slice(0, 2).map((p: any) => (
                        <span
                          key={p.id}
                          className="max-w-[150px] truncate text-xs text-black/50"
                        >
                          {p.product?.name} (x{p.quantity})
                        </span>
                      ))}
                      {item.products_purchased.length > 2 && (
                        <span className="text-[10px] text-black/30">
                          +{item.products_purchased.length - 2} more
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-black/30">No products</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <span className="text-xs text-black/60">
                  {formatDate(item.created_at)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className={cn("bg-white", showTitle && "min-h-screen")}>
      <div
        className={cn(
          "mx-auto mb-40",
          showTitle ? "mt-12 max-w-6xl px-6 md:px-8" : "mt-0 w-full"
        )}
      >
        {/* Page Title */}
        {showTitle && (
          <div className="mb-5">
            <h1 className="text-xl font-bold text-[#003d79]">
              Payment History
            </h1>
            <p className="text-xs text-black/50">
              View and track all your transactions.
            </p>
          </div>
        )}

        <PaymentStatsCards
          totalReceived={summary?.total_received || 0}
          totalPaid={summary?.total_paid || 0}
          pendingBalance={summary?.pending_balance || 0}
          isLoading={loadingSummary}
        />

        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          {/* Tabs */}
          {!hideTabs && (
            <div className="inline-flex items-center gap-2 rounded-full bg-black/5 p-1.5">
              {tabs.map(tab => {
                const isActive = selectedView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedView(tab.id);
                    }}
                    className={cn(
                      "group relative flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                      isActive
                        ? "bg-white text-[#003d79]"
                        : "text-black/60 hover:bg-white/50 hover:text-black"
                    )}
                  >
                    <tab.icon
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        isActive
                          ? "text-[#003d79]"
                          : "text-black/50 group-hover:text-black/70"
                      )}
                    />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tab.count > 0 && (
                      <span
                        className={cn(
                          "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-medium transition-colors duration-200",
                          isActive
                            ? "bg-[#003d79]/10 text-[#003d79]"
                            : "bg-black/10 text-black/60 group-hover:bg-black/15"
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:outline-none"
            />
          </div>
        </div>
        {/* Table Container */}
        <div className="overflow-hidden rounded-lg bg-white">
          {renderTableContent()}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-black/5 bg-white px-6 py-4">
            <div className="text-[10px] text-black/40">
              Showing {currentData.length} results
            </div>
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <PaymentDetailsDialog
        payments={currentData}
        currentPaymentId={selectedId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onPaymentChange={setSelectedId}
        type={selectedView}
      />
    </div>
  );
}
