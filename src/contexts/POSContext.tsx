"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { Customer } from "@/types/owner-site/admin/customer";
import { Product } from "@/types/owner-site/admin/product";
import { OrderItem } from "@/types/owner-site/admin/orders";

export interface POSCartItem {
  id: string; // Combined productId and variantId
  product: Product;
  quantity: number;
  selectedVariant?: {
    id: number;
    price: string;
    option_values: Record<string, string>;
  } | null;
}

interface POSContextType {
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  cartItems: POSCartItem[];
  addToCart: (product: Product, quantity: number, variant?: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  discount: {
    type: "flat" | "percentage";
    value: number;
  };
  setDiscount: (discount: { type: "flat" | "percentage"; value: number }) => void;
  subTotal: number;
  discountAmount: number;
  total: number;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cartItems, setCartItems] = useState<POSCartItem[]>([]);
  const [discount, setDiscount] = useState<{ type: "flat" | "percentage"; value: number }>({
    type: "flat",
    value: 0,
  });

  const addToCart = (product: Product, quantity: number, variant?: any) => {
    const itemId = variant ? `${product.id}-${variant.id}` : `${product.id}`;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, quantity, selectedVariant: variant }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount({ type: "flat", value: 0 });
    setSelectedCustomer(null);
  };

  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.selectedVariant ? parseFloat(item.selectedVariant.price) : parseFloat(item.product.price);
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (discount.type === "flat") {
      return discount.value;
    }
    return (subTotal * discount.value) / 100;
  }, [subTotal, discount]);

  const total = useMemo(() => {
    return Math.max(0, subTotal - discountAmount);
  }, [subTotal, discountAmount]);

  return (
    <POSContext.Provider
      value={{
        selectedCustomer,
        setSelectedCustomer,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        discount,
        setDiscount,
        subTotal,
        discountAmount,
        total,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
}
