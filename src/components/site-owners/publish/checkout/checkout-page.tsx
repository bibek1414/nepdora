"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { useCreateOrder } from "@/hooks/owner-site/admin/use-orders";
import { CreateOrderRequest, OrderItem } from "@/types/owner-site/admin/orders";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/customer/use-auth";
import { checkoutFormSchema, CheckoutFormValues } from "@/schemas/chekout.form";
import { usePaymentGateways } from "@/hooks/owner-site/admin/use-payment-gateway";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

const PublishCheckoutPage = () => {
  const router = useRouter();
  const params = useParams();
  const { cartItems, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();
  const { user, isAuthenticated } = useAuth();
  const { data: paymentGateways, isLoading: isLoadingGateways } =
    usePaymentGateways();
  const { data: themeResponse } = useThemeQuery();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const siteUser = params?.siteUser as string;

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

  // Debug cart items on mount
  useEffect(() => {
    console.log("Publish Checkout - Cart Items:", cartItems);
    cartItems.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        productId: item.product.id,
        productName: item.product.name,
        selectedVariant: item.selectedVariant,
        quantity: item.quantity,
      });
    });
  }, [cartItems]);

  const totalAmount = cartItems.reduce((total, item) => {
    const itemPrice = item.selectedVariant?.price || item.product.price;
    return total + Number(itemPrice) * item.quantity;
  }, 0);

  // Filter enabled payment gateways and get unique ones
  const enabledPaymentGateways =
    paymentGateways?.filter(gateway => gateway.is_enabled) || [];

  // Get unique payment types and add COD as default option
  const gatewayPaymentTypes = Array.from(
    new Set(enabledPaymentGateways.map(g => g.payment_type))
  );

  // Always include COD as an option
  const uniquePaymentTypes = ["cod", ...gatewayPaymentTypes];

  // Theme setup
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

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryForeground,
    borderColor: theme.colors.primary,
  };
  const outlineButtonStyle: React.CSSProperties = {
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  };
  const subtlePrimaryBg = `${theme.colors.primary}0D`;

  // Get payment gateway image
  const getPaymentImage = (type: string) => {
    switch (type.toLowerCase()) {
      case "esewa":
        return "/images/payment-gateway/esewa.png";
      case "khalti":
        return "/images/payment-gateway/khalti.png";
      case "cod":
        return "/images/payment-gateway/cod.png";
      default:
        return "/images/payment-gateway/cod.png"; // fallback
    }
  };

  const getPaymentLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "cod":
        return "Cash on Delivery";
      case "esewa":
        return "eSewa";
      case "khalti":
        return "Khalti";
      default:
        return type;
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (uniquePaymentTypes.length > 0 && !selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      const orderItems: OrderItem[] = cartItems.map(item => {
        console.log("Processing cart item:", {
          productId: item.product.id,
          selectedVariant: item.selectedVariant,
          hasVariantId: !!item.selectedVariant?.id,
        });

        // CRITICAL FIX: Only send variant_id if variant is actually selected
        // Do NOT send product_id when variant is selected
        if (item.selectedVariant?.id) {
          const orderItem = {
            variant_id: item.selectedVariant.id,
            quantity: item.quantity,
            price: (
              item.selectedVariant.price || item.product.price
            ).toString(),
          };
          console.log("Creating variant order item:", orderItem);
          return orderItem;
        } else {
          const orderItem = {
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price.toString(),
          };
          console.log("Creating product order item:", orderItem);
          return orderItem;
        }
      });

      console.log("Final order items:", orderItems);

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

      console.log("Submitting order data:", orderData);

      if (isAuthenticated && user) {
        console.log("Order being placed by authenticated user:", user.email);
      } else {
        console.log("Order being placed by guest user");
      }

      const order = await createOrderMutation.mutateAsync({
        orderData,
        includeToken: isAuthenticated && !!user,
      });

      console.log("Order created successfully:", order);

      // Handle payment method routing for publish site
      if (selectedPaymentMethod) {
        switch (selectedPaymentMethod.toLowerCase()) {
          case "esewa":
            router.push(
              `/esewa-payment?orderId=${order.id}&orderNumber=${order.order_number}`
            );
            break;
          case "khalti":
            router.push(
              `/khalti-payment?orderId=${order.id}&orderNumber=${order.order_number}`
            );
            break;
          case "cod":
            toast.success("Order placed successfully! Pay on delivery.");
            clearCart();
            router.push(`/order-confirmation/${order.id}`);
            break;
          default:
            break;
        }
      } else {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleContinueShopping = () => {
    router.push(`/publish/${siteUser}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-8 text-gray-600">
            Add some items to your cart before checkout
          </p>
          <Button onClick={handleContinueShopping} style={primaryButtonStyle}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3">
        {/* Mobile & Desktop: Shipping Information First */}
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
                  <Label htmlFor="customer_address">Billing Address</Label>
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
                    <Label htmlFor="shipping_address">Shipping Address</Label>
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

                {/* Mobile: Order Summary - Only show on mobile between form and payment */}
                <div className="block lg:hidden">
                  <Separator className="my-6" />
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                      <CardDescription>
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "item" : "items"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cartItems.map((item, index) => {
                        const displayPrice =
                          item.selectedVariant?.price || item.product.price;
                        const cartItemKey = `${item.product.id}-${item.selectedVariant?.id || "no-variant"}-${index}`;

                        return (
                          <div
                            key={cartItemKey}
                            className="flex gap-4 border-b border-gray-100 pb-4 last:border-b-0"
                          >
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                              <Image
                                src={item.product.thumbnail_image || ""}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                              <div>
                                <h4 className="text-sm leading-tight font-medium">
                                  {item.product.name}
                                </h4>

                                {/* Display variant options as badges */}
                                {item.selectedVariant &&
                                  item.selectedVariant.option_values && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {Object.entries(
                                        item.selectedVariant.option_values
                                      ).map(([optionName, optionValue]) => (
                                        <Badge
                                          key={optionName}
                                          variant="secondary"
                                          className="text-xs capitalize"
                                          style={{
                                            backgroundColor: subtlePrimaryBg,
                                            color: theme.colors.primary,
                                          }}
                                        >
                                          {optionName}: {optionValue}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                <p className="mt-1 text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>

                              <div className="mt-2 flex items-end justify-between">
                                <div className="text-xs text-gray-500">
                                  Rs.{Number(displayPrice).toFixed(2)} each
                                </div>
                                <div className="text-sm font-semibold">
                                  Rs.
                                  {(
                                    Number(displayPrice) * item.quantity
                                  ).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">
                            Rs.{totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-medium text-green-600">
                            Free
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Total:</span>
                        <span
                          className="text-2xl font-bold"
                          style={{ color: theme.colors.primary }}
                        >
                          Rs.{totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Method Selection */}
                {uniquePaymentTypes.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <Separator />
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">
                        Payment Method
                      </h3>
                      <p className="mb-4 text-sm text-gray-600">
                        Select your preferred payment option
                      </p>

                      <div className="grid gap-3">
                        <AnimatePresence mode="wait">
                          {uniquePaymentTypes.map(type => (
                            <motion.div
                              key={type}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                className={cn(
                                  "relative h-16 w-full justify-start overflow-hidden border text-left font-normal transition-all duration-300",
                                  selectedPaymentMethod === type
                                    ? "border-2" // thicker when active
                                    : "border border-gray-300" // light gray when inactive
                                )}
                                style={{
                                  borderColor:
                                    selectedPaymentMethod === type
                                      ? theme.colors.primary
                                      : "#D1D5DB",
                                  backgroundColor:
                                    selectedPaymentMethod === type
                                      ? subtlePrimaryBg
                                      : "transparent",
                                }}
                                onClick={() => setSelectedPaymentMethod(type)}
                                disabled={isSubmitting}
                              >
                                {/* Content */}
                                <div className="relative z-10 flex items-center gap-3">
                                  <div className="relative h-8 w-8 flex-shrink-0">
                                    <Image
                                      src={getPaymentImage(type)}
                                      alt={getPaymentLabel(type)}
                                      fill
                                      className="object-contain"
                                      sizes="32px"
                                    />
                                  </div>
                                  <span className="text-base font-medium capitalize">
                                    {getPaymentLabel(type)}
                                  </span>
                                </div>

                                {/* Animated overlay (behind content) */}
                                {selectedPaymentMethod === type && (
                                  <motion.div
                                    className="absolute inset-0 z-0"
                                    style={{ backgroundColor: subtlePrimaryBg }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                )}
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full py-3 font-semibold"
                    size="lg"
                    style={primaryButtonStyle}
                    disabled={isSubmitting || createOrderMutation.isPending}
                  >
                    {isSubmitting || createOrderMutation.isPending
                      ? "Processing..."
                      : selectedPaymentMethod
                        ? selectedPaymentMethod.toLowerCase() === "cod"
                          ? "Place Order (Cash on Delivery)"
                          : `Pay with ${getPaymentLabel(selectedPaymentMethod)}`
                        : "Place Order"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Desktop: Order Summary - Right Side (Sticky) - Hidden on mobile */}
        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => {
                  const displayPrice =
                    item.selectedVariant?.price || item.product.price;
                  const cartItemKey = `${item.product.id}-${item.selectedVariant?.id || "no-variant"}-${index}`;

                  return (
                    <div
                      key={cartItemKey}
                      className="flex gap-4 border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                        <Image
                          src={item.product.thumbnail_image || ""}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="text-sm leading-tight font-medium">
                            {item.product.name}
                          </h4>

                          {/* Display variant options as badges */}
                          {item.selectedVariant &&
                            item.selectedVariant.option_values && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {Object.entries(
                                  item.selectedVariant.option_values
                                ).map(([optionName, optionValue]) => (
                                  <Badge
                                    key={optionName}
                                    variant="secondary"
                                    className="text-xs capitalize"
                                    style={{
                                      backgroundColor: subtlePrimaryBg,
                                      color: theme.colors.primary,
                                    }}
                                  >
                                    {optionName}: {optionValue}
                                  </Badge>
                                ))}
                              </div>
                            )}

                          <p className="mt-1 text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <div className="mt-2 flex items-end justify-between">
                          <div className="text-xs text-gray-500">
                            Rs.{Number(displayPrice).toFixed(2)} each
                          </div>
                          <div className="text-sm font-semibold">
                            Rs.
                            {(Number(displayPrice) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      Rs.{totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: theme.colors.primary }}
                  >
                    Rs.{totalAmount.toFixed(2)}
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

export default PublishCheckoutPage;
