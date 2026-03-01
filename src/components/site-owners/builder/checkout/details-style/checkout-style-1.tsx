"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
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
import { PromoCodeInput } from "../promo-code-input";
import { PromoCode } from "@/types/owner-site/admin/promo-code-validate";
import { useDeliveryChargeCalculator } from "@/hooks/owner-site/admin/use-delivery-charge-calculator";

interface CheckoutStyleProps {
  siteUser?: string;
}

const MOCK_CART = [
  {
    product: {
      id: 1,
      name: "Sample Product A",
      thumbnail_image: "/fallback/image-not-found.png",
      price: "700.00",
      weight: 0.5,
    },
    quantity: 2,
    selectedVariant: null,
  },
];

const CheckoutStyle1 = ({ siteUser: propSiteUser }: CheckoutStyleProps) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { cartItems: realCartItems, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();
  const { user, isAuthenticated } = useAuth();
  const { data: paymentGateways, isLoading: isLoadingGateways } =
    usePaymentGateways();
  const { data: themeResponse } = useThemeQuery();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(
    null
  );
  const [openBillingCity, setOpenBillingCity] = useState(false);
  const isPreviewMode = !!params?.siteUser;
  const siteUser = propSiteUser || (params?.siteUser as string);
  const isBuilder = pathname?.includes("/builder/");
  const cartItems =
    realCartItems.length > 0 ? realCartItems : isBuilder ? MOCK_CART : [];

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
      city: "",
      shipping_address: "",
      shipping_city: "",
      same_as_customer_address: true,
      note: "",
    },
    mode: "onChange",
  });

  const sameAsCustomerAddress = watch("same_as_customer_address");
  const cityDistrict = watch("city");
  const shippingCityDistrict = watch("shipping_city");

  // Calculate total weight from cart items
  const totalWeight = cartItems.reduce((total, item) => {
    const itemWeight = item.product.weight || 0;
    return total + Number(itemWeight) * item.quantity;
  }, 0);

  // Use delivery charge calculator with search
  const {
    deliveryCharge,
    citiesDistricts,
    isLoading: isLoadingDeliveryCharges,
    searchQuery,
    setSearchQuery,
  } = useDeliveryChargeCalculator({
    selectedCityDistrict: sameAsCustomerAddress
      ? cityDistrict
      : shippingCityDistrict || cityDistrict,
    totalWeight,
  });

  // Calculate subtotal
  const subtotalAmount = cartItems.reduce((total, item) => {
    const itemPrice = item.selectedVariant?.price || item.product.price;
    return total + Number(itemPrice) * item.quantity;
  }, 0);

  // Calculate discount
  const discountAmount = appliedPromoCode
    ? (subtotalAmount * Number(appliedPromoCode.discount_percentage)) / 100
    : 0;

  // Calculate total after discount and delivery charge
  const totalAmount = subtotalAmount - discountAmount + deliveryCharge;

  // Filter enabled payment gateways
  const enabledPaymentGateways =
    paymentGateways?.filter(gateway => gateway.is_enabled) || [];

  // Get unique payment types and add COD
  const gatewayPaymentTypes = Array.from(
    new Set(enabledPaymentGateways.map(g => g.payment_type))
  );

  const uniquePaymentTypes = ["cod", ...gatewayPaymentTypes];

  useEffect(() => {
    if (uniquePaymentTypes.includes("cod") && !selectedPaymentMethod) {
      setSelectedPaymentMethod("cod");
    }
  }, [uniquePaymentTypes, selectedPaymentMethod]);

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
        return "/images/payment-gateway/cod.png";
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

  const handlePromoCodeApplied = (promoCode: PromoCode | null) => {
    setAppliedPromoCode(promoCode);
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
        if (item.selectedVariant?.id) {
          return {
            variant_id: item.selectedVariant.id,
            quantity: item.quantity,
            price: (
              item.selectedVariant.price || item.product.price
            ).toString(),
          };
        } else {
          return {
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price.toString(),
          };
        }
      });

      const orderData: CreateOrderRequest = {
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        customer_address: data.customer_address,
        city: data.city,
        shipping_address: data.same_as_customer_address
          ? data.customer_address
          : data.shipping_address || "",
        shipping_city: data.same_as_customer_address
          ? data.city
          : data.shipping_city || "",
        total_amount: totalAmount.toFixed(2),
        delivery_charge: deliveryCharge.toFixed(2),
        items: orderItems,
        ...(data.note && { note: data.note }),
        ...(appliedPromoCode && {
          promo_code: appliedPromoCode.id,
          discount_amount: discountAmount.toFixed(2),
        }),
      };

      const order = await createOrderMutation.mutateAsync({
        orderData,
        includeToken: isAuthenticated && !!user,
      });

      // Handle payment method routing
      if (selectedPaymentMethod) {
        switch (selectedPaymentMethod.toLowerCase()) {
          case "esewa":
            router.push(
              `/preview/${siteUser}/esewa-payment?orderId=${order.id}&orderNumber=${order.order_number}`
            );
            break;
          case "khalti":
            router.push(
              `/preview/${siteUser}/khalti-payment?orderId=${order.id}&orderNumber=${order.order_number}`
            );
            break;
          case "cod":
            toast.success("Order placed successfully! Pay on delivery.");
            clearCart();
            router.push(`/preview/${siteUser}/order-confirmation/${order.id}`);
            break;
          default:
            break;
        }
      } else {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/preview/${siteUser}/order-confirmation/${order.id}`);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleContinueShopping = () => {
    router.push(`/preview/${siteUser}`);
  };

  // Order Summary Component (shared between mobile and desktop)
  const OrderSummaryContent = () => (
    <>
      {cartItems.map((item, index) => {
        const displayPrice = item.selectedVariant?.price || item.product.price;
        const cartItemKey = `${item.product.id}-${item.selectedVariant?.id || "no-variant"}-${index}`;

        return (
          <div
            key={cartItemKey}
            className="flex gap-4 border-b border-gray-100 pb-4 last:border-b-0"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
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
                {item.selectedVariant && item.selectedVariant.option_values && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Object.entries(item.selectedVariant.option_values).map(
                      ([optionName, optionValue]) => (
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
                      )
                    )}
                  </div>
                )}

                <p className="mt-1 text-xs text-gray-500">
                  Qty: {item.quantity}
                </p>
                {item.product.weight && (
                  <p className="mt-1 text-xs text-gray-500">
                    Weight: {item.product.weight} kg each
                  </p>
                )}
              </div>

              <div className="mt-2 flex items-end justify-between">
                <div className="text-xs text-gray-500">
                  Rs.{Number(displayPrice).toLocaleString("en-IN")} each
                </div>
                <div className="text-sm font-semibold">
                  Rs.
                  {(Number(displayPrice) * item.quantity).toLocaleString(
                    "en-IN"
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <Separator className="my-4" />

      {/* Promo Code Input */}
      <PromoCodeInput
        onPromoCodeApplied={handlePromoCodeApplied}
        appliedPromoCode={appliedPromoCode}
        primaryColor={theme.colors.primary}
        subtlePrimaryBg={subtlePrimaryBg}
      />

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            Rs.{Number(subtotalAmount).toLocaleString("en-IN")}
          </span>
        </div>

        {appliedPromoCode && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Discount ({appliedPromoCode.discount_percentage}%):
            </span>
            <span className="font-medium text-green-600">
              -Rs.{Number(discountAmount).toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Delivery:</span>
          <span className="font-medium">
            Rs.{Number(deliveryCharge).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Total:</span>
        <div className="text-right">
          {appliedPromoCode && (
            <div className="text-sm text-gray-500 line-through">
              Rs.
              {Number(subtotalAmount + deliveryCharge).toLocaleString("en-IN")}
            </div>
          )}
          <span
            className="text-2xl font-bold"
            style={{ color: theme.colors.primary }}
          >
            Rs.{Number(totalAmount).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="mt-4 rounded-lg bg-blue-50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-700">Total Weight:</span>
          <span className="font-medium text-blue-700">
            {totalWeight.toFixed(2)} kg
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-blue-700">Delivery To:</span>
          <span className="font-medium text-blue-700">
            {sameAsCustomerAddress
              ? cityDistrict || "Not selected"
              : shippingCityDistrict || "Not selected"}
          </span>
        </div>
      </div>
    </>
  );

  if (cartItems.length === 0 && !isBuilder) {
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

  // If still empty in builder (shouldn't happen with MOCK_CART), show a placeholder
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="text-gray-500 italic">
          No checkout items available for preview.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3">
        {/* Shipping Information */}
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

                {/* Billing City/District with Search */}
                <div className="space-y-2">
                  <Label htmlFor="city">City/District *</Label>
                  <Popover
                    open={openBillingCity}
                    onOpenChange={setOpenBillingCity}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openBillingCity}
                        className={cn(
                          "w-full justify-between",
                          !cityDistrict && "text-muted-foreground",
                          errors.city && "border-red-300"
                        )}
                        disabled={isSubmitting || isLoadingDeliveryCharges}
                      >
                        {cityDistrict
                          ? citiesDistricts.find(city => city === cityDistrict)
                          : "Select city/district"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search city/district..."
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {citiesDistricts.map(city => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={() => {
                                setValue("city", city);
                                setOpenBillingCity(false);
                                setSearchQuery("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  cityDistrict === city
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.city && (
                    <p className="text-sm text-red-600">
                      {errors.city.message}
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
                  <>
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
                  </>
                )}

                {/* Order Notes */}
                <div className="space-y-2">
                  <Label htmlFor="note">Order Notes (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Any special instructions for your order..."
                    rows={3}
                    disabled={isSubmitting}
                    className={cn(
                      errors.note
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-primary border-gray-300"
                    )}
                    {...register("note")}
                  />
                  {errors.note && (
                    <p className="text-sm text-red-600">
                      {errors.note.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {watch("note")?.length || 0}/500 characters
                  </p>
                </div>

                {/* Mobile Order Summary */}
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
                      <OrderSummaryContent />
                    </CardContent>
                  </Card>
                  <Separator className="my-6" />
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
                                    ? "border-2"
                                    : "border border-gray-300"
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
                                <div className="relative z-10 flex items-center gap-3">
                                  <div className="relative h-8 w-8 shrink-0">
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
                <OrderSummaryContent />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStyle1;
