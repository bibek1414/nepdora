"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePOS } from "@/contexts/POSContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateAdminOrder } from "@/hooks/owner-site/admin/use-orders";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { POSOrderSummaryDialog } from "./pos-order-summary-dialog";
import { cn } from "@/lib/utils";

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
      status: "delivered",
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

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">Current Order</span>
        </div>
        {itemCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
            {itemCount}
          </span>
        )}
      </div>

      {/* Cart Lines */}
      <div className="min-h-0 flex-1">
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-muted-foreground">
            <ShoppingBag className="mb-3 h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="mt-0.5 text-xs opacity-70">Select products to get started</p>
          </div>
        ) : (
          <ScrollArea className="-mr-3 h-full pr-3">
            <div className="space-y-1 pb-4">
              {cartItems.map(item => {
                const price = parseFloat(
                  item.selectedVariant
                    ? item.selectedVariant.price
                    : item.product.price
                );
                return (
                  <div
                    key={item.id}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/60"
                  >
                    {/* Name + price */}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-foreground">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Rs. {price.toLocaleString()} each
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex h-7 items-center rounded-md border border-border bg-background">
                      <button
                        className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 select-none text-center text-xs font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="w-16 text-right text-sm font-semibold text-foreground">
                      Rs.{" "}
                      {(price * item.quantity).toLocaleString()}
                    </span>

                    {/* Remove */}
                    <button
                      className="ml-1 flex h-6 w-6 cursor-pointer shrink-0 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all group-hover:opacity-100 hover:text-destructive focus:outline-none"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Totals & Actions */}
      <div className="mt-auto shrink-0 space-y-3 border-t border-border pt-4">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">
            Rs. {subTotal.toLocaleString()}
          </span>
        </div>

        {/* Discount row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Discount</span>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  discount.type === "percentage" ? "text-primary" : "text-muted-foreground"
                )}
              >
                %
              </span>
              <Switch
                checked={discount.type === "flat"}
                onCheckedChange={toggleDiscountType}
                className="scale-75"
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  discount.type === "flat" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Flat
              </span>
            </div>
          </div>
          <div className="relative w-28">
            <Input
              type="text"
              className="h-8 border-border bg-muted/40 pr-8 text-right text-sm placeholder:text-muted-foreground focus:bg-background"
              value={discount.value === 0 ? "" : discount.value}
              onChange={e =>
                setDiscount({
                  ...discount,
                  value: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
            <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] text-muted-foreground">
              {discount.type === "flat" ? "Rs" : "%"}
            </span>
          </div>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount applied</span>
            <span className="font-medium text-destructive">
              - Rs. {discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Amount Paid */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Amount received</span>
          <div className="relative w-28">
            <Input
              type="text"
              className="h-8 border-border bg-muted/40 pr-8 text-right text-sm placeholder:text-muted-foreground focus:bg-background"
              value={amountPaid === 0 ? "" : amountPaid}
              onChange={e => setAmountPaid(parseFloat(e.target.value) || 0)}
              placeholder={total.toString()}
            />
            <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] text-muted-foreground">
              Rs
            </span>
          </div>
        </div>

        {/* Divider + Total */}
        <div className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
          <span className="text-base font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-primary">
            Rs. {total.toLocaleString()}
          </span>
        </div>

        {/* Checkout */}
        <Button
          className="group relative h-12 w-full overflow-hidden rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          disabled={cartItems.length === 0 || createOrderMutation.isPending}
          onClick={handleCheckout}
        >
          <span className="flex items-center justify-center gap-2">
            <ReceiptText className="h-4 w-4" />
            {createOrderMutation.isPending ? "Processing…" : "Complete Payment"}
          </span>
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
