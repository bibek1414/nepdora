"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import Image from "next/image";
import Link from "next/link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
  siteUser: string;
}

const SideCart: React.FC<SideCartProps> = ({ isOpen, onClose, siteUser }) => {
  const { cartItems, removeFromCart, updateQuantity, itemCount } = useCart();
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  // Generate checkout URL with siteUser
  const checkoutUrl = `/preview/${siteUser}/checkout`;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side Cart */}
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-full transform bg-white transition-transform duration-300 ease-in-out sm:w-[380px] md:w-[400px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Cart ({itemCount})
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-3 h-12 w-12 text-gray-300 sm:mb-4 sm:h-16 sm:w-16" />
                <p className="mb-2 text-base text-gray-500 sm:text-lg">
                  Your cart is empty
                </p>
                <p className="text-sm text-gray-400">
                  Add some items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {cartItems.map(item => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 border-b border-gray-100 pb-3 last:border-b-0 sm:gap-4 sm:pb-4"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.product.thumbnail_image || ""}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                      />
                    </div>

                    {/* Product Info & Controls */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      {/* Product Name & Price */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 sm:text-base">
                          {item.product.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                          className="h-6 w-6 rounded-full hover:bg-gray-100 sm:h-7 sm:w-7"
                        >
                          <Trash2 className="h-3 w-3 text-red-500 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-base font-semibold text-gray-900 sm:text-lg">
                          Rs.{Number(item.product.price).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="h-7 w-7 rounded-full border-gray-300 hover:bg-gray-50 sm:h-8 sm:w-8"
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="min-w-[2rem] text-center text-sm font-medium sm:text-base">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="h-7 w-7 rounded-full border-gray-300 hover:bg-gray-50 sm:h-8 sm:w-8"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="space-y-3 border-t border-gray-200 bg-gray-50 p-4 sm:space-y-4 sm:p-5">
              {/* Free Delivery Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 sm:text-sm">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs text-white">✓</span>
                </div>
                <span>
                  <strong>Free Delivery</strong> & <strong>Easy Returns</strong>
                </span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-3 sm:pt-4">
                <span className="text-base font-semibold text-gray-900 sm:text-lg">
                  SUBTOTAL:
                </span>
                <span className="text-lg font-bold text-gray-900 sm:text-xl">
                  Rs.{totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Link href={checkoutUrl} className="w-full">
                <Button
                  onClick={onClose}
                  className="w-full rounded-lg py-3 text-sm font-semibold text-white sm:py-4 sm:text-base"
                  style={{
                    background: theme.colors.secondary,
                    fontFamily: theme.fonts.heading,
                  }}
                  size="lg"
                >
                  GO TO CHECKOUT
                </Button>
              </Link>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 pt-1 text-xs text-gray-600 sm:pt-2 sm:text-sm">
                <span>🔒</span>
                <span>Secure Checkout SSL Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideCart;
