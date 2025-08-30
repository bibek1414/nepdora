"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/owner-site/use-cart";
import Image from "next/image";
import Link from "next/link";

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: string;
}

const SideCart: React.FC<SideCartProps> = ({ isOpen, onClose, siteId }) => {
  const { cartItems, removeFromCart, updateQuantity, itemCount } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  // Generate checkout URL with siteId
  const checkoutUrl = `/preview/${siteId}/checkout`;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side Cart */}
      <div
        className={`fixed top-0 right-0 z-[70] mt-10 h-full w-full transform bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[350px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Cart ({itemCount})
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
                <p className="mb-2 text-lg text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400">
                  Add some items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map(item => (
                  <div
                    key={item.product.id}
                    className="flex space-x-4 border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={item.product.thumbnail_image || ""}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-base font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-500">
                        {item.product.description || "No description available"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-semibold text-gray-900">
                          ${Number(item.product.price).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                          className="h-8 w-8 rounded-full hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>

                      <div className="mt-2 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-base font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs text-white">✓</span>
                </div>
                <span>
                  <strong>Free Delivery</strong> & <strong>Easy Returns</strong>
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 py-3">
                <span className="text-lg font-semibold text-gray-900">
                  SUBTOTAL:
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <Link href={checkoutUrl} className="w-full">
                <Button
                  onClick={onClose}
                  className="w-full rounded-lg bg-[#B85450] py-4 text-base font-semibold text-white shadow-sm hover:bg-[#A04A46]"
                  size="lg"
                >
                  GO TO CHECKOUT
                </Button>
              </Link>

              <div className="flex items-center justify-center space-x-2 pt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>🔒</span>
                  <span>Secure Checkout SSL Encryption</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideCart;
