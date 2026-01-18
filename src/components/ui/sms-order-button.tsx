import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/types/owner-site/admin/orders";

interface SMSOrderButtonProps {
  order: Order;
  size?: "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  showIcon?: boolean;
}

const getSMSMessage = (order: Order) => {
  const customerName = order.customer_name || "Valued Customer";
  const orderNumber = order.order_number;
  const orderItems = order.order_items || order.items || [];

  // Build product list
  const productList = orderItems
    .map(
      item =>
        `- ${item.product?.name || `Product #${item.product_id}`} (Qty: ${item.quantity})`
    )
    .join("\n");

  const message = `Hello ${customerName}! 👋

Your order #${orderNumber} has been placed successfully! ✅

📞 Phone: ${order.customer_phone}
🏠 Address: ${order.shipping_address}

🛒 Products:
${productList}

💰 Total Amount: Rs.${order.total_amount}

Thank you for shopping with us! 🙏`;

  return message;
};

const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Add Nepal country code if not present
  if (cleanPhone.startsWith("977")) {
    return `+${cleanPhone}`;
  }

  // Remove leading zero if present and add country code
  const phoneWithoutZero = cleanPhone.startsWith("0")
    ? cleanPhone.slice(1)
    : cleanPhone;
  return `+977${phoneWithoutZero}`;
};

export const SMSOrderButton: React.FC<SMSOrderButtonProps> = ({
  order,
  size = "sm",
  variant = "default",
  className = "",
  disabled = false,
  children,
  showIcon = true,
}) => {
  const handleSendSMS = () => {
    if (!order.customer_phone) {
      toast.error("No phone number found for this customer");
      return;
    }

    try {
      const message = getSMSMessage(order);
      const formattedPhone = formatPhoneNumber(order.customer_phone);
      const smsUrl = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`;

      // Open the SMS app with pre-filled message
      window.location.href = smsUrl;
      toast.success("SMS app opened with message");
    } catch (error) {
      toast.error("Failed to open SMS app");
    }
  };

  const isDisabled = disabled || !order.customer_phone;

  // Default styling for SMS button
  const smsClassName =
    variant === "default"
      ? `bg-primary hover:bg-primary text-white ${className}`
      : className;

  return (
    <Button
      onClick={handleSendSMS}
      size={size}
      variant={variant}
      className={smsClassName}
      disabled={isDisabled}
      title={isDisabled ? "No phone number available" : "Send SMS message"}
    >
      {showIcon && <MessageSquare className="mr-1 h-4 w-4" />}
      {children || "SMS"}
    </Button>
  );
};
