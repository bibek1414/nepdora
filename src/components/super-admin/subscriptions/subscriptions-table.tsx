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
  Calendar,
  Contact,
  Globe,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
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
    const isExpired = new Date(expiresOn) < new Date();
    return isExpired ? "Expired" : "Active";
  };

  return (
    <div className="space-y-4">
      <TableWrapper>
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 text-[11px] font-semibold text-slate-500 hover:bg-slate-50/50">
                <TableHead className="w-[300px]">Tenant & Owner</TableHead>
                <TableHead>Current Plan</TableHead>
                <TableHead>Subscription Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Validity Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground h-48 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="h-8 w-8 text-slate-200" />
                      <p>No subscriptions matching your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map(sub => (
                  <TableRow
                    key={sub.id}
                    className="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80"
                    onClick={() => setSelectedSub(sub)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 py-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-sm font-bold text-slate-600 transition-colors">
                          {sub.tenant?.name?.charAt(0) || "T"}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-bold text-slate-900">
                            {sub.tenant?.name || `Tenant #${sub.tenant?.id}`}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-medium text-slate-500 opacity-80">
                            Managed by {sub.tenant?.owner?.first_name}{" "}
                            {sub.tenant?.owner?.last_name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-md border-blue-100 bg-blue-50/50 px-2 py-0.5 font-semibold text-blue-700"
                      >
                        {sub.plan.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">
                      Rs. {Number(sub.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 capitalize">
                          <CreditCardIcon className="h-3 w-3 text-slate-400" />
                          {sub.payment_type}
                        </div>
                        <code className="mt-0.5 max-w-[100px] truncate font-mono text-[10px] text-slate-400">
                          {sub.transaction_id || "Cash Transaction"}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-0.5 text-[11px]">
                        <span className="font-medium text-slate-500">
                          Valid until{" "}
                          {format(new Date(sub.expires_on), "MMM d, yyyy")}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Started on{" "}
                          {format(new Date(sub.started_on), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          getStatus(sub.expires_on) === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          getStatus(sub.expires_on) === "Active"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-slate-200 bg-slate-100 text-slate-600"
                        }
                      >
                        <div
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${getStatus(sub.expires_on) === "Active" ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        {getStatus(sub.expires_on)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableWrapper>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedSub}
        onOpenChange={open => !open && setSelectedSub(null)}
      >
        <DialogContent className="gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-2xl outline-none sm:max-w-[700px]">
          {selectedSub && (
            <>
              {/* Clean Header */}
              <div className="bg-white p-10 text-slate-900 border-b border-slate-100 relative">
                <div className="absolute top-6 right-6 bg-slate-50 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-tight text-slate-400 border border-slate-100 uppercase">
                  REF #{selectedSub.id}
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-3xl text-slate-400 shadow-sm">
                    {selectedSub.tenant?.name?.charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight leading-none flex items-center gap-3">
                      {selectedSub.tenant?.name}
                      <ShieldCheck className="h-6 w-6 text-indigo-500" />
                    </h2>
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <div className="px-3 py-1 bg-slate-50 rounded-lg flex items-center gap-2 border border-slate-100">
                         <Zap className="h-3.5 w-3.5 text-indigo-500" />
                         {selectedSub.plan.name} Plan
                      </div>
                      <span className="opacity-40">•</span>
                      <span className="bg-emerald-50 px-3 py-1 rounded-lg text-emerald-600 text-xs flex items-center gap-1.5 border border-emerald-100 uppercase font-bold tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {getStatus(selectedSub.expires_on)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-10 bg-white max-h-[75vh] overflow-y-auto">
                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 tracking-tight block mb-2 uppercase">Amount paid</span>
                    <div className="text-2xl font-black text-slate-900 leading-none">
                      Rs. {Number(selectedSub.amount).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 tracking-tight block mb-2 uppercase">Subscription ends</span>
                    <div className="text-2xl font-black text-slate-900 leading-none">
                      {format(new Date(selectedSub.expires_on), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>

                {/* Tenant Details */}
                <div className="space-y-6">
                   <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                     <Building2 className="h-4 w-4 text-indigo-600" />
                     Tenant Information
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-1">
                      <div className="space-y-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">Schema name</label>
                          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-slate-300" />
                            {selectedSub.tenant?.schema_name}.nepdora.com
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">Account created</label>
                          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-300" />
                            {selectedSub.tenant?.created_on}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">Account status</label>
                          <div className="mt-1">
                            <Badge variant="secondary" className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 text-indigo-600 border-indigo-100 rounded-lg">
                              {selectedSub.tenant?.is_template_account ? "Template Account" : "Registered Business Account"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* Owner Details */}
                <div className="space-y-6">
                   <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                     <User className="h-4 w-4 text-indigo-600" />
                     Primary Contact Details
                   </h3>
                   <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600 shadow-sm text-lg">
                              {selectedSub.user?.first_name?.charAt(0)}{selectedSub.user?.last_name?.charAt(0)}
                           </div>
                           <div>
                              <h4 className="font-black text-slate-900 text-lg leading-none">
                                {selectedSub.user?.first_name} {selectedSub.user?.last_name}
                              </h4>
                              <p className="text-xs text-indigo-500 font-bold mt-1.5 tracking-tight flex items-center gap-1.5">
                                 <ShieldCheck className="h-3.5 w-3.5" />
                                 Account {selectedSub.user?.role}
                              </p>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                           <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-2xl border border-slate-100">
                              <div className="p-2 bg-slate-50 rounded-lg">
                                 <Mail className="h-4 w-4 text-slate-400" />
                              </div>
                              <span className="text-xs font-bold">{selectedSub.user?.email}</span>
                           </div>
                           <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-2xl border border-slate-100">
                              <div className="p-2 bg-slate-50 rounded-lg">
                                 <Phone className="h-4 w-4 text-slate-400" />
                              </div>
                              <span className="text-xs font-bold">{selectedSub.user?.phone_number}</span>
                           </div>
                           <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-2xl border border-slate-100">
                              <div className="p-2 bg-slate-50 rounded-lg">
                                 <Contact className="h-4 w-4 text-slate-400" />
                              </div>
                              <span className="text-xs font-bold capitalize">{selectedSub.user?.website_type} platform</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* Transaction */}
                <div className="space-y-6">
                   <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                     <CreditCardIcon className="h-4 w-4 text-indigo-600" />
                     Payment Proof & Reference
                   </h3>
                   <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 shadow-sm border-dashed">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 tracking-tight uppercase">Transaction ID</label>
                        <p className="text-sm font-mono font-bold tracking-tight text-slate-600">{selectedSub.transaction_id || "Cash Transaction Logged"}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <label className="text-[10px] font-black text-slate-400 tracking-tight uppercase">Channel</label>
                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 font-bold px-3 py-1 text-xs">
                          {selectedSub.payment_type}
                        </Badge>
                      </div>
                   </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
