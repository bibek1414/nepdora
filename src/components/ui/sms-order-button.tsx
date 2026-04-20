import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Order } from "@/types/owner-site/admin/orders";
import { SendSMSDialog } from "./send-sms-dialog";

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
  onSuccess?: () => void;
}


export const SMSOrderButton: React.FC<SMSOrderButtonProps> = ({
  order,
  size = "sm",
  variant = "default",
  className = "",
  disabled = false,
  children,
  showIcon = true,
  onSuccess,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const isDisabled = disabled || !order.customer_phone;

  // Default styling for SMS button
  const smsClassName =
    variant === "default"
      ? `bg-primary hover:bg-primary text-white ${className}`
      : className;

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        size={size}
        variant={variant}
        className={smsClassName}
        disabled={isDisabled}
        title={isDisabled ? "No phone number available" : "Send SMS message"}
      >
        {showIcon && <MessageSquare className="mr-1 h-4 w-4" />}
        {children || "SMS"}
      </Button>

      <SendSMSDialog
        order={order}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
};

