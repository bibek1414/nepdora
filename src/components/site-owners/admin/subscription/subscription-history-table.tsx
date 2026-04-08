"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar, CreditCard, Hash } from "lucide-react";
import { UserSubscription } from "@/types/subscription";

interface SubscriptionHistoryTableProps {
  subscriptions: UserSubscription[];
}

export function SubscriptionHistoryTable({
  subscriptions,
}: SubscriptionHistoryTableProps) {
  return (
    <div className="rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5 hover:bg-transparent">
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Plan Details
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Amount
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Payment Type
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Started On
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Expires On
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-xs text-black/40"
              >
                No subscription history found.
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map(sub => (
              <TableRow
                key={sub.id}
                className="group border-b border-black/5 transition-colors hover:bg-black/2"
              >
                <TableCell className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-black">
                      {sub.plan.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-black/40">
                      <Hash className="h-3 w-3" />
                      Txn: {sub.transaction_id}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-sm font-medium text-black">
                    NPR {Number(sub.amount).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-black/60 capitalize">
                    <CreditCard className="h-3.5 w-3.5 text-black/40" />
                    {sub.payment_type}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-black/60">
                    <Calendar className="h-3.5 w-3.5 text-black/40" />
                    {format(new Date(sub.started_on), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-black/60">
                    <Calendar className="h-3.5 w-3.5 text-black/40" />
                    {format(new Date(sub.expires_on), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {new Date(sub.expires_on) > new Date() ? (
                    <span className="rounded bg-green-400/10 px-2 py-1 text-[10px] font-semibold text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded bg-black/5 px-2 py-1 text-[10px] font-semibold text-black/60">
                      Expired
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
