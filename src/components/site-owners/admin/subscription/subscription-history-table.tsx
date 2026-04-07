"use client";

import React from "react";
import { TableWrapper, TableUserCell } from "@/components/ui/custom-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, CreditCard } from "lucide-react";
import { UserSubscription } from "@/types/subscription";

interface SubscriptionHistoryTableProps {
  subscriptions: UserSubscription[];
}

export function SubscriptionHistoryTable({
  subscriptions,
}: SubscriptionHistoryTableProps) {
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="w-[250px]">Plan Details</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Started On</TableHead>
            <TableHead>Expires On</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                No subscription history found.
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map((sub) => (
              <TableRow
                key={sub.id}
                className="hover:bg-slate-50/30 transition-colors"
              >
                <TableCell>
                  <TableUserCell
                    fallback={sub.plan.name.charAt(0)}
                    title={sub.plan.name}
                    subtitle={`ID: ${sub.transaction_id || "N/A"}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  Rs. {Number(sub.amount).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 capitalize text-slate-600">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    {sub.payment_type}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {format(new Date(sub.started_on), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {format(new Date(sub.expires_on), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      new Date(sub.expires_on) > new Date()
                        ? "default"
                        : "secondary"
                    }
                    className={
                      new Date(sub.expires_on) > new Date()
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-100 text-slate-600"
                    }
                  >
                    {new Date(sub.expires_on) > new Date()
                      ? "Active"
                      : "Expired"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
