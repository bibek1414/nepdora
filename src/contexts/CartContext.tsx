"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@/types/owner-site/admin/cart";
import {
  Product,
  ExtendedProduct,
  normalizeProductForCart,
} from "@/types/owner-site/admin/product";

// Union type for products that can be added to cart
type CartableProduct =
  | Product
  | ExtendedProduct
  | {
      id: number;
      name?: string;
      title?: string;
      description?: string;
      price: string | number;
      stock?: number;
      [key: string]: unknown;
    };

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: CartableProduct,
    quantity: number,
    selectedVariant?: {
      id: number;
      price: string;
      option_values: Record<string, string>;
    } | null
  ) => void;
  removeFromCart: (productId: number, variantId?: number | null) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    variantId?: number | null
  ) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on initial render
    try {
      const storedCart = localStorage.getItem("nepdora_cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    try {
      localStorage.setItem("nepdora_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (
    product: CartableProduct,
    quantity: number,
    selectedVariant?: {
      id: number;
      price: string;
      option_values: Record<string, string>;
    } | null
  ) => {
    // Normalize the product to ensure it matches our Product type
    const normalizedProduct: Product = normalizeProductForCart(product);

    setCartItems(prevItems => {
      // Find existing item with same product AND variant (or both null)
      const existingItem = prevItems.find(item => {
        const productMatch = item.product.id === normalizedProduct.id;
        const variantMatch =
          (item.selectedVariant?.id || null) === (selectedVariant?.id || null);
        return productMatch && variantMatch;
      });

      if (existingItem) {
        // Update quantity for existing item
        return prevItems.map(item => {
          const productMatch = item.product.id === normalizedProduct.id;
          const variantMatch =
            (item.selectedVariant?.id || null) ===
            (selectedVariant?.id || null);
          return productMatch && variantMatch
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }

      // Add new item with variant
      return [
        ...prevItems,
        {
          product: normalizedProduct,
          quantity,
          selectedVariant: selectedVariant || null,
        },
      ];
    });
  };

  const removeFromCart = (productId: number, variantId?: number | null) => {
    setCartItems(prevItems =>
      prevItems.filter(item => {
        const productMatch = item.product.id === productId;
        const variantMatch =
          (item.selectedVariant?.id || null) === (variantId || null);
        // Keep item if either product doesn't match OR variant doesn't match
        return !(productMatch && variantMatch);
      })
    );
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    variantId?: number | null
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => {
          const productMatch = item.product.id === productId;
          const variantMatch =
            (item.selectedVariant?.id || null) === (variantId || null);
          return productMatch && variantMatch ? { ...item, quantity } : item;
        })
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cartItems.reduce((total, item) => {
    // Use variant price if available, otherwise use product price
    const price = item.selectedVariant
      ? parseFloat(item.selectedVariant.price)
      : parseFloat(item.product.price);
    return total + price * item.quantity;
  }, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
