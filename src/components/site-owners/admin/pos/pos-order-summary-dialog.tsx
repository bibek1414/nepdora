"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Receipt, Undo2 } from "lucide-react";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center justify-center space-y-2">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Order Successful!
          </DialogTitle>
          <DialogDescription>
            The order has been processed correctly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 rounded-xl bg-gray-50 p-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Bill</span>
              <span className="font-semibold text-gray-900">
                Rs. {total.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Amount Paid</span>
              <span className="font-semibold text-gray-900">
                Rs. {amountPaid.toLocaleString()}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Change to Return</span>
              <span className="text-primary">
                Rs. {change.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="bg-primary hover:bg-primary flex-1 gap-2 rounded-xl"
            onClick={onClose}
          >
            <Undo2 className="h-4 w-4" />
            New Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
