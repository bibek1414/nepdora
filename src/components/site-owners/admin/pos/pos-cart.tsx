"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePOS } from "@/contexts/POSContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCreateAdminOrder } from "@/hooks/owner-site/admin/use-orders";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { POSOrderSummaryDialog } from "./pos-order-summary-dialog";

export default function POSCart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subTotal,
    discount,
    setDiscount,
    discountAmount,
    total,
    selectedCustomer,
    clearCart,
  } = usePOS();

  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState({
    total: 0,
    amountPaid: 0,
    change: 0,
  });

  const createOrderMutation = useCreateAdminOrder();

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const orderData: any = {
      customer_name: selectedCustomer
        ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
        : "Walk-in Customer",
      customer_email: selectedCustomer?.email || "walk-in@example.com",
      customer_phone: selectedCustomer?.phone || "0000000000",
      customer_address: selectedCustomer?.address || "Store Purchase",
      shipping_address: "In-store Pick-up",
      city: "Store",
      total_amount: total.toFixed(2),
      delivery_charge: "0",
      payment_type: "cash",
      is_paid: true,
      status: "delivered", // POS orders are usually completed immediately
      discount_amount: discountAmount.toFixed(2),
      customer: selectedCustomer?.id || null,
      pos_order: true,
      items: cartItems.map(item => ({
        product_id: item.product.id,
        variant_id: item.selectedVariant?.id || null,
        quantity: item.quantity,
        price: parseFloat(
          item.selectedVariant ? item.selectedVariant.price : item.product.price
        ).toFixed(2),
      })),
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
      toast.success("Order created successfully!");

      const finalTotal = total;
      const finalAmountPaid = amountPaid || total;
      const change = Math.max(0, finalAmountPaid - finalTotal);

      setSummaryData({
        total: finalTotal,
        amountPaid: finalAmountPaid,
        change: change,
      });
      setShowSummary(true);

      // Clear cart and reset state immediately after success
      clearCart();
      setAmountPaid(0);
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
  };

  const toggleDiscountType = () => {
    setDiscount({
      ...discount,
      type: discount.type === "flat" ? "percentage" : "flat",
      value: 0,
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-3 flex shrink-0 items-center gap-2 text-gray-700">
        <ShoppingBag className="h-5 w-5" />
        <span className="font-medium">Current Order</span>
      </div>

      <div className="min-h-0 flex-1">
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-100 py-10 text-gray-400">
            <ShoppingBag className="mb-2 h-12 w-12 opacity-10" />
            <p className="text-sm">Your cart is empty</p>
            <p className="mt-1 px-4 text-center text-xs opacity-60">
              Add items to get started
            </p>
          </div>
        ) : (
          <ScrollArea className="-mr-4 h-full pr-4">
            <div className="space-y-3 pb-4">
              {cartItems.map(item => (
                <div key={item.id} className="group flex gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rs.{" "}
                      {parseFloat(
                        item.selectedVariant
                          ? item.selectedVariant.price
                          : item.product.price
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 items-center rounded-lg border border-gray-100 bg-gray-50 px-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-gray-900"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-gray-900"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-300 transition-colors hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="mt-auto shrink-0 space-y-3 border-t border-gray-100 bg-white pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Sub-total</span>
          <span className="font-medium">Rs. {subTotal.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Discount</span>
            <div className="ml-1 flex items-center gap-1.5">
              <span
                className={`text-[10px] font-medium ${discount.type === "flat" ? "text-gray-400" : "text-primary"}`}
              >
                %
              </span>
              <Switch
                checked={discount.type === "flat"}
                onCheckedChange={toggleDiscountType}
                className="scale-90"
              />
              <span
                className={`text-[10px] font-medium ${discount.type === "percentage" ? "text-gray-400" : "text-primary"}`}
              >
                Flat
              </span>
            </div>
          </div>
          <div className="relative w-32">
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">
              {discount.type === "flat" ? "amount" : "%"}
            </span>
            <Input
              type="text"
              className="h-9 border-gray-100 bg-gray-50 placeholder:text-gray-400"
              value={discount.value === 0 ? "" : discount.value}
              onChange={e =>
                setDiscount({
                  ...discount,
                  value: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Amount Paid
            </span>
          </div>
          <div className="relative w-32">
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">
              Rs.
            </span>
            <Input
              type="text"
              className="h-9 border-gray-100 bg-gray-50 placeholder:text-gray-400"
              value={amountPaid === 0 ? "" : amountPaid}
              onChange={e => setAmountPaid(parseFloat(e.target.value) || 0)}
              placeholder={total.toString()}
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between py-1">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-primary text-xl font-semibold">
            Rs. {total.toLocaleString()}
          </span>
        </div>

        <Button
          className="bg-primary hover:bg-primary/80 h-14 w-full rounded-xl text-lg font-bold text-white shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
          disabled={cartItems.length === 0 || createOrderMutation.isPending}
          onClick={handleCheckout}
        >
          {createOrderMutation.isPending ? "Processing..." : "Complete Payment"}
        </Button>
      </div>

      <POSOrderSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        total={summaryData.total}
        amountPaid={summaryData.amountPaid}
        change={summaryData.change}
        onClose={handleCloseSummary}
      />
    </div>
  );
}
