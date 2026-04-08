"use client";

import React, { useState } from "react";
import { TableWrapper } from "@/components/ui/custom-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  CreditCardIcon,
  Filter,
  User,
  Building2,
  Globe,
  Mail,
  Phone,
  Contact,
} from "lucide-react";
import { UserSubscription } from "@/types/subscription";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface SubscriptionsTableProps {
  subscriptions: UserSubscription[];
  isLoading: boolean;
}

export function SubscriptionsTable({
  subscriptions,
  isLoading,
}: SubscriptionsTableProps) {
  const [selectedSub, setSelectedSub] = useState<UserSubscription | null>(null);

  const getStatus = (expiresOn: string) => {
    return new Date(expiresOn) < new Date() ? "Expired" : "Active";
  };

  return (
    <div className="space-y-4">
      <TableWrapper>
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="w-[280px] text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                  Tenant
                </TableHead>
                <TableHead className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                  Plan
                </TableHead>
                <TableHead className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                  Amount
                </TableHead>
                <TableHead className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                  Payment
                </TableHead>
                <TableHead className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                  Validity
                </TableHead>
                <TableHead className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="h-6 w-6 text-slate-200" />
                      <p className="text-sm">No subscriptions found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map(sub => {
                  const status = getStatus(sub.expires_on);
                  const owner = sub.tenant?.owner;
                  return (
                    <TableRow
                      key={sub.id}
                      className="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60"
                      onClick={() => setSelectedSub(sub)}
                    >
                      {/* Tenant */}
                      <TableCell>
                        <div className="flex items-center gap-3 py-0.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                            {sub.tenant?.name?.charAt(0)?.toUpperCase() || "T"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800 capitalize">
                              {sub.tenant?.name || `Tenant #${sub.tenant?.id}`}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {owner?.first_name} {owner?.last_name}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Plan */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-md border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600"
                        >
                          {sub.plan.name}
                        </Badge>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="text-sm font-medium text-slate-800">
                        Rs. {Number(sub.amount).toLocaleString()}
                      </TableCell>

                      {/* Payment */}
                      <TableCell>
                        <p className="text-xs font-medium text-slate-700 capitalize">
                          {sub.payment_type}
                        </p>
                        <p className="mt-0.5 max-w-[110px] truncate font-mono text-[11px] text-slate-400">
                          {sub.transaction_id || "Cash"}
                        </p>
                      </TableCell>

                      {/* Validity */}
                      <TableCell>
                        <p className="text-xs text-slate-700">
                          Until{" "}
                          {format(new Date(sub.expires_on), "MMM d, yyyy")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          From {format(new Date(sub.started_on), "MMM d, yyyy")}
                        </p>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium ${
                            status === "Active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              status === "Active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableWrapper>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedSub}
        onOpenChange={open => !open && setSelectedSub(null)}
      >
        <DialogContent className="gap-0 overflow-hidden rounded-2xl border border-slate-100 p-0 shadow-lg sm:max-w-[560px]">
          {selectedSub &&
            (() => {
              const status = getStatus(selectedSub.expires_on);
              const contact = selectedSub.user || selectedSub.tenant?.owner;
              const contactName = contact
                ? `${contact.first_name || ""} ${contact.last_name || ""}`.trim()
                : null;
              const contactInitials = contactName
                ? contactName
                    .split(" ")
                    .map(w => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "?";

              return (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-base font-medium text-slate-500">
                        {selectedSub.tenant?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <DialogTitle className="text-base leading-none font-medium text-slate-900 capitalize">
                          {selectedSub.tenant?.name}
                        </DialogTitle>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="rounded border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600"
                          >
                            {selectedSub.plan.name}
                          </Badge>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium ${
                              status === "Active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`}
                            />
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="mb-1.5 text-[11px] text-slate-400">
                          Amount paid
                        </p>
                        <p className="text-xl font-medium text-slate-900">
                          Rs. {Number(selectedSub.amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="mb-1.5 text-[11px] text-slate-400">
                          Expires on
                        </p>
                        <p className="text-base font-medium text-slate-900">
                          {format(
                            new Date(selectedSub.expires_on),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Tenant Info */}
                    <div>
                      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                        <Building2 className="h-3.5 w-3.5" /> Tenant
                      </p>
                      <div className="divide-y divide-slate-100">
                        <div className="flex justify-between py-2.5">
                          <span className="text-xs text-slate-400">Domain</span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                            <Globe className="h-3.5 w-3.5 text-slate-300" />
                            {selectedSub.tenant?.schema_name}.nepdora.com
                          </span>
                        </div>
                        <div className="flex justify-between py-2.5">
                          <span className="text-xs text-slate-400">
                            Created
                          </span>
                          <span className="text-xs font-medium text-slate-700">
                            {selectedSub.tenant?.created_on}
                          </span>
                        </div>
                        <div className="flex justify-between py-2.5">
                          <span className="text-xs text-slate-400">
                            Account type
                          </span>
                          <span className="text-xs font-medium text-slate-700">
                            {selectedSub.tenant?.is_template_account
                              ? "Template"
                              : "Business"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Contact */}
                    <div>
                      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                        <User className="h-3.5 w-3.5" /> Contact
                      </p>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600">
                            {contactInitials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {contactName || "Not available"}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400 capitalize">
                              {contact?.role}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[11px] text-slate-400">Email</p>
                            <p className="mt-0.5 text-xs font-medium text-slate-700">
                              {contact?.email || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-400">Phone</p>
                            <p className="mt-0.5 text-xs font-medium text-slate-700">
                              {contact?.phone_number || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-400">
                              Platform
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-slate-700 capitalize">
                              {contact?.website_type || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Payment */}
                    <div>
                      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                        <CreditCardIcon className="h-3.5 w-3.5" /> Payment
                      </p>
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                        <div>
                          <p className="mb-1 text-[11px] text-slate-400">
                            Transaction ID
                          </p>
                          <p className="font-mono text-xs font-medium text-slate-700">
                            {selectedSub.transaction_id || "Cash transaction"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-white text-[11px] font-medium text-slate-600 capitalize"
                        >
                          {selectedSub.payment_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
