"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/owner-site/use-cart";
import { useCreateOrder } from "@/hooks/owner-site/use-orders";
import { CreateOrderRequest, OrderItem } from "@/types/owner-site/orders";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { checkoutFormSchema, CheckoutFormValues } from "@/schemas/chekout.form";
const CheckoutPage = () => {
  const router = useRouter();
  const params = useParams();
  const { cartItems, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();

  const isPreviewMode = !!params?.siteUser;
  const siteId = params?.siteUser as string;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      customer_address: "",
      shipping_address: "",
      same_as_customer_address: true,
    },
    mode: "onChange",
  });

  const sameAsCustomerAddress = watch("same_as_customer_address");

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const onSubmit = async (data: CheckoutFormValues) => {
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
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        customer_address: data.customer_address,
        shipping_address: data.same_as_customer_address
          ? data.customer_address
          : data.shipping_address || "",
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout Form - Left Side */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Please fill in your details to complete your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Input
                      id="customer_name"
                      type="text"
                      label="Full Name"
                      autoComplete="name"
                      disabled={isSubmitting}
                      className={cn(
                        errors.customer_name
                          ? "border-red-300 focus:ring-red-500"
                          : "focus:ring-primary border-gray-300"
                      )}
                      {...register("customer_name")}
                    />
                    {errors.customer_name && (
                      <p className="text-sm text-red-600">
                        {errors.customer_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Input
                      id="customer_email"
                      type="email"
                      label="Email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isSubmitting}
                      className={cn(
                        errors.customer_email
                          ? "border-red-300 focus:ring-red-500"
                          : "focus:ring-primary border-gray-300"
                      )}
                      {...register("customer_email")}
                    />
                    {errors.customer_email && (
                      <p className="text-sm text-red-600">
                        {errors.customer_email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    id="customer_phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="+1 (555) 123-4567"
                    autoComplete="tel"
                    disabled={isSubmitting}
                    className={cn(
                      errors.customer_phone
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-primary border-gray-300"
                    )}
                    {...register("customer_phone")}
                  />
                  {errors.customer_phone && (
                    <p className="text-sm text-red-600">
                      {errors.customer_phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    id="customer_address"
                    placeholder="Enter your billing address"
                    rows={3}
                    disabled={isSubmitting}
                    className={cn(
                      errors.customer_address
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-primary border-gray-300"
                    )}
                    {...register("customer_address")}
                  />
                  {errors.customer_address && (
                    <p className="text-sm text-red-600">
                      {errors.customer_address.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="same_as_customer_address"
                    checked={sameAsCustomerAddress}
                    onCheckedChange={checked =>
                      setValue("same_as_customer_address", checked === true)
                    }
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="same_as_customer_address"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Shipping address same as billing address
                  </Label>
                </div>

                {!sameAsCustomerAddress && (
                  <div className="space-y-2">
                    <Textarea
                      id="shipping_address"
                      placeholder="Enter your shipping address"
                      rows={3}
                      disabled={isSubmitting}
                      className={cn(
                        errors.shipping_address
                          ? "border-red-300 focus:ring-red-500"
                          : "focus:ring-primary border-gray-300"
                      )}
                      {...register("shipping_address")}
                    />
                    {errors.shipping_address && (
                      <p className="text-sm text-red-600">
                        {errors.shipping_address.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-[#B85450] py-3 font-semibold text-white hover:bg-[#A04A46]"
                    size="lg"
                    disabled={isSubmitting || createOrderMutation.isPending}
                  >
                    {isSubmitting || createOrderMutation.isPending
                      ? "Placing Order..."
                      : "Place Order"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary - Right Side (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
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
                        $
                        {(Number(item.product.price) * item.quantity).toFixed(
                          2
                        )}
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
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
