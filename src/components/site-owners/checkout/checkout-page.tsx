"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/owner-site/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { CreateOrderRequest, OrderItem } from "@/types/owner-site/orders";
import { toast } from "sonner";
import Image from "next/image";

const CheckoutPage = () => {
  const router = useRouter();
  const params = useParams();
  const { cartItems, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();

  const isPreviewMode = !!params?.siteUser;
  const siteId = params?.siteUser as string;

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    shipping_address: "",
  });

  const [sameAsCustomerAddress, setSameAsCustomerAddress] = useState(true);

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const orderItems: OrderItem[] = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price.toString(),
      }));

      const orderData: CreateOrderRequest = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        shipping_address: sameAsCustomerAddress
          ? formData.customer_address
          : formData.shipping_address,
        total_amount: totalAmount.toFixed(2),
        items: orderItems,
      };

      const order = await createOrderMutation.mutateAsync(orderData);

      toast.success("Order placed successfully!");
      clearCart();

      // Navigate based on whether we're in preview mode
      if (isPreviewMode) {
        router.push(`/preview/${siteId}/order-confirmation/${order.id}`);
      } else {
        router.push(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleContinueShopping = () => {
    if (isPreviewMode) {
      router.push(`/preview/${siteId}`);
    } else {
      router.push("/");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-8 text-gray-600">
            Add some items to your cart before checkout
          </p>
          <Button onClick={handleContinueShopping}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="order-2 lg:order-1 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-4"
                >
                  <Image
                    src={item.product.thumbnail_image || ""}
                    alt={item.product.name}
                    width={60}
                    height={60}
                    className="h-15 w-15 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="order-1 lg:order-2 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Please fill in your details to complete your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Phone Number *</Label>
                  <Input
                    id="customer_phone"
                    name="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_address">Billing Address *</Label>
                  <Textarea
                    id="customer_address"
                    name="customer_address"
                    value={formData.customer_address}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    checked={sameAsCustomerAddress}
                    onChange={e => setSameAsCustomerAddress(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="sameAddress">
                    Shipping address same as billing address
                  </Label>
                </div>

                {!sameAsCustomerAddress && (
                  <div className="space-y-2">
                    <Label htmlFor="shipping_address">Shipping Address *</Label>
                    <Textarea
                      id="shipping_address"
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>
                )}

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-[#B85450] py-3 font-semibold text-white hover:bg-[#A04A46]"
                    size="lg"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending
                      ? "Placing Order..."
                      : "Place Order"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
