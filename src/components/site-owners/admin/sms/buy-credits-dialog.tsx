"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Loader2, Info } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface SMSBuyCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SMS_PACKAGES = [
  { amount: 100, price: 100 },
  { amount: 500, price: 500 },
  { amount: 1000, price: 900, discount: "10% Off" },
  { amount: 5000, price: 4250, discount: "15% Off" },
];

const PAYMENT_METHODS = [
  { id: "esewa", name: "eSewa", image: "/images/payment-gateway/esewa.png" },
  { id: "khalti", name: "Khalti", image: "/images/payment-gateway/khalti.png" },
];

export function SMSBuyCreditsDialog({ open, onOpenChange }: SMSBuyCreditsDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | "custom">(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeAmount = selectedPackage === "custom" ? parseInt(customAmount) || 0 : selectedPackage;
  const activePrice = selectedPackage === "custom" ? activeAmount : SMS_PACKAGES.find(p => p.amount === selectedPackage)?.price || 0;

  const handleInitiatePayment = async () => {
    if (!activeAmount || activeAmount < 10) {
      toast.error("Minimum purchase is 10 credits");
      return;
    }
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsLoading(true);
    const transactionId = `SMS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const response = await fetch("/api/sms/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: activePrice.toString(),
          productName: `${activeAmount} SMS Credits`,
          transactionId,
          method: selectedMethod,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Initiation failed");
      }

      // Store pending payment info for verification
      sessionStorage.setItem("sms_payment_pending", JSON.stringify({
        amount: activeAmount,
        price: activePrice,
        transaction_id: transactionId,
        method: selectedMethod,
      }));

      // Redirect or submit form
      if (selectedMethod === "khalti") {
        window.location.href = result.data.khaltiPaymentUrl;
      } else if (selectedMethod === "esewa") {
        const { esewaConfig } = result.data;
        const form = document.createElement("form");
        form.method = "POST";
        form.action = esewaConfig.payment_url;

        Object.entries(esewaConfig).forEach(([key, value]) => {
          if (key === "payment_url") return;
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-6 lg:p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-slate-900">Buy SMS Credits</DialogTitle>
          <DialogDescription>
            Top up your account to continue sending automated notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Select Amount */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">Select Package</Label>
            <div className="grid grid-cols-2 gap-3">
              {SMS_PACKAGES.map(pkg => (
                <button
                  key={pkg.amount}
                  onClick={() => setSelectedPackage(pkg.amount)}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all",
                    selectedPackage === pkg.amount
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                      : "border-slate-100 hover:border-blue-200"
                  )}
                >
                  <span className="text-lg font-bold text-slate-900">{pkg.amount}</span>
                  <span className="text-xs text-slate-500 font-medium">Credits</span>
                  <div className="mt-1 text-sm font-bold text-blue-600">Rs. {pkg.price.toLocaleString("en-IN")}</div>
                  {pkg.discount && (
                    <span className="absolute -top-2 -right-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      {pkg.discount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setSelectedPackage("custom")}
              className={cn(
                "w-full rounded-xl border-2 p-3 text-sm font-semibold transition-all",
                selectedPackage === "custom"
                  ? "border-blue-600 bg-blue-50/50 text-blue-600"
                  : "border-slate-100 text-slate-600 hover:border-blue-200"
              )}
            >
              Custom Amount
            </button>

            {selectedPackage === "custom" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-3">
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter number of credits..."
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">#</span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
                  <Info className="h-3 w-3" /> 1 Credit = Rs. 1.00
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Select Method */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl border-2 p-3 transition-all",
                    selectedMethod === method.id
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-100 hover:border-blue-200"
                  )}
                >
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md grayscale transition-all group-hover:grayscale-0">
                    <img src={method.image} alt={method.name} className="object-contain" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{method.name}</span>
                  {selectedMethod === method.id && (
                    <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8">
          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-bold shadow-md transition-all active:scale-[0.98]"
            disabled={!activeAmount || !selectedMethod || isLoading}
            onClick={handleInitiatePayment}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay Rs. ${activePrice.toLocaleString("en-IN")}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
