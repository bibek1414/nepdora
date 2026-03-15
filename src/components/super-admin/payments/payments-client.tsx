"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Wallet,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import StatsCard from "@/components/super-admin/dashboard/statscard";
import {
  SuperAdminPaymentSummary,
  CentralPaymentHistory,
  TenantTransfer,
} from "@/types/super-admin/payment";
import {
  useSuperAdminPaymentSummary,
  useSuperAdminCentralPayments,
  useSuperAdminTransferHistory,
} from "@/hooks/super-admin/use-payments";
import { useTenants } from "@/hooks/super-admin/use-tenants";
import { FiDollarSign, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import ManualTransferDialog from "./manual-transfer-dialog";
import { PaymentDetailsDialog } from "./payment-details-dialog";
import { useDebouncer } from "@/hooks/use-debouncer";
import Pagination from "@/components/ui/site-owners/pagination";

const ITEMS_PER_PAGE = 30;
type PaymentViewType = "payments" | "transfers";

export default function PaymentsClient() {
  const [activeTab, setActiveTab] = useState<PaymentViewType>("payments");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<string>("all");
  const [paymentPage, setPaymentPage] = useState(1);
  const [transferPage, setTransferPage] = useState(1);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const debouncedSearchTerm = useDebouncer(searchTerm, 500);

  // Reset pages on search or tenant change
  useEffect(() => {
    setPaymentPage(1);
    setTransferPage(1);
  }, [debouncedSearchTerm, selectedTenant]);

  // Hooks
  const { data: tenantsData } = useTenants(1, 100);
  const { data: summaryData, isLoading: loadingSummary } =
    useSuperAdminPaymentSummary(
      selectedTenant !== "all" ? selectedTenant : undefined
    );

  const { data: paymentsData, isLoading: loadingPayments } =
    useSuperAdminCentralPayments({
      tenant: selectedTenant !== "all" ? selectedTenant : undefined,
      search: debouncedSearchTerm,
      page: paymentPage,
      page_size: ITEMS_PER_PAGE,
      enabled: activeTab === "payments",
    });

  const { data: transfersData, isLoading: loadingTransfers } =
    useSuperAdminTransferHistory({
      tenant: selectedTenant !== "all" ? selectedTenant : undefined,
      page: transferPage,
      page_size: ITEMS_PER_PAGE,
      enabled: activeTab === "transfers",
    });

  const paymentsTotalPages = Math.ceil(
    (paymentsData?.count || 0) / ITEMS_PER_PAGE
  );
  const transfersTotalPages = Math.ceil(
    (transfersData?.count || 0) / ITEMS_PER_PAGE
  );

  const stats = [
    {
      name: "Total Received",
      value: `Rs. ${Number(summaryData?.total_received || 0).toLocaleString()}`,
      icon: FiArrowUpRight,
      color: "bg-green-500",
    },
    {
      name: "Total Paid",
      value: `Rs. ${Number(summaryData?.total_paid || 0).toLocaleString()}`,
      icon: FiArrowDownLeft,
      color: "bg-blue-500",
    },
    {
      name: "Pending Balance",
      value: `Rs. ${Number(summaryData?.pending_balance || 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: "bg-purple-500",
    },
  ];

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
        <Button
          onClick={() => setIsTransferDialogOpen(true)}
          className="bg-[#003d79] text-white hover:bg-[#002d59]"
        >
          <Plus className="mr-2 h-4 w-4" /> Record Transfer
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
          <StatsCard
            key={stat.name}
            name={stat.name}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Filters and Tabs */}
      <div className="rounded-lg bg-white p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("payments")}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                activeTab === "payments"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Payment History
            </button>
            <button
              onClick={() => setActiveTab("transfers")}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                activeTab === "transfers"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Transfer History
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search  ID or tenant name..."
                className="h-9 border-gray-200 pl-9 text-sm placeholder:text-gray-400 focus:bg-gray-50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger className="h-9 w-full border-gray-200 text-sm sm:w-[200px]">
                <Filter className="mr-2 h-3.5 w-3.5 text-gray-400" />
                <SelectValue placeholder="All Tenants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                {tenantsData?.results.map(domain => (
                  <SelectItem
                    key={domain.tenant.id}
                    value={domain.tenant.schema_name}
                  >
                    {domain.tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-hidden rounded-lg border border-gray-100">
          {activeTab === "payments" ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-600">
                    Tenant
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">
                    Transaction ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">
                    Gateway
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold text-gray-600">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsData?.results.map((item: CentralPaymentHistory) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => {
                      setSelectedPaymentId(item.id);
                      setIsDetailsDialogOpen(true);
                    }}
                  >
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {item.tenant}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">
                      {item.transaction_id}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 capitalize">
                      {item.payment_type}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-[#003d79]">
                      Rs. {item.pay_amount}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                          item.status === "transferred"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-gray-500">
                      {formatDate(item.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
                {(!paymentsData || paymentsData.results.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-sm text-gray-500"
                    >
                      No payment records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-600">
                    Tenant
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">
                    Reference
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold text-gray-600">
                    Transfer Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfersData?.results.map((transfer: TenantTransfer) => (
                  <TableRow
                    key={transfer.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <TableCell className="py-4 font-medium text-gray-900">
                      {transfer.tenant}
                    </TableCell>
                    <TableCell className="text-sm font-bold text-green-600">
                      Rs. {transfer.amount}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-gray-500 italic">
                      {transfer.reference_note || "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-gray-500">
                      {formatDate(transfer.transfer_date)}
                    </TableCell>
                  </TableRow>
                ))}
                {(!transfersData || transfersData.results.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-sm text-gray-500"
                    >
                      No transfer records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <Pagination
          currentPage={activeTab === "payments" ? paymentPage : transferPage}
          totalPages={
            activeTab === "payments" ? paymentsTotalPages : transfersTotalPages
          }
          onPageChange={
            activeTab === "payments" ? setPaymentPage : setTransferPage
          }
        />
      </div>

      <ManualTransferDialog
        isOpen={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
      />

      <PaymentDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        payments={paymentsData?.results || []}
        currentPaymentId={selectedPaymentId}
        onPaymentChange={setSelectedPaymentId}
      />
    </div>
  );
}
