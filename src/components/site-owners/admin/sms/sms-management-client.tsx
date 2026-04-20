"use client";

import React, { useState } from "react";
import { useSMSBalance, useSMSPurchases } from "@/hooks/owner-site/admin/use-sms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  CreditCard,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SMSBuyCreditsDialog } from "@/components/site-owners/admin/sms/buy-credits-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SMSPurchaseHistory } from "./sms-purchase-history";
import { SMSSendingHistory } from "./sms-sending-history";

export function SMSManagementClient() {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const { data: balance, isLoading: isBalanceLoading } = useSMSBalance();
  const { data: purchases, isLoading: isPurchasesLoading } = useSMSPurchases(1);

  const purchaseItems = purchases?.results || [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SMS Management</h1>
          <p className="text-slate-500">
            Track your SMS usage, check balance, and top up credits.
          </p>
        </div>
        <Button
          onClick={() => setShowBuyModal(true)}
          className="h-10 rounded-lg bg-slate-900 px-6 font-semibold text-white transition-all hover:bg-slate-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Buy Credits
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="-sm transition-all hover:-md border-blue-100 bg-blue-50/20">
          <CardHeader className="flex flex-row items-center justify-between px-4 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900">
              Current Balance
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="px-4">
            {isBalanceLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="text-3xl font-bold text-slate-900">
                {balance?.sms_credit ?? 0}
              </div>
            )}
            <p className="mt-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Credits Available
            </p>
          </CardContent>
        </Card>

        <Card className="-sm transition-all hover:-md border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between px-4 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Service Status
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="px-4">
            {isBalanceLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <Badge
                variant={balance?.sms_enabled ? "default" : "secondary"}
                className={
                  balance?.sms_enabled
                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-none -none"
                    : ""
                }
              >
                {balance?.sms_enabled ? "Active" : "Disabled"}
              </Badge>
            )}
            <p className="mt-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              SMS System Status
            </p>
          </CardContent>
        </Card>

        <Card className="-sm transition-all hover:-md border-slate-200 bg-white sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between px-4 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Total Spent
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="px-4">
            {isPurchasesLoading ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <div className="text-3xl font-bold text-slate-900">
                Rs.{" "}
                {purchaseItems
                  ?.reduce((acc, p) => acc + parseFloat(p.price), 0)
                  .toLocaleString("en-IN")}
              </div>
            )}
            <p className="mt-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Lifetime Investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="mb-6 h-11 w-full justify-start rounded-lg bg-slate-100/50 p-1 md:w-auto border border-black/5">
          <TabsTrigger
            value="purchases"
            className="data-[state=active]:-sm cursor-pointer rounded-md px-6 text-sm font-medium transition-all data-[state=active]:bg-white"
          >
            Purchase History
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:-sm cursor-pointer rounded-md px-6 text-sm font-medium transition-all data-[state=active]:bg-white"
          >
            Sending History
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="purchases"
          className="animate-in fade-in-50 duration-500 outline-none"
        >
          <SMSPurchaseHistory showTitle={false} />
        </TabsContent>

        <TabsContent
          value="history"
          className="animate-in fade-in-50 duration-500 outline-none"
        >
          <SMSSendingHistory showTitle={false} />
        </TabsContent>
      </Tabs>

      <SMSBuyCreditsDialog open={showBuyModal} onOpenChange={setShowBuyModal} />
    </div>
  );
}
