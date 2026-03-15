"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenants } from "@/hooks/super-admin/use-tenants";
import { useCreateTransfer, useSuperAdminPaymentSummary } from "@/hooks/super-admin/use-payments";
import { cn } from "@/lib/utils";

interface ManualTransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManualTransferDialog({
  isOpen,
  onClose,
}: ManualTransferDialogProps) {
  const [tenant, setTenant] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState<string>("");

  const { data: tenantsData } = useTenants(1, 100);
  const { data: summaryData, isLoading: isLoadingSummary } = useSuperAdminPaymentSummary(tenant || undefined);
  const createTransfer = useCreateTransfer();

  const currentPendingBalance = summaryData?.pending_balance ?? 0;
  const isOverBalance = tenant && amount && parseFloat(amount) > currentPendingBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant || !amount || !date) return;

    createTransfer.mutate(
      {
        tenant: tenant,
        amount: parseFloat(amount),
        transfer_date: date,
        reference_note: note,
      },
      {
        onSuccess: () => {
          onClose();
          setTenant("");
          setAmount("");
          setNote("");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Record Manual Transfer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tenant" className="text-xs font-semibold text-gray-600">
              Select Tenant
            </Label>
            <Select value={tenant} onValueChange={setTenant}>
              <SelectTrigger className="border-gray-200">
                <SelectValue placeholder="Select a tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenantsData?.results.map((domain) => (
                  <SelectItem key={domain.tenant.id} value={domain.tenant.schema_name}>
                    {domain.tenant.name} ({domain.tenant.schema_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tenant && (
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-gray-500 font-medium">Pending Balance:</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  currentPendingBalance > 0 ? "text-emerald-600" : "text-gray-400"
                )}>
                  {isLoadingSummary ? "..." : `Rs. ${currentPendingBalance.toLocaleString()}`}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-xs font-semibold text-gray-600">
              Transfer Amount (Rs.)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              className={cn(
                "border-gray-200 transition-colors",
                isOverBalance && "border-red-500 focus-visible:ring-red-500 text-red-600"
              )}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {isOverBalance && (
              <p className="text-[10px] text-red-500 font-medium">
                Amount exceeds pending balance (Rs. {currentPendingBalance.toLocaleString()})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-xs font-semibold text-gray-600">
              Transfer Date
            </Label>
            <Input
              id="date"
              type="date"
              className="border-gray-200 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-xs font-semibold text-gray-600">
              Reference Note (Optional)
            </Label>
            <Textarea
              id="note"
              placeholder="e.g. Bank transfer reference ID..."
              className="min-h-[100px] resize-none border-gray-200"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTransfer.isPending}
              className="bg-[#003d79] hover:bg-[#002d59] text-white"
            >
              {createTransfer.isPending ? "Recording..." : "Record Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
