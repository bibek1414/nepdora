"use client";

import React, { useState } from "react";
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

const CheckoutPage = () => {
  const router = useRouter();
  const params = useParams();
  const { cartItems, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();
  const { user, isAuthenticated } = useAuth();
  const { data: paymentGateways, isLoading: isLoadingGateways } =
    usePaymentGateways();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const isPreviewMode = !!params?.siteUser;
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

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  // Filter enabled payment gateways and get unique ones
  const enabledPaymentGateways =
    paymentGateways?.filter(gateway => gateway.is_enabled) || [];

  // Get unique payment types and add COD as default option
  const gatewayPaymentTypes = Array.from(
    new Set(enabledPaymentGateways.map(g => g.payment_type))
  );

  // Always include COD as an option
  const uniquePaymentTypes = ["cod", ...gatewayPaymentTypes];

  const getPaymentColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "esewa":
        return "bg-green-500";
      case "khalti":
        return "bg-purple-500";
      case "cod":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
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

  // Helper function to construct subdomain URL
  const getSubdomainUrl = (path: string) => {
    if (typeof window === "undefined") return path;

    const currentHost = window.location.host;
    const protocol = window.location.protocol;

    // Check if we're in preview mode or already on a subdomain
    if (isPreviewMode && siteUser) {
      // Convert preview URL to subdomain URL
      if (currentHost.includes("localhost")) {
        const port = currentHost.includes(":")
          ? `:${currentHost.split(":")[1]}`
          : ":3000";
        return `${protocol}//${siteUser}.localhost${port}${path}`;
      } else {
        // Production - extract root domain
        const rootDomain = currentHost.replace(/^[^.]+\./, "");
        return `${protocol}//${siteUser}.${rootDomain}${path}`;
      }
    }

    // Already on subdomain, just use the path
    return path;
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

      if (isAuthenticated && user) {
        console.log("Order being placed by authenticated user:", user.email);
      } else {
        console.log("Order being placed by guest user");
      }

      const order = await createOrderMutation.mutateAsync({
        orderData,
        includeToken: isAuthenticated && !!user,
      });

      // Handle payment method routing with subdomain URLs
      if (selectedPaymentMethod) {
        switch (selectedPaymentMethod.toLowerCase()) {
          case "esewa":
            window.location.href = getSubdomainUrl(
              `/esewa-payment?orderId=${order.id}`
            );
            break;
          case "khalti":
            window.location.href = getSubdomainUrl(
              `/khalti-payment?orderId=${order.id}`
            );
            break;
          case "cod":
            // For COD, go directly to order confirmation
            toast.success("Order placed successfully! Pay on delivery.");
            clearCart();
            window.location.href = getSubdomainUrl(
              `/order-confirmation/${order.id}`
            );
            break;
          default:
            break;
        }
      } else {
        // Direct order confirmation without payment gateway
        toast.success("Order placed successfully!");
        clearCart();
        window.location.href = getSubdomainUrl(
          `/order-confirmation/${order.id}`
        );
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleContinueShopping = () => {
    if (isPreviewMode && siteUser) {
      // Redirect to subdomain home page
      window.location.href = getSubdomainUrl("/");
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
                                variant="outline"
                                className={cn(
                                  "relative w-full justify-start overflow-hidden text-left font-normal transition-all duration-300",
                                  selectedPaymentMethod === type &&
                                    "border-2 border-[#B85450] bg-gray-100"
                                )}
                                onClick={() => setSelectedPaymentMethod(type)}
                                disabled={isSubmitting}
                              >
                                <motion.div
                                  className={`mr-3 h-4 w-4 rounded-full ${getPaymentColor(type)}`}
                                  whileHover={{ scale: 1.2 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 10,
                                  }}
                                />
                                <span className="capitalize">
                                  {getPaymentLabel(type)}
                                </span>
                                {selectedPaymentMethod === type && (
                                  <motion.div
                                    className="absolute inset-0 bg-[#B85450]/5"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
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
                    className="w-full bg-[#B85450] py-3 font-semibold text-white hover:bg-[#A04A46]"
                    size="lg"
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
