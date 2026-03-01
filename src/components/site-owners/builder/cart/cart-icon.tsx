"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import Link from "next/link";

interface CartIconProps {
  onToggleCart?: () => void;
  customIcon?: React.ReactNode;
  href?: string;
}

export const CartIcon = ({ onToggleCart, customIcon, href }: CartIconProps) => {
  const { itemCount } = useCart();

  const content = (
    <>
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
    </>
  );

  if (href && href !== "#") {
    return (
      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onToggleCart}
    >
      {content}
    </Button>
  );
};
