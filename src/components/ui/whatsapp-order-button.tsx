import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/types/owner-site/admin/orders";

interface WhatsAppOrderButtonProps {
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

const getWhatsAppMessage = (order: Order) => {
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
    return cleanPhone;
  }

  // Remove leading zero if present and add country code
  const phoneWithoutZero = cleanPhone.startsWith("0")
    ? cleanPhone.slice(1)
    : cleanPhone;
  return `977${phoneWithoutZero}`;
};

export const WhatsAppOrderButton: React.FC<WhatsAppOrderButtonProps> = ({
  order,
  size = "sm",
  variant = "default",
  className = "",
  disabled = false,
  children,
  showIcon = true,
}) => {
  const handleSendWhatsApp = () => {
    if (!order.customer_phone) {
      toast.error("No phone number found for this customer");
      return;
    }

    try {
      const message = getWhatsAppMessage(order);
      const formattedPhone = formatPhoneNumber(order.customer_phone);
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
      toast.success("WhatsApp opened with message");
    } catch (error) {
      toast.error("Failed to open WhatsApp");
    }
  };

  const isDisabled = disabled || !order.customer_phone;

  // Default styling for WhatsApp button
  const whatsappClassName =
    variant === "default"
      ? `bg-green-600 hover:bg-green-700 text-white ${className}`
      : className;

  return (
    <Button
      onClick={handleSendWhatsApp}
      size={size}
      variant={variant}
      className={whatsappClassName}
      disabled={isDisabled}
      title={isDisabled ? "No phone number available" : "Send WhatsApp message"}
    >
      {showIcon && <MessageCircle className="mr-1 h-4 w-4" />}
      {children || "WhatsApp"}
    </Button>
  );
};
