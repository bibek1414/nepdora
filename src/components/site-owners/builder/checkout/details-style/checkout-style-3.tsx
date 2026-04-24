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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { useCreateOrder } from "@/hooks/owner-site/admin/use-orders";
import { CreateOrderRequest, OrderItem } from "@/types/owner-site/admin/orders";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/customer/use-auth";
import { checkoutFormSchema, CheckoutFormValues } from "@/schemas/chekout.form";
import { usePaymentGateways } from "@/hooks/owner-site/admin/use-payment-gateway";
import { motion } from "framer-motion";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { useDeliveryChargeCalculator } from "@/hooks/owner-site/admin/use-delivery-charge-calculator";

interface CheckoutStyleProps {
  siteUser?: string;
}

const MOCK_CART = [
  {
    product: {
      id: 1,
      name: "Sample Product B",
      thumbnail_image: "/fallback/image-not-found.png",
      price: "0.00",
      weight: 0.8,
    },
    quantity: 1,
    selectedVariant: null,
  },
];

const CheckoutStyle3 = ({ siteUser: propSiteUser }: CheckoutStyleProps) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { cartItems: realCartItems, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();
  const { user, isAuthenticated } = useAuth();
  const { data: paymentGateways } = usePaymentGateways();
  const { data: themeResponse } = useThemeQuery();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [openBillingCity, setOpenBillingCity] = useState(false);
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

  const totalWeight = cartItems.reduce((total, item) => {
    const itemWeight = item.product.weight || 0;
    return total + Number(itemWeight) * item.quantity;
  }, 0);

  const {
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

  const subtotalAmount = cartItems.reduce((total, item) => {
    const itemPrice = item.selectedVariant?.price || item.product.price;
    return total + Number(itemPrice) * item.quantity;
  }, 0);

  const totalAmount = subtotalAmount; // Delivery charge not shown in catalog mode

  const enabledPaymentGateways =
    paymentGateways?.filter(gateway => gateway.is_enabled) || [];
  const gatewayPaymentTypes = Array.from(
    new Set(enabledPaymentGateways.map(g => g.payment_type))
  );
  const uniquePaymentTypes = ["cod", ...gatewayPaymentTypes];

  useEffect(() => {
    if (uniquePaymentTypes.includes("cod") && !selectedPaymentMethod) {
      setSelectedPaymentMethod("cod");
    }
  }, [uniquePaymentTypes, selectedPaymentMethod]);

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
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

  const getPaymentImage = (type: string) => {
    switch (type.toLowerCase()) {
      case "esewa":
        return "/images/payment-gateway/esewa.png";
      case "khalti":
        return "/images/payment-gateway/khalti.png";
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

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
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
        delivery_charge: "0.00",
        items: orderItems,
        note: data.note,
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

      toast.success("Order placed successfully!");
      clearCart();
      router.push(orderConfirmUrl);
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (cartItems.length === 0 && !isBuilder) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <Button
          onClick={() =>
            router.push(
              pathname?.includes("/preview/") ? `/preview/${siteUser}` : "/"
            )
          }
          style={primaryButtonStyle}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <EditableText
            value="Order Request"
            onChange={() => {}}
            as="title"
            className="text-4xl font-medium md:text-5xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isBuilder}
          />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <section>
                <h2
                  className="mb-6 text-2xl font-medium"
                  style={{ fontFamily: theme.fonts.heading }}
                >
                  Customer Information
                </h2>
                <div className="space-y-5">
                  <div>
                    <Input
                      {...register("customer_name")}
                      className="rounded-2xl border-transparent px-5 py-4 placeholder:text-gray-500"
                      style={{ backgroundColor: `${theme.colors.primary}0A` }}
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
                        className="rounded-2xl border-transparent px-5 py-4 placeholder:text-gray-500"
                        style={{ backgroundColor: `${theme.colors.primary}0A` }}
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
                        className="rounded-2xl border-transparent px-5 py-4 placeholder:text-gray-500"
                        style={{ backgroundColor: `${theme.colors.primary}0A` }}
                        placeholder="Phone Number"
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
                          className="w-full justify-between rounded-2xl border-transparent px-5 py-4"
                          style={{
                            backgroundColor: `${theme.colors.primary}0A`,
                            color: "gray",
                          }}
                          disabled={isSubmitting || isLoadingDeliveryCharges}
                        >
                          {cityDistrict || "Select city/district"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search..."
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
                      className="rounded-2xl border-transparent px-5 py-4 placeholder:text-gray-500"
                      style={{ backgroundColor: `${theme.colors.primary}0A` }}
                      placeholder="Address"
                      disabled={isSubmitting}
                    />
                    {errors.customer_address && (
                      <p className="mt-1 px-2 text-xs text-red-500">
                        {errors.customer_address.message}
                      </p>
                    )}
                  </div>

                  <Textarea
                    {...register("note")}
                    rows={3}
                    className="rounded-2xl border-transparent px-5 py-4"
                    style={{ backgroundColor: `${theme.colors.primary}0A` }}
                    placeholder="Any special instructions..."
                    disabled={isSubmitting}
                  />
                </div>
              </section>

              <Button
                type="submit"
                className="w-full rounded-full py-6 text-lg font-medium"
                style={primaryButtonStyle}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit Order Request"}
              </Button>
            </form>
          </div>

          <div
            className="sticky top-24 h-fit rounded-[24px] border p-8"
            style={{
              borderColor: `${theme.colors.primary}20`,
              backgroundColor: `${theme.colors.primary}03`,
            }}
          >
            <h2
              className="mb-2 text-2xl font-medium"
              style={{ fontFamily: theme.fonts.heading }}
            >
              Items
            </h2>
            <p className="mb-8 opacity-50">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>

            <div className="max-h-[400px] space-y-6 overflow-auto pr-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border">
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
                    <p className="text-xs opacity-50">Qty: {item.quantity}</p>
                    {item.selectedVariant && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(item.selectedVariant.option_values).map(
                          ([k, v]) => (
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
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStyle3;
