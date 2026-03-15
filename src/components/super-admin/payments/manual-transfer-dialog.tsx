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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTenants } from "@/hooks/super-admin/use-tenants";
import {
  useCreateTransfer,
  useSuperAdminPaymentSummary,
} from "@/hooks/super-admin/use-payments";
import { cn } from "@/lib/utils";

const formatTenantName = (name?: string) => {
  if (!name) return "";
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

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

  const [open, setOpen] = useState(false);

  const { data: tenantsData } = useTenants(1, 100, true);
  const { data: summaryData, isLoading: isLoadingSummary } =
    useSuperAdminPaymentSummary(tenant || undefined);
  const createTransfer = useCreateTransfer();

  const currentPendingBalance = summaryData?.pending_balance ?? 0;
  const isOverBalance =
    tenant && amount && parseFloat(amount) > currentPendingBalance;

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
            <Label
              htmlFor="tenant"
              className="text-xs font-semibold text-gray-600"
            >
              Select a tenant
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between border-gray-200 px-3 font-normal text-black"
                >
                  {tenant
                    ? formatTenantName(
                        tenantsData?.results.find(
                          domain => domain.tenant.schema_name === tenant
                        )?.tenant.name
                      ) || "Select a tenant"
                    : "Select a tenant"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[375px] p-0">
                <Command>
                  <CommandInput placeholder="Search tenant..." />
                  <CommandList>
                    <CommandEmpty>No tenant found.</CommandEmpty>
                    <CommandGroup>
                      {tenantsData?.results.map(domain => (
                        <CommandItem
                          key={domain.tenant.id}
                          value={`${domain.tenant.name} ${domain.tenant.schema_name}`}
                          onSelect={() => {
                            setTenant(domain.tenant.schema_name);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              tenant === domain.tenant.schema_name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {formatTenantName(domain.tenant.name)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {tenant && (
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-medium text-gray-500">
                  Pending Balance:
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    currentPendingBalance > 0
                      ? "text-emerald-600"
                      : "text-gray-400"
                  )}
                >
                  {isLoadingSummary
                    ? "..."
                    : `Rs. ${currentPendingBalance.toLocaleString()}`}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-xs font-semibold text-gray-600"
            >
              Transfer Amount (Rs.)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              className={cn(
                "border-gray-200 transition-colors",
                isOverBalance &&
                  "border-red-500 text-red-600 focus-visible:ring-red-500"
              )}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
            {isOverBalance && (
              <p className="text-[10px] font-medium text-red-500">
                Amount exceeds pending balance (Rs.{" "}
                {currentPendingBalance.toLocaleString()})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="date"
              className="text-xs font-semibold text-gray-600"
            >
              Transfer Date
            </Label>
            <Input
              id="date"
              type="date"
              className="border-gray-200 text-sm"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="note"
              className="text-xs font-semibold text-gray-600"
            >
              Reference Note (Optional)
            </Label>
            <Textarea
              id="note"
              placeholder="e.g. Bank transfer reference ID..."
              className="min-h-[100px] resize-none border-gray-200"
              value={note}
              onChange={e => setNote(e.target.value)}
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
              className="bg-[#003d79] text-white hover:bg-[#002d59]"
            >
              {createTransfer.isPending ? "Recording..." : "Record Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
