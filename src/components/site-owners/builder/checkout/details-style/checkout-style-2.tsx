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
import { EditableText } from "@/components/ui/editable-text";

interface CheckoutStyleProps {
  siteUser?: string;
}

const MOCK_CART = [
  {
    product: {
      id: 1,
      name: "Sample Product B",
      thumbnail_image: "/fallback/image-not-found.png",
      price: "1200.00",
      weight: 0.8,
    },
    quantity: 1,
    selectedVariant: null,
  },
];

const CheckoutStyle2 = ({ siteUser: propSiteUser }: CheckoutStyleProps) => {
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

      const prefix = pathname?.includes("/preview/")
        ? `/preview/${siteUser}`
        : pathname?.includes("/builder/")
          ? `/builder/${siteUser}`
          : "";

      const orderConfirmUrl = prefix
        ? `${prefix}/order-confirmation-draft/${order.id}`
        : `/order-confirmation/${order.id}`;

      const esewaUrl = prefix
        ? `${prefix}/esewa-payment?orderId=${order.id}&orderNumber=${order.order_number}`
        : `/esewa-payment?orderId=${order.id}&orderNumber=${order.order_number}`;

      const khaltiUrl = prefix
        ? `${prefix}/khalti-payment?orderId=${order.id}&orderNumber=${order.order_number}`
        : `/khalti-payment?orderId=${order.id}&orderNumber=${order.order_number}`;

      // Handle payment method routing
      if (selectedPaymentMethod) {
        switch (selectedPaymentMethod.toLowerCase()) {
          case "esewa":
            router.push(esewaUrl);
            break;
          case "khalti":
            router.push(khaltiUrl);
            break;
          case "cod":
            toast.success("Order placed successfully! Pay on delivery.");
            clearCart();
            router.push(orderConfirmUrl);
            break;
          default:
            break;
        }
      } else {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(orderConfirmUrl);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleContinueShopping = () => {
    const prefix = pathname?.includes("/preview/")
      ? `/preview/${siteUser}`
      : pathname?.includes("/builder/")
        ? `/builder/${siteUser}`
        : "";
    router.push(prefix || "/");
  };

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
    <div className="min-h-full px-4 py-12 font-sans transition-colors duration-500 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <EditableText
            value="Complete Your Order"
            onChange={() => {}}
            as="h1"
            className="text-4xl font-medium md:text-5xl"
            style={{
              fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
            }}
            isEditable={isBuilder}
          />
          <EditableText
            value="Please fill in your details below"
            onChange={() => {}}
            as="p"
            className="mt-3 italic opacity-70"
            style={{
              fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
            }}
            isEditable={isBuilder}
          />
        </div>

        <div className="rounded-[32px] p-6 shadow-sm transition-all duration-300 md:p-10 lg:p-14">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column: Form */}
            <div className="space-y-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <section>
                  <h2
                    className="mb-6 text-2xl font-medium"
                    style={{
                      fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
                    }}
                  >
                    Shipping Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <Input
                        {...register("customer_name")}
                        className="place w-full rounded-2xl border-transparent px-5 py-4 transition-all outline-none placeholder:text-gray-500"
                        style={{
                          backgroundColor: `${theme.colors.primary}0A`,
                        }}
                        placeholder="Full Name"
                        disabled={isSubmitting}
                      />
                      {errors.customer_name && (
                        <p className="mt-1 px-2 text-xs text-red-500">
                          {errors.customer_name.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <Input
                          {...register("customer_email")}
                          type="email"
                          className="w-full rounded-2xl border-transparent px-5 py-4 transition-all outline-none placeholder:text-gray-500"
                          style={{
                            backgroundColor: `${theme.colors.primary}0A`,
                          }}
                          placeholder="Email"
                          disabled={isSubmitting}
                        />
                        {errors.customer_email && (
                          <p className="mt-1 px-2 text-xs text-red-500">
                            {errors.customer_email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          {...register("customer_phone")}
                          type="tel"
                          className="w-full rounded-2xl border-transparent px-5 py-4 transition-all outline-none placeholder:text-gray-500"
                          style={{
                            backgroundColor: `${theme.colors.primary}0A`,
                          }}
                          placeholder="+1 (555) 123-4567"
                          disabled={isSubmitting}
                        />
                        {errors.customer_phone && (
                          <p className="mt-1 px-2 text-xs text-red-500">
                            {errors.customer_phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Popover
                        open={openBillingCity}
                        onOpenChange={setOpenBillingCity}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openBillingCity}
                            className="h-auto w-full justify-between rounded-2xl border-transparent px-5 py-4 font-normal"
                            style={{
                              backgroundColor: `${theme.colors.primary}0A`,
                              color: "gray",
                            }}
                            disabled={isSubmitting || isLoadingDeliveryCharges}
                          >
                            {cityDistrict
                              ? citiesDistricts.find(
                                  city => city === cityDistrict
                                )
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
                        <p className="mt-1 px-2 text-xs text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        {...register("customer_address")}
                        className="w-full rounded-2xl border-transparent px-5 py-4 transition-all outline-none placeholder:text-gray-500"
                        style={{
                          backgroundColor: `${theme.colors.primary}0A`,
                        }}
                        placeholder="Billing Address"
                        disabled={isSubmitting}
                      />
                      {errors.customer_address && (
                        <p className="mt-1 px-2 text-xs text-red-500">
                          {errors.customer_address.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 px-2">
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
                        className="cursor-pointer text-sm font-normal opacity-70"
                      >
                        Shipping address same as billing address
                      </Label>
                    </div>

                    {!sameAsCustomerAddress && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-5"
                      >
                        <Input
                          {...register("shipping_address")}
                          className="w-full rounded-2xl border-transparent px-5 py-4 transition-all outline-none placeholder:text-gray-500"
                          style={{
                            backgroundColor: `${theme.colors.primary}0A`,
                          }}
                          placeholder="Shipping Address"
                          disabled={isSubmitting}
                        />
                        {errors.shipping_address && (
                          <p className="mt-1 px-2 text-xs text-red-500">
                            {errors.shipping_address.message}
                          </p>
                        )}
                      </motion.div>
                    )}

                    <div>
                      <Textarea
                        {...register("note")}
                        rows={3}
                        className="w-full resize-none rounded-2xl border-transparent px-5 py-4 transition-all outline-none"
                        style={{
                          backgroundColor: `${theme.colors.primary}0A`,
                        }}
                        placeholder="Any special instructions for your order..."
                        disabled={isSubmitting}
                      />
                      <div className="mt-2 px-2 text-right text-xs opacity-50">
                        {watch("note")?.length || 0}/500 characters
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2
                    className="mb-6 text-2xl font-medium"
                    style={{
                      fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
                    }}
                  >
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {uniquePaymentTypes.map(type => (
                      <label
                        key={type}
                        className={cn(
                          "flex cursor-pointer items-center rounded-2xl border-2 p-5 transition-all",
                          selectedPaymentMethod === type
                            ? "bg-white shadow-sm"
                            : "opacity-60"
                        )}
                        onClick={() => setSelectedPaymentMethod(type)}
                      >
                        <div
                          className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors"
                          style={{
                            borderColor: theme.colors.primary,
                            backgroundColor:
                              selectedPaymentMethod === type
                                ? theme.colors.primary
                                : "transparent",
                          }}
                        >
                          {selectedPaymentMethod === type && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative h-6 w-6 shrink-0">
                            <Image
                              unoptimized
                              src={getPaymentImage(type)}
                              alt={getPaymentLabel(type)}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="font-medium">
                            {getPaymentLabel(type)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                <Button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-full py-6 text-lg font-medium transition-all"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
                  }}
                  disabled={isSubmitting || createOrderMutation.isPending}
                >
                  <span className="relative z-10">
                    {isSubmitting || createOrderMutation.isPending
                      ? "Processing..."
                      : selectedPaymentMethod === "cod"
                        ? "Place Order (Cash on Delivery)"
                        : `Pay with ${getPaymentLabel(selectedPaymentMethod || "")}`}
                  </span>
                  <div
                    className="absolute inset-0 translate-y-full bg-black/10 transition-transform duration-300 group-hover:translate-y-0"
                    style={{ transitionTimingFunction: "ease-out" }}
                  />
                </Button>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div
              className="sticky top-24 h-fit rounded-[24px] border p-8"
              style={{
                borderColor: `${theme.colors.primary}20`,
                backgroundColor: `${theme.colors.primary}03`,
              }}
            >
              <h2
                className="mb-2 text-2xl font-medium"
                style={{
                  fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
                }}
              >
                Order Summary
              </h2>
              <p className="mb-8 opacity-50">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>

              <div className="custom-scrollbar mb-8 max-h-[400px] space-y-6 overflow-auto pr-2">
                {cartItems.map((item, index) => {
                  const displayPrice =
                    item.selectedVariant?.price || item.product.price;
                  const cartItemKey = `${item.product.id}-${item.selectedVariant?.id || "no-variant"}-${index}`;

                  return (
                    <div key={cartItemKey} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-stone-100">
                        <Image
                          unoptimized
                          src={item.product.thumbnail_image || ""}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="line-clamp-1 text-sm font-medium">
                          {item.product.name}
                        </h4>
                        <p className="text-xs opacity-50">
                          Qty: {item.quantity}
                        </p>
                        {item.selectedVariant && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Object.entries(
                              item.selectedVariant.option_values
                            ).map(([k, v]) => (
                              <span
                                key={k}
                                className="rounded-full px-1.5 py-0.5 text-[10px]"
                                style={{
                                  backgroundColor: `${theme.colors.primary}10`,
                                  color: theme.colors.primary,
                                }}
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Rs.
                          {Number(
                            Number(displayPrice) * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] opacity-40">
                          Rs.{Number(displayPrice).toLocaleString("en-IN")} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="space-y-6 border-t pt-6"
                style={{ borderColor: `${theme.colors.primary}10` }}
              >
                <PromoCodeInput
                  onPromoCodeApplied={handlePromoCodeApplied}
                  appliedPromoCode={appliedPromoCode}
                  primaryColor={theme.colors.primary}
                  subtlePrimaryBg={`${theme.colors.primary}10`}
                />

                <div className="space-y-3 text-sm opacity-70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      Rs.{Number(subtotalAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                  {appliedPromoCode && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount ({appliedPromoCode.discount_percentage}%)
                      </span>
                      <span className="font-medium">
                        -Rs.{Number(discountAmount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-medium">
                      Rs.{Number(deliveryCharge).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Weight</span>
                    <span className="font-medium">
                      {totalWeight.toFixed(2)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery To</span>
                    <span className="font-medium">
                      {sameAsCustomerAddress
                        ? cityDistrict || "Not selected"
                        : shippingCityDistrict || "Not selected"}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between border-t pt-6"
                  style={{ borderColor: `${theme.colors.primary}10` }}
                >
                  <span className="text-lg font-medium">Total</span>
                  <span
                    className="text-3xl font-medium"
                    style={{
                      color: theme.colors.primary,
                      fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
                    }}
                  >
                    Rs.{Number(totalAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStyle2;
