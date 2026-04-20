"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Order } from "@/types/owner-site/admin/orders";
import { useSendSMS, useSMSBalance } from "@/hooks/owner-site/admin/use-sms";
import { useSMSSettings } from "@/hooks/owner-site/admin/use-sms-setting";
import {
  Loader2,
  MessageSquare,
  AlertCircle,
  Info,
  User,
  Package,
  Calendar,
  IndianRupee,
  Activity,
  CreditCard,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TipTapSimple, { TipTapSimpleRef } from "@/components/ui/tip-tap-simple";
import { htmlToPlainText } from "@/utils/html-sanitizer";
import { toast } from "sonner";

interface SendSMSDialogProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TAGS = [
  { label: "Name", value: "name", icon: <User className="h-3 w-3" /> },
  {
    label: "Products",
    value: "products",
    icon: <Package className="h-3 w-3" />,
  },
  {
    label: "Location",
    value: "location",
    icon: <Package className="h-3 w-3" />,
  },
  {
    label: "Order #",
    value: "order_number",
    icon: <Package className="h-3 w-3" />,
  },
  {
    label: "Status",
    value: "order_status",
    icon: <Activity className="h-3 w-3" />,
  },
  {
    label: "Date",
    value: "order_date",
    icon: <Calendar className="h-3 w-3" />,
  },
  {
    label: "Amount",
    value: "total_amount",
    icon: <IndianRupee className="h-3 w-3" />,
  },
  {
    label: "Payment",
    value: "payment_type",
    icon: <CreditCard className="h-3 w-3" />,
  },
];

export const SendSMSDialog: React.FC<SendSMSDialogProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [htmlContent, setHtmlContent] = useState("");
  const tiptapRef = useRef<TipTapSimpleRef>(null);
  const { data: settings } = useSMSSettings();
  const { data: balance } = useSMSBalance();
  const sendSMS = useSendSMS();

  const plainText = htmlToPlainText(htmlContent);
  const isUnicode = (text: string) => /[^\u0000-\u007F]/.test(text);
  const charLimit = isUnicode(plainText) ? 70 : 160;
  const smsSegments = Math.ceil(plainText.length / charLimit) || 1;

  useEffect(() => {
    if (isOpen) {
      const defaultTemplate =
        "Hi {{name}}, Order #{{order_number}} ({{products}}) worth Rs. {{total_amount}} is {{order_status}} on {{order_date}}. Location: {{location}}. Payment: {{payment_type}}.";
      setHtmlContent(defaultTemplate);
    }
  }, [isOpen]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getReplacedMessage = (text: string) => {
    const productNames = (order.items || order.order_items || [])
      .map(
        item => item.product?.name || item.variant?.product?.name || "Product"
      )
      .join(", ");

    return text
      .replace(/{{name}}/g, order.customer_name || "Customer")
      .replace(/{{customer_name}}/g, order.customer_name || "Customer") // Support both
      .replace(/{{products}}/g, productNames || "your items")
      .replace(/{{location}}/g, order.customer_address || "your location")
      .replace(/{{order_number}}/g, order.order_number || "")
      .replace(/{{order_status}}/g, order.status || "")
      .replace(/{{order_date}}/g, formatDate(order.created_at))
      .replace(/{{total_amount}}/g, order.total_amount?.toString() || "0")
      .replace(/{{payment_type}}/g, order.payment_type || "N/A");
  };

  const insertTag = (tag: string) => {
    if (tiptapRef.current?.editor) {
      tiptapRef.current.editor.commands.insertContent(`{{${tag}}}`);
      tiptapRef.current.editor.commands.focus();
    }
  };

  const handleSend = async () => {
    try {
      const finalPlainMessage = getReplacedMessage(plainText);

      await sendSMS.mutateAsync({
        order_id: order.id,
        phone_number: order.customer_phone,
        message: finalPlainMessage,
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to send SMS message");
    }
  };

  const canSend =
    plainText.trim().length > 0 &&
    order.customer_phone &&
    (balance?.sms_credit || 0) >= smsSegments;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="-2xl overflow-hidden border-none p-0 sm:max-w-[550px]">
        <DialogHeader className="border-b border-gray-100 bg-white px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold">
            <div className="rounded-lg bg-blue-50 p-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            Send Order Update
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-6">
          {/* Recipient Info */}
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 ring-1 ring-gray-900/5">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="font-bold text-gray-900">
                  {order.customer_name || "Valued Customer"}
                </p>
                <Badge
                  variant="outline"
                  className="border-gray-200 bg-white py-0 text-[10px]"
                >
                  #{order.order_number}
                </Badge>
              </div>
              <p className="text-xs font-medium text-gray-500">
                Recipient Number:{" "}
                <span className="font-bold text-gray-900">
                  {order.customer_phone || "Not Set"}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-[10px] font-bold text-gray-400">
                Available Balance
              </p>
              <p
                className={`text-lg font-bold ${balance?.sms_credit && balance.sms_credit < smsSegments ? "text-rose-500" : "text-blue-600"}`}
              >
                {balance?.sms_credit || 0}{" "}
                <span className="ml-0.5 text-xs font-medium text-gray-400">
                  Credits
                </span>
              </p>
            </div>
          </div>

          {/* Editor Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="-widest px-1 text-xs font-bold text-gray-500">
                Message Content
              </Label>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                <Info className="h-3 w-3" />
                {plainText.length} chars • {smsSegments} Segment
                {smsSegments > 1 ? "s" : ""}
              </div>
            </div>

            <div className="-sm overflow-hidden rounded-xl border border-gray-200 bg-white ring-1 ring-gray-900/5 transition-all focus-within:border-blue-500 focus-within:ring-blue-500/20">
              <TipTapSimple
                ref={tiptapRef}
                value={htmlContent}
                onChange={setHtmlContent}
                minHeight="140px"
                className="border-none"
                placeholder="Personalize your message..."
              />

              {/* Tag Toolbar */}
              <div className="flex flex-wrap gap-1.5 border-t border-gray-100 bg-gray-50/50 px-3 py-2.5">
                {TAGS.map(tag => (
                  <Button
                    key={tag.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTag(tag.value)}
                    className="h-7 border-gray-200 bg-white px-2.5 text-[11px] font-bold text-gray-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                  >
                    {tag.icon}
                    <span className="ml-1.5">{tag.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Large Preview */}
          <div className="space-y-3">
            <div className="-widest flex items-center gap-2 px-1 text-xs font-bold text-gray-500">
              <Eye className="h-3 w-3" />
              Live SMS Preview
            </div>
            <div className="relative overflow-hidden rounded-xl border border-blue-100/50 bg-blue-50/30 p-4">
              <div className="absolute top-0 right-0 p-2 text-[10px] font-bold opacity-5 select-none">
                CONFIDENTIAL
              </div>
              <p className="text-sm leading-relaxed font-semibold whitespace-pre-wrap text-gray-700">
                {getReplacedMessage(plainText) || (
                  <span className="font-normal text-gray-300">
                    Message preview will appear here...
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Validation Messages */}
          {!order.customer_phone && (
            <div className="flex animate-pulse items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-xs text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="font-bold">
                Missing Phone Number: Customer phone is required to send this
                SMS.
              </div>
            </div>
          )}

          {balance?.sms_credit !== undefined &&
            balance.sms_credit < smsSegments && (
              <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3.5 text-xs font-bold text-amber-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                Low Balance: You need {smsSegments} credits but only have{" "}
                {balance.sms_credit} remaining.
              </div>
            )}
        </div>

        <DialogFooter className="gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-full font-bold text-gray-500 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!canSend || sendSMS.isPending}
            className="-lg -blue-500/20 rounded-full bg-blue-600 px-8 font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            {sendSMS.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
