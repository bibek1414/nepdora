"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Plus,
  Upload,
  Loader2,
  Search,
  Trash2,
  Minus,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { productApi } from "@/services/api/owner-sites/admin/product";
import { orderApi } from "@/services/api/owner-sites/admin/orders";
import { useDeliveryChargeCalculator } from "@/hooks/owner-site/admin/use-delivery-charge-calculator";
import { VariantSelectionDialog } from "./variant-selection-dialog";
import { ProductVariantRead } from "@/types/owner-site/admin/product";
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  weight?: number;
  variants_read?: ProductVariantRead[];
  image_url?: string;
  sku?: string;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
  variant_id?: number;
  variant?: ProductVariantRead;
  product_data?: Product;
}

interface CreateManualOrderDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialMessage?: string;
  trigger?: React.ReactNode;
}
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
  variant_id?: number;
  variant?: ProductVariantRead;
  product_data?: Product;
  weight?: number;
}

interface CreateManualOrderDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialMessage?: string;
  trigger?: React.ReactNode;
}

export function CreateManualOrderDialog({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  initialMessage,
  trigger,
}: CreateManualOrderDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [confirmLocationOpen, setConfirmLocationOpen] = useState(false);
  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [extractedData, setExtractedData] = useState<any>(null);
  const [useCustomDeliveryCharge, setUseCustomDeliveryCharge] = useState(false);
  const [customDeliveryCharge, setCustomDeliveryCharge] = useState("");
  const [selectedProductForVariant, setSelectedProductForVariant] =
    useState<Product | null>(null);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    shipping_address: "",
    city: "",
    notes: "",
  });

  // Calculate total weight from order items
  const totalWeight = orderItems.reduce((total, item) => {
    const itemWeight = item.weight || 0;
    return total + Number(itemWeight) * item.quantity;
  }, 0);

  // Use delivery charge calculator
  const {
    deliveryCharge: calculatedDeliveryCharge,
    citiesDistricts,
    isLoading: isLoadingDeliveryCharges,
    searchQuery: citySearchQuery,
    setSearchQuery: setCitySearchQuery,
  } = useDeliveryChargeCalculator({
    selectedCityDistrict: formData.city,
    totalWeight,
  });

  // Determine final delivery charge based on user preference
  const finalDeliveryCharge = useCustomDeliveryCharge
    ? parseFloat(customDeliveryCharge) || 0
    : calculatedDeliveryCharge;

  useEffect(() => {
    if (open) {
      loadProducts();
      if (initialMessage) {
        setMessageInput(initialMessage);
      }
    }
  }, [open, initialMessage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await productApi.getProducts({
        page: 1,
        page_size: 100,
        in_stock: true,
      });

      const mappedProducts: Product[] = response.results.map(
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
          stock: product.stock || 0,
          weight: product.weight || 0,
          image_url: product.thumbnail_image || undefined,
          sku: product.sku,
          variants_read: product.variants_read || [],
        })
      );

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products. Please try again later.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const filteredProducts = products.filter(
    product =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      !orderItems.find(
        item => item.product_id === product.id && !item.variant_id
      )
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processWitAiResponse = (response: any) => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractedData: any = {};
    console.log("Wit.ai Response:", JSON.stringify(response, null, 2));

    const phoneNumber =
      response.entities?.["wit$phone_number:phone_number"]?.[0]?.value ||
      response.entities?.wit$phone_number?.[0]?.value;
    if (phoneNumber) {
      extractedData.phone = phoneNumber;
    }

    const location =
      response.entities?.["wit$location:location"]?.[0]?.resolved?.values?.[0]
        ?.name ||
      response.entities?.wit$location?.[0]?.resolved?.values?.[0]?.name;
    if (location) {
      extractedData.address = location;
    }

    const email =
      response.entities?.["wit$email:email"]?.[0]?.value ||
      response.entities?.wit$email?.[0]?.value;
    if (email) {
      extractedData.email = email;
    }

    if (response.entities?.wit$contact?.[0]?.value) {
      extractedData.name = response.entities.wit$contact[0].value;
    }

    if (extractedData.address) {
      const addressParts = extractedData.address.split(",");
      if (addressParts.length > 1) {
        extractedData.city = addressParts[addressParts.length - 1].trim();
      } else {
        const words = extractedData.address.split(" ");
        extractedData.city = words[words.length - 1];
      }
    }

    return extractedData;
  };

  const handleExtract = async () => {
    if (!messageInput.trim()) {
      toast.error("Please enter a message to extract");
      return;
    }

    setExtracting(true);
    try {
      const apiUrl = `https://api.wit.ai/message?v=20231028&q=${encodeURIComponent(messageInput)}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WIT_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to extract data: ${response.status} ${response.statusText}`
        );
      }

      if (!data.entities || Object.keys(data.entities).length === 0) {
        toast.warning("No extractable data found in the message");
        return;
      }

      const extractedData = processWitAiResponse(data);

      if (Object.keys(extractedData).length === 0) {
        toast.warning(
          "Could not extract any relevant information from the message"
        );
        return;
      }

      setExtractedData(extractedData);
      toast.success("Data extracted successfully!");
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Extraction error:", err);
      toast.error(
        err.message ||
          "Failed to extract data. Please check your Wit.ai configuration."
      );
    } finally {
      setExtracting(false);
    }
  };

  const handleImport = () => {
    if (!extractedData) {
      toast.error("No data to import");
      return;
    }

    setFormData(prev => ({
      ...prev,
      customer_name: extractedData.name || prev.customer_name,
      customer_email: extractedData.email || prev.customer_email,
      customer_phone: extractedData.phone || prev.customer_phone,
      customer_address: extractedData.address || prev.customer_address,
      city: extractedData.city || prev.city,
    }));

    toast.success("Extracted data imported!");
    setOpenImport(false);
  };

  const handleProductSelect = (product: Product) => {
    // Check if product has variants
    if (product.variants_read && product.variants_read.length > 0) {
      // Show variant selection dialog
      setPendingProduct(product);
      setSelectedProductForVariant(product);
      setVariantDialogOpen(true);
    } else {
      // No variants, add directly to order
      addProductToOrder(product);
    }

    setSearchQuery("");
    setShowDropdown(false);
  };

  const addProductToOrder = (
    product: Product,
    selectedVariant?: ProductVariantRead
  ) => {
    const existingItemIndex = orderItems.findIndex(
      item =>
        item.product_id === product.id &&
        item.variant_id === selectedVariant?.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item with same product and variant
      const existingItem = orderItems[existingItemIndex];
      const availableStock = selectedVariant?.stock || product.stock || 0;

      if (existingItem.quantity < availableStock) {
        setOrderItems(prev =>
          prev.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        toast.error(`Cannot add more than available stock (${availableStock})`);
      }
    } else {
      // Add new item
      const variantPrice = selectedVariant
        ? parseFloat(selectedVariant.price)
        : product.price;
      const variantStock = selectedVariant?.stock || product.stock || 0;
      const variantImage = selectedVariant?.image || product.image_url;
      const itemWeight = product.weight || 0;

      if (variantStock === 0) {
        toast.error("Selected variant is out of stock");
        return;
      }

      setOrderItems(prev => [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: variantPrice,
          image_url: variantImage,
          variant_id: selectedVariant?.id,
          variant: selectedVariant,
          product_data: product,
          weight: itemWeight,
        },
      ]);
    }
  };

  const handleVariantSelect = (variant: ProductVariantRead) => {
    if (pendingProduct) {
      addProductToOrder(pendingProduct, variant);
      setPendingProduct(null);
    }
  };

  const handleQuantityChange = (
    productId: string,
    variantId: number | undefined,
    change: number
  ) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product_id === productId && item.variant_id === variantId
      );
      if (!existingItem) return prevItems;

      const product = products.find(p => p.id === productId);
      let availableStock = product?.stock || 0;

      // If it's a variant, use variant stock
      if (variantId && product?.variants_read) {
        const variant = product.variants_read.find(v => v.id === variantId);
        availableStock = variant?.stock || 0;
      }

      const newQuantity = existingItem.quantity + change;

      if (newQuantity > availableStock) {
        toast.error(`Only ${availableStock} items available in stock`);
        return prevItems;
      }

      if (newQuantity < 1) return prevItems;

      return prevItems.map(item =>
        item.product_id === productId && item.variant_id === variantId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const handleRemoveItem = (productId: string, variantId?: number) => {
    setOrderItems(prev =>
      prev.filter(
        item =>
          !(item.product_id === productId && item.variant_id === variantId)
      )
    );
  };

  const getProductDisplayName = (item: OrderItem) => {
    if (item.variant) {
      const optionValues = Object.values(item.variant.option_values).join(", ");
      return `${item.product_name} (${optionValues})`;
    }
    return item.product_name;
  };

  const calculateTotal = () =>
    orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getOrderItemsPayload = () => {
    return orderItems.map(item => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        quantity: item.quantity,
        price: item.price.toString(),
      };

      if (item.variant_id) {
        payload.variant_id = item.variant_id;
      } else {
        payload.product_id = parseInt(item.product_id, 10);
      }

      return payload;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if (
      !formData.customer_name ||
      !formData.customer_email ||
      !formData.customer_phone ||
      !formData.customer_address ||
      !formData.city
    ) {
      toast.error("Please fill in all required customer information");
      return;
    }

    // Show location confirmation dialog before creating order
    setConfirmLocationOpen(true);
  };

  const confirmAndCreateOrder = async () => {
    setConfirmLocationOpen(false);
    setIsLoading(true);
    try {
      const orderItemsPayload = getOrderItemsPayload();

      const orderData = {
        ...formData,
        shipping_address:
          formData.shipping_address || formData.customer_address,
        shipping_city: formData.city,
        total_amount: calculateTotal().toFixed(2),
        delivery_charge: finalDeliveryCharge.toFixed(2),
        items: orderItemsPayload,
        status: "pending",
        order_status: "pending",
        is_manual: true,
        note: formData.notes,
      };

      await orderApi.createOrder(orderData);
      toast.success("Order created successfully");

      resetForm();
      setOpen(false);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create manual order");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      customer_address: "",
      shipping_address: "",
      city: "",
      notes: "",
    });
    setOrderItems([]);
    setExtractedData(null);
    setMessageInput("");
    setUseCustomDeliveryCharge(false);
    setCustomDeliveryCharge("");
    setPendingProduct(null);
    setSelectedProductForVariant(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Manual Order
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Manual Order</DialogTitle>
            <DialogDescription>
              Fill in customer details, extract contact info, and add products.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* CUSTOMER INFO */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Customer Information
                  </h3>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setOpenImport(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Extract Contact
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Name *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_phone">Phone *</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City/District *</Label>
                    <Popover
                      open={openCityDropdown}
                      onOpenChange={setOpenCityDropdown}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCityDropdown}
                          className="w-full justify-between"
                          type="button"
                        >
                          {formData.city || "Select city/district"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[--radix-popover-trigger-width] p-0"
                        align="start"
                        onWheel={e => e.stopPropagation()}
                      >
                        <Command className="max-h-80">
                          <CommandInput
                            placeholder="Search city/district..."
                            value={citySearchQuery}
                            onValueChange={setCitySearchQuery}
                          />
                          <CommandList className="max-h-64 overflow-auto">
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                              {citiesDistricts.map(city => (
                                <CommandItem
                                  key={city}
                                  value={city}
                                  onSelect={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      city: city === "None" ? "" : city,
                                    }));
                                    setOpenCityDropdown(false);
                                    setCitySearchQuery("");
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      formData.city === city ||
                                      (city === "None" && !formData.city)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {city}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_address">Billing Address *</Label>
                    <Textarea
                      id="customer_address"
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleChange}
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_address">Shipping Address</Label>
                    <Textarea
                      id="shipping_address"
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Same as billing address if left empty"
                    />
                  </div>
                </div>

                {/* Delivery Charge Section */}
                <div className="space-y-3 rounded-md border bg-blue-50 p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      Delivery Charge
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useCustomDeliveryCharge"
                        checked={useCustomDeliveryCharge}
                        onCheckedChange={checked =>
                          setUseCustomDeliveryCharge(checked === true)
                        }
                      />
                      <Label
                        htmlFor="useCustomDeliveryCharge"
                        className="cursor-pointer text-sm font-normal"
                      >
                        Use custom charge
                      </Label>
                    </div>
                  </div>

                  {useCustomDeliveryCharge ? (
                    <div>
                      <Input
                        type="number"
                        placeholder="Enter custom delivery charge"
                        value={customDeliveryCharge}
                        onChange={e => setCustomDeliveryCharge(e.target.value)}
                        step="0.01"
                        min="0"
                        className="bg-white"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-primary">Location:</span>
                        <span className="text-primary font-medium">
                          {formData.city || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-blue-200 pt-2">
                        <span className="text-primary font-semibold">
                          Delivery Charge:
                        </span>
                        <span className="text-primary font-bold">
                          Rs. {calculatedDeliveryCharge.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Products</h3>

                <div ref={searchRef} className="relative">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={e => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search or select products..."
                      className="pr-10 pl-10 placeholder:text-gray-400"
                    />
                  </div>

                  {showDropdown && (
                    <>
                      {isLoadingProducts ? (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white p-4 text-center text-sm text-gray-500 shadow-lg">
                          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                          Loading products...
                        </div>
                      ) : filteredProducts.length > 0 ? (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                          {filteredProducts.map(product => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleProductSelect(product)}
                              className="flex w-full items-center gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                            >
                              {product.image_url && (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {product.name}
                                  {product.variants_read &&
                                    product.variants_read.length > 0 && (
                                      <span className="ml-2 text-xs text-blue-600">
                                        ({product.variants_read.length}{" "}
                                        variants)
                                      </span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Rs. {product.price.toFixed(2)} •{" "}
                                  {product.stock} in stock
                                  {product.weight && ` • ${product.weight} kg`}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white p-4 text-center text-sm text-gray-500 shadow-lg">
                          No products found
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Selected Products */}
                {orderItems.length > 0 ? (
                  <div className="space-y-3 rounded-md border p-4">
                    {orderItems.map(item => {
                      const displayImage =
                        item.variant?.image || item.image_url;

                      return (
                        <div
                          key={`${item.product_id}-${item.variant_id || "base"}`}
                          className="flex items-center justify-between gap-4 rounded-md bg-gray-50 p-3"
                        >
                          <div className="flex items-center gap-3">
                            {displayImage && (
                              <img
                                src={displayImage}
                                alt={getProductDisplayName(item)}
                                className="h-12 w-12 rounded-md border object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {getProductDisplayName(item)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Rs. {item.price.toFixed(2)} each
                                {item.weight && ` • ${item.weight} kg each`}
                                {item.variant && (
                                  <span className="ml-2 text-xs text-blue-600">
                                    Variant
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    item.variant_id,
                                    -1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    item.variant_id,
                                    1
                                  )
                                }
                                disabled={
                                  item.variant
                                    ? item.quantity >= (item.variant.stock || 0)
                                    : item.quantity >=
                                      (item.product_data?.stock || 0)
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="w-24 text-right font-medium text-gray-900">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveItem(
                                  item.product_id,
                                  item.variant_id
                                )
                              }
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-medium">
                          {orderItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          Rs. {calculateTotal().toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Delivery Charge:</span>
                        <span className="font-medium">
                          Rs. {finalDeliveryCharge.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t pt-2">
                        <span className="text-lg font-semibold text-gray-900">
                          Total Amount:
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          Rs.{" "}
                          {(calculateTotal() + finalDeliveryCharge).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-gray-500">
                      No products added. Search and select products above.
                    </p>
                  </div>
                )}
              </div>

              {/* NOTES */}
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add special instructions..."
                  rows={3}
                />
              </div>
            </form>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variant Selection Dialog */}
      <VariantSelectionDialog
        open={variantDialogOpen}
        onOpenChange={setVariantDialogOpen}
        productName={selectedProductForVariant?.name || ""}
        variants={selectedProductForVariant?.variants_read || []}
        onVariantSelect={handleVariantSelect}
        currentVariant={null}
      />

      {/* EXTRACT CONTACT DIALOG */}
      <Dialog open={openImport} onOpenChange={setOpenImport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Extract Contact Info</DialogTitle>
            <DialogDescription>
              Paste or type a message (e.g., &quot;Hi, I&apos;m Sam from Tokha,
              9812…&quot;)
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            placeholder="Enter message to extract data"
            rows={4}
          />

          {extracting ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              <span className="ml-2 text-sm text-gray-500">
                Extracting data...
              </span>
            </div>
          ) : (
            extractedData && (
              <div className="rounded-md border bg-gray-50 p-3 text-sm">
                <p>
                  <strong>Name:</strong> {extractedData.name || "-"}
                </p>
                <p>
                  <strong>Email:</strong> {extractedData.email || "-"}
                </p>
                <p>
                  <strong>Phone:</strong> {extractedData.phone || "-"}
                </p>
                <p>
                  <strong>Address:</strong> {extractedData.address || "-"}
                </p>
                <p>
                  <strong>City:</strong> {extractedData.city || "-"}
                </p>
              </div>
            )
          )}

          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setOpenImport(false)}>
              Close
            </Button>
            <Button
              onClick={handleExtract}
              disabled={extracting || !messageInput.trim()}
            >
              {extracting ? "Extracting..." : "Extract"}
            </Button>
            <Button
              onClick={handleImport}
              disabled={!extractedData}
              variant="default"
            >
              Import Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM LOCATION DIALOG */}
      <Dialog open={confirmLocationOpen} onOpenChange={setConfirmLocationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delivery Location</DialogTitle>
            <DialogDescription>
              Please confirm the delivery address and shipping information
              before creating the order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border bg-gray-50 p-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">Customer:</p>
                  <p className="text-gray-900">{formData.customer_name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Phone:</p>
                  <p className="text-gray-900">{formData.customer_phone}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    Billing Address:
                  </p>
                  <p className="text-gray-900">{formData.customer_address}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    Shipping Address:
                  </p>
                  <p className="text-gray-900">
                    {formData.shipping_address || formData.customer_address}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">City:</p>
                  <p className="text-gray-900">{formData.city}</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border bg-blue-50 p-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-800">Subtotal:</span>
                  <span className="text-primary font-medium">
                    Rs. {calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Delivery Charge:</span>
                  <span className="text-primary font-medium">
                    Rs. {finalDeliveryCharge.toFixed(2)}
                    {useCustomDeliveryCharge && (
                      <span className="ml-1 text-xs">(Custom)</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="font-bold text-blue-800">Order Total:</span>
                  <span className="text-primary font-bold">
                    Rs. {(calculateTotal() + finalDeliveryCharge).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {totalWeight > 0 && (
              <div className="rounded-md border bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  <strong>Total Package Weight:</strong>{" "}
                  {totalWeight.toFixed(2)} kg
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmLocationOpen(false);
                toast.info("Order cancelled. You can edit the information.");
              }}
            >
              Cancel, edit info
            </Button>
            <Button onClick={confirmAndCreateOrder} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm & Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
