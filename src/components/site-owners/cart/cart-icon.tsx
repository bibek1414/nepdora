"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/owner-site/use-cart";

export const CartIcon = () => {
  const { itemCount } = useCart();

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/order">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            {itemCount}
          </Badge>
        )}
        <span className="sr-only">Shopping Cart</span>
      </Link>
    </Button>
  );
};
