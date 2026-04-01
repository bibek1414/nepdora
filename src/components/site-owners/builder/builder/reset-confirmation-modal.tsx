import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Loader2, X } from "lucide-react";

interface ResetConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isReseting: boolean;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isReseting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] gap-0 overflow-hidden border-0 p-0 rounded-xl shadow-2xl">
        {/* Header with Icon */}
        <div className="bg-white p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 shadow-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-4">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Reset all changes?
            </DialogTitle>
            <DialogDescription className="mt-2 text-[13px] leading-relaxed text-slate-600">
              This will revert your site to the last published version. All your
              current unsaved edits will be permanently lost. This action cannot
              be undone.
            </DialogDescription>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="border-y border-red-100/50 bg-red-50/50 px-6 py-3">
          <div className="flex items-center gap-2 text-[12px] font-medium text-red-700">
            <RotateCcw className="h-3.5 w-3.5" />
            Reverting to the previous stable state
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex flex-row items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button
            variant="ghost"
            className="h-10 px-4 text-xs border"
            onClick={() => onOpenChange(false)}
            disabled={isReseting}
          >
            Keep my edits
          </Button>
          <Button
            className="h-10 bg-red-600 px-6 text-xs text-white shadow-lg shadow-red-200 transition-all hover:-translate-y-px hover:bg-red-700 active:translate-y-0"
            onClick={onConfirm}
            disabled={isReseting}
          >
            {isReseting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Yes, reset everything"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
