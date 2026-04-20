"use client";

import React, { useState } from "react";
import {
  useSMSBalance,
  useSMSPurchases,
  useSMSHistory,
} from "@/hooks/owner-site/admin/use-sms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  History as HistoryIcon,
  CreditCard,
  Plus,
  Loader2,
  Calendar,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SMSBuyCreditsDialog } from "@/components/site-owners/admin/sms/buy-credits-dialog";
import { SMSDetailsDialog } from "@/components/site-owners/admin/sms/sms-details-dialog";
import { format } from "date-fns";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import { htmlToPlainText } from "@/utils/html-sanitizer";
import Image from "next/image";

const PAYMENT_LOGOS: Record<string, string> = {
  esewa: "/images/payment-gateway/esewa.png",
  khalti: "/images/payment-gateway/khalti.png",
};

export default function SMSManagementPage() {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState<any | null>(null);

  const { data: balance, isLoading: isBalanceLoading } = useSMSBalance();
  const { data: purchases, isLoading: isPurchasesLoading } = useSMSPurchases();
  const { data: history, isLoading: isHistoryLoading } = useSMSHistory();

  return (
    <div className="container mx-auto h-screen space-y-8 -y-auto p-4 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold -tight text-slate-900">
            SMS Management
          </h1>
          <p className="text-slate-500">
            Track your SMS usage, check balance, and top up credits.
          </p>
        </div>
        <Button onClick={() => setShowBuyModal(true)} variant="default">
          <Plus className="mr-2 h-4 w-4 text-white" />
          Buy Credits
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="-sm transition- hover:-md border-blue-100 bg-blue-50/20">
          <CardHeader className="flex flex-row items-center justify-between px-1 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900">
              Current Balance
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isBalanceLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="text-3xl font-bold text-slate-900">
                {balance?.sms_credit ?? 0}
              </div>
            )}
            <p className="mt-1 text-[11px] font-medium -wider text-slate-500 ">
              Credits Available
            </p>
          </CardContent>
        </Card>

        <Card className="-sm transition- hover:-md border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between px-1 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Service Status
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isBalanceLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <Badge
                variant={balance?.sms_enabled ? "default" : "secondary"}
                className={
                  balance?.sms_enabled
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : ""
                }
              >
                {balance?.sms_enabled ? "Active" : "Disabled"}
              </Badge>
            )}
            <p className="mt-1 text-[11px] font-medium -wider text-slate-500 ">
              SMS System Status
            </p>
          </CardContent>
        </Card>

        <Card className="-sm transition- hover:-md border-slate-200 bg-white sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between px-1 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Total Spent
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {isPurchasesLoading ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <div className="text-3xl font-bold text-slate-900">
                Rs.{" "}
                {purchases
                  ?.reduce((acc, p) => acc + parseFloat(p.price), 0)
                  .toLocaleString("en-IN")}
              </div>
            )}
            <p className="mt-1 text-[11px] font-medium -wider text-slate-500 ">
              Lifetime Investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="mb-6 h-11 w-full justify-start rounded-lg bg-slate-100/50 p-1 md:w-auto">
          <TabsTrigger
            value="purchases"
            className="data-[state=active]:-sm rounded-md px-6 text-sm font-medium transition-all data-[state=active]:bg-white"
          >
            Purchase History
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:-sm rounded-md px-6 text-sm font-medium transition-all data-[state=active]:bg-white"
          >
            Sending History
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="purchases"
          className="animate-in fade-in-50 duration-500"
        >
          <Card className="- border-slate-200">
            <div className="">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Purchase ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Amount Paid
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Method
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isPurchasesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-6 py-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : purchases && purchases.length > 0 ? (
                    purchases.map(purchase => (
                      <tr
                        key={purchase.id}
                        className="transition-colors hover:bg-slate-50/50"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">
                          #{purchase.id}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {purchase.amount}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          Rs. {Number(purchase.price).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {purchase.payment_type ? (
                            <div className="flex items-center gap-2">
                              <div className="relative h-5 w-5 shrink-0 rounded">
                                <img
                                  src={
                                    PAYMENT_LOGOS[
                                      purchase.payment_type.toLowerCase()
                                    ] || ""
                                  }
                                  alt={purchase.payment_type}
                                  className="object-contain"
                                />
                              </div>
                              <span className="font-medium text-slate-600 capitalize">
                                {purchase.payment_type}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-slate-500">
                          {purchase.transaction_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {format(
                            new Date(purchase.purchased_at),
                            "MMM d, yyyy · p"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-slate-300" />
                          <p className="font-medium text-slate-500">
                            No purchase history found.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="history"
          className="animate-in fade-in-50 duration-500"
        >
          <Card className="-sm -hidden border-slate-200 text-balance">
            <div className="-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Receiver
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Message
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold -wider text-slate-500 ">
                      Sent At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isHistoryLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-6 py-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : history && history.length > 0 ? (
                    history.map(item => (
                      <tr
                        key={item.id}
                        className="cursor-pointer transition-colors hover:bg-slate-50/50"
                        onClick={() => setSelectedSMS(item)}
                      >
                        <td className="flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                          <Phone className="h-3 w-3 font-bold text-slate-400" />
                          {item.receiver_number}
                        </td>
                        <td className="max-w-[400px] min-w-[200px] px-6 py-4 text-sm text-slate-600">
                          <p className="line-clamp-2 leading-relaxed">
                            {htmlToPlainText(item.message)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {item.credits_used}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              item.status === "200" ? "default" : "destructive"
                            }
                            className={
                              item.status === "200"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                : ""
                            }
                          >
                            {item.status === "200" ? "Delivered" : "Failed"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                          {format(new Date(item.sent_at), "MMM d, yyyy · p")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-balance"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <HistoryIcon className="h-8 w-8 text-slate-300" />
                          <p className="font-medium text-slate-500">
                            No sending history found.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SMSBuyCreditsDialog open={showBuyModal} onOpenChange={setShowBuyModal} />
      <SMSDetailsDialog
        item={selectedSMS}
        isOpen={!!selectedSMS}
        onClose={() => setSelectedSMS(null)}
      />
    </div>
  );
}
