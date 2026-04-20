"use client";

import { useState } from "react";
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
import { useAddSMSCredit } from "@/hooks/super-admin/use-sms";
import { Loader2 } from "lucide-react";

interface AddCreditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: number | null;
  tenantName: string | null;
}

export function AddCreditDialog({
  isOpen,
  onClose,
  tenantId,
  tenantName,
}: AddCreditDialogProps) {
  const [amount, setAmount] = useState<string>("");
  const addCreditMutation = useAddSMSCredit();

  const handleAdd = async () => {
    if (!tenantId || !amount || isNaN(Number(amount))) return;

    try {
      await addCreditMutation.mutateAsync({
        client: tenantId,
        amount: Number(amount),
      });
      setAmount("");
      onClose();
    } catch (error) {
      // Error handled in the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add SMS Credit</DialogTitle>
          <p className="text-muted-foreground mt-1 text-sm">
            Adding credits to{" "}
            <span className="font-semibold text-slate-900">{tenantName}</span>
          </p>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="items-center gap-4">
            <Label htmlFor="amount" className="mb-2 block">
              Credit Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={e => {
                const value = e.target.value;

                if (/^\d*$/.test(value)) {
                  setAmount(value);
                }
              }}
              placeholder="e.g. 500"
              className="placeholder:text-slate-400"
              disabled={addCreditMutation.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={addCreditMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={
              !amount || Number(amount) <= 0 || addCreditMutation.isPending
            }
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            {addCreditMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
