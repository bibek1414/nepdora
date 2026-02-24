"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/owner-site/admin/use-cart";

interface CartIconProps {
  onToggleCart: () => void;
  customIcon?: React.ReactNode;
}

export const CartIcon = ({ onToggleCart, customIcon }: CartIconProps) => {
  const { itemCount } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onToggleCart}
    >
      {customIcon ? customIcon : <ShoppingCart className="h-5 w-5" />}
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
        >
          {itemCount}
        </Badge>
      )}
      <span className="sr-only">Shopping Cart</span>
    </Button>
  );
};
