"use client";

import { useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ReceiptText } from "lucide-react";
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
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <ShoppingBag className="text-primary h-4 w-4" />
          </div>
          <span className="text-foreground text-sm font-semibold">
            Current Order
          </span>
        </div>
        {itemCount > 0 && (
          <span className="bg-primary text-primary-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold">
            {itemCount}
          </span>
        )}
      </div>

      {/* Cart Lines */}
      <div className="min-h-0 flex-1">
        {cartItems.length === 0 ? (
          <div className="border-border text-muted-foreground flex h-full flex-col items-center justify-center rounded-xl border border-dashed py-10">
            <ShoppingBag className="mb-3 h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="mt-0.5 text-xs opacity-70">
              Select products to get started
            </p>
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
                    className="group hover:bg-accent/60 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors"
                  >
                    {/* Name + price */}
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground line-clamp-1 text-sm font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        Rs. {price.toLocaleString()} each
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="border-border bg-background flex h-7 items-center rounded-md border">
                      <button
                        className="text-muted-foreground hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center transition-colors focus:outline-none"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-foreground w-7 text-center text-xs font-semibold select-none">
                        {item.quantity}
                      </span>
                      <button
                        className="text-muted-foreground hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center transition-colors focus:outline-none"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-foreground w-16 text-right text-sm font-semibold">
                      Rs. {(price * item.quantity).toLocaleString()}
                    </span>

                    {/* Remove */}
                    <button
                      className="text-muted-foreground/40 hover:text-destructive ml-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded opacity-0 transition-all group-hover:opacity-100 focus:outline-none"
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
      <div className="border-border mt-auto shrink-0 space-y-3 border-t pt-4">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground font-medium">
            Rs. {subTotal.toLocaleString()}
          </span>
        </div>

        {/* Discount row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Discount</span>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  discount.type === "percentage"
                    ? "text-primary"
                    : "text-muted-foreground"
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
                  discount.type === "flat"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Flat
              </span>
            </div>
          </div>
          <div className="relative w-28">
            <Input
              type="text"
              className="border-border bg-muted/40 placeholder:text-muted-foreground focus:bg-background h-8 pr-8 text-right text-sm"
              value={discount.value === 0 ? "" : discount.value}
              onChange={e =>
                setDiscount({
                  ...discount,
                  value: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px]">
              {discount.type === "flat" ? "Rs" : "%"}
            </span>
          </div>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount applied</span>
            <span className="text-destructive font-medium">
              - Rs. {discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Amount Paid */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm">Amount received</span>
          <div className="relative w-28">
            <Input
              type="text"
              className="border-border bg-muted/40 placeholder:text-muted-foreground focus:bg-background h-8 pr-8 text-right text-sm"
              value={amountPaid === 0 ? "" : amountPaid}
              onChange={e => setAmountPaid(parseFloat(e.target.value) || 0)}
              placeholder={total.toString()}
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px]">
              Rs
            </span>
          </div>
        </div>

        {/* Divider + Total */}
        <div className="bg-primary/5 flex items-center justify-between rounded-lg px-4 py-3">
          <span className="text-foreground text-base font-semibold">Total</span>
          <span className="text-primary text-xl font-bold">
            Rs. {total.toLocaleString()}
          </span>
        </div>

        {/* Checkout */}
        <Button
          className="group bg-primary text-primary-foreground hover:bg-primary/90 relative h-12 w-full overflow-hidden rounded-xl font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
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
