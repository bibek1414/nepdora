"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, MessageSquare, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { htmlToPlainText } from "@/utils/html-sanitizer";

interface SMSDetailsDialogProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SMSDetailsDialog({ item, isOpen, onClose }: SMSDetailsDialogProps) {
  if (!item) return null;

  const isDelivered = item.status === "200";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            SMS Delivery Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl flex items-center justify-between ${isDelivered ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <div className="flex items-center gap-3">
              {isDelivered ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <div>
                <p className={`text-sm font-bold ${isDelivered ? 'text-green-950' : 'text-red-950'}`}>
                  {isDelivered ? 'Successfully Delivered' : 'Delivery Failed'}
                </p>
                <p className={`text-xs ${isDelivered ? 'text-green-700/70' : 'text-red-700/70'}`}>
                   Status Code: {item.status}
                </p>
              </div>
            </div>
            <Badge variant={isDelivered ? "default" : "destructive"} className={isDelivered ? "bg-green-600" : ""}>
               {isDelivered ? 'Delivered' : 'Failed'}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 p-3 rounded-lg border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <Phone className="h-3 w-3" />
                Recipient
              </div>
              <p className="text-sm font-bold text-slate-900">{item.receiver_number}</p>
            </div>
            <div className="space-y-1 p-3 rounded-lg border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <Calendar className="h-3 w-3" />
                Sent At
              </div>
              <p className="text-sm font-bold text-slate-900">
                {format(new Date(item.sent_at), "MMM d, yyyy · p")}
              </p>
            </div>
            <div className="space-y-1 p-3 rounded-lg border border-slate-100 bg-slate-50/30 shadow-none col-span-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <CreditCard className="h-3 w-3" />
                Investment
              </div>
              <p className="text-sm font-bold text-slate-900">{item.credits_used} Credits used</p>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight px-1">Message Content</div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {htmlToPlainText(item.message)}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline" className="font-semibold text-slate-600 border-slate-200">
                Close Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
