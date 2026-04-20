"use client";

import React, { useState } from "react";
import { useSMSPurchases } from "@/hooks/owner-site/admin/use-sms";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertCircle, CreditCard, Calendar, Hash, Banknote } from "lucide-react";
import { SimplePagination } from "@/components/ui/simple-pagination";

const PAYMENT_LOGOS: Record<string, string> = {
  esewa: "/images/payment-gateway/esewa.png",
  khalti: "/images/payment-gateway/khalti.png",
};

interface SMSPurchaseHistoryProps {
  showTitle?: boolean;
}

export function SMSPurchaseHistory({ showTitle = true }: SMSPurchaseHistoryProps) {
  const [page, setPage] = useState(1);
  const { data: purchases, isLoading } = useSMSPurchases(page);

  const purchaseItems = purchases?.results || [];
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil((purchases?.count || 0) / PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#003d79]">Purchase History</h2>
        </div>
      )}

      <div className="rounded-lg bg-white overflow-hidden border border-black/5">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black/5 bg-slate-50/50">
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Transaction ID
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Credits
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Amount Paid
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Payment Method
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseItems.length > 0 ? (
              purchaseItems.map((purchase) => (
                <TableRow
                  key={purchase.id}
                  className="group border-b border-black/5 transition-colors hover:bg-black/2"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <Hash className="h-4 w-4 text-black/20" />
                      {purchase.transaction_id}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <CreditCard className="h-4 w-4 text-black/20" />
                      {purchase.amount}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <Banknote className="h-4 w-4 text-black/20" />
                      Rs. {Number(purchase.price).toLocaleString("en-IN")}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {purchase.payment_type ? (
                      <div className="flex items-center gap-2">
                        <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
                          <img
                            src={PAYMENT_LOGOS[purchase.payment_type.toLowerCase()] || ""}
                            alt={purchase.payment_type}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {purchase.payment_type}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-black/20" />
                      {format(new Date(purchase.purchased_at), "MMM d, yyyy · p")}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 text-slate-300" />
                    <p className="font-medium text-slate-500">No purchase history found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="border-t border-black/5 px-6 py-4">
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
