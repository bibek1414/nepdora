"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface POSOrderSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  amountPaid: number;
  change: number;
  onClose: () => void;
}

export function POSOrderSummaryDialog({
  open,
  onOpenChange,
  total,
  amountPaid,
  change,
  onClose,
}: POSOrderSummaryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {/* Success header */}
        <DialogHeader className="flex flex-col items-center justify-center gap-3 py-2">
          <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-7 w-7" />
          </div>
          <div className="space-y-0.5 text-center">
            <DialogTitle className="text-foreground text-xl font-semibold">
              Payment received
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Order has been processed successfully
            </p>
          </div>
        </DialogHeader>

        {/* Receipt rows */}
        <div className="border-border bg-muted/30 space-y-1 rounded-xl border px-4 py-3">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground text-sm">Total bill</span>
            <span className="text-foreground text-sm font-semibold">
              Rs. {total.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground text-sm">Amount paid</span>
            <span className="text-foreground text-sm font-semibold">
              Rs. {amountPaid.toLocaleString()}
            </span>
          </div>
          <div className="border-border my-1 border-t" />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-foreground text-sm font-medium">
              Change to return
            </span>
            <span className="text-primary text-lg font-bold">
              Rs. {change.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action */}
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl font-medium active:scale-[0.98]"
          onClick={onClose}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start new order
        </Button>
      </DialogContent>
    </Dialog>
  );
}
