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
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-0.5 text-center">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Payment received
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Order has been processed successfully
            </p>
          </div>
        </DialogHeader>

        {/* Receipt rows */}
        <div className="space-y-1 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-muted-foreground">Total bill</span>
            <span className="text-sm font-semibold text-foreground">
              Rs. {total.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-muted-foreground">Amount paid</span>
            <span className="text-sm font-semibold text-foreground">
              Rs. {amountPaid.toLocaleString()}
            </span>
          </div>
          <div className="my-1 border-t border-border" />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm font-medium text-foreground">Change to return</span>
            <span className="text-lg font-bold text-primary">
              Rs. {change.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action */}
        <Button
          className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
          onClick={onClose}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start new order
        </Button>
      </DialogContent>
    </Dialog>
  );
}
