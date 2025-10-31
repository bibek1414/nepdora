"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Upload, Loader2, Search, Trash2, Minus } from "lucide-react";
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

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  sku?: string; // Make sku optional since it might not exist in the API response
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface CreateManualOrderDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialMessage?: string;
  trigger?: React.ReactNode;
}

import { productApi } from "@/services/api/owner-sites/admin/product";
import { orderApi } from "@/services/api/owner-sites/admin/orders";

export function CreateManualOrderDialog({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  initialMessage,
  trigger,
}: CreateManualOrderDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [confirmLocationOpen, setConfirmLocationOpen] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [extractedData, setExtractedData] = useState<any>(null);
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
    delivery_charge: "0.00",
    notes: "",
  });

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

      // Map the API response to the expected Product interface
      const mappedProducts: Product[] = response.results.map(product => {
        // Create base product object
        const productData: Product = {
          id: product.id.toString(),
          name: product.name,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
          stock: product.stock || 0,
          image_url: product.thumbnail_image || undefined,
        };
        return productData;
      });

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
      !orderItems.find(item => item.product_id === product.id)
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

  const handleExtract = async () => {
    if (!messageInput.trim()) {
      toast.error("Please enter a message to extract");
      return;
    }

    setExtracting(true);
    try {
      // Mock extraction for demo - replace with actual Wit.ai API
      // const response = await fetch(
      //   `https://api.wit.ai/message?v=20251028&q=${encodeURIComponent(messageInput)}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_WIT_API_KEY}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock extracted data based on common patterns
      const mockExtractedData = extractFromMessage(messageInput);

      setExtractedData(mockExtractedData);
      toast.success("Data extracted successfully!");

      // If address found, confirm first
      if (mockExtractedData.address) {
        setPendingAddress(mockExtractedData.address);
        setConfirmLocationOpen(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Extraction error:", err);
      toast.error(err.message || "Failed to extract data");
    } finally {
      setExtracting(false);
    }
  };

  // Helper function to extract data from message
  const extractFromMessage = (message: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extracted: any = {
      name: null,
      email: null,
      phone: null,
      address: null,
      city: null,
    };

    // Extract phone number (Nepali format)
    const phoneMatch = message.match(/(?:\+?977)?9[78]\d{8}/);
    if (phoneMatch) {
      extracted.phone = phoneMatch[0];
    }

    // Extract name (simple pattern - word after "I'm", "this is", "name is")
    const nameMatch = message.match(
      /(?:I'm|I am|this is|name is|myself)\s+([A-Za-z]+)/i
    );
    if (nameMatch) {
      extracted.name = nameMatch[1];
    }

    // Extract email
    const emailMatch = message.match(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    );
    if (emailMatch) {
      extracted.email = emailMatch[0];
    }

    // Extract common Nepali locations/addresses
    const locations = [
      "Patan",
      "Kathmandu",
      "Bhaktapur",
      "Lalitpur",
      "Pokhara",
      "Biratnagar",
    ];
    const addressMatch = locations.find(location =>
      message.toLowerCase().includes(location.toLowerCase())
    );

    if (addressMatch) {
      extracted.address = addressMatch;
      extracted.city = addressMatch;
    }

    // Extract quantities and items
    const quantityMatch = message.match(
      /(\d+)\s*(chicken momos|veg momos|buff momos|momos|chowmein)/i
    );
    if (quantityMatch && !orderItems.length) {
      // Auto-add items to order if detected
      const quantity = parseInt(quantityMatch[1]);
      const itemName = quantityMatch[2].toLowerCase();

      const product = products.find(p =>
        p.name.toLowerCase().includes(itemName)
      );

      if (product) {
        setOrderItems(prev => [
          ...prev,
          {
            product_id: product.id,
            product_name: product.name,
            quantity: quantity,
            price: product.price,
            image_url: product.image_url,
          },
        ]);
      }
    }

    return extracted;
  };

  const handleImport = () => {
    if (!extractedData) {
      toast.error("No data to import");
      return;
    }

    if (extractedData.address) {
      setPendingAddress(extractedData.address);
      setConfirmLocationOpen(true);
      return;
    }

    setFormData(prev => ({
      ...prev,
      customer_name: extractedData.name || prev.customer_name,
      customer_email: extractedData.email || prev.customer_email,
      customer_phone: extractedData.phone || prev.customer_phone,
      city: extractedData.city || prev.city,
    }));

    toast.success("Extracted data imported!");
    setOpenImport(false);
  };

  const handleProductSelect = (product: Product) => {
    const existingItem = orderItems.find(
      item => item.product_id === product.id
    );

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setOrderItems(
          orderItems.map(item =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        toast.error("Cannot add more than available stock");
      }
    } else {
      setOrderItems([
        ...orderItems,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: product.price,
          image_url: product.image_url,
        },
      ]);
    }

    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product_id === productId
      );
      if (!existingItem) return prevItems;

      const newQuantity = existingItem.quantity + change;
      const product = products.find(p => p.id === productId);
      if (product && newQuantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return prevItems;
      }

      if (newQuantity < 1) return prevItems;
      return prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.product_id !== id));
  };

  const calculateTotal = () =>
    orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

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

    setIsLoading(true);
    try {
      const orderPayload = {
        ...formData,
        shipping_address:
          formData.shipping_address || formData.customer_address,
        shipping_city: formData.city,
        total_amount: calculateTotal().toFixed(2),
        delivery_charge: formData.delivery_charge || "0.00",
        items: orderItems.map(item => ({
          product_id: parseInt(item.product_id, 10),
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        status: "pending",
        order_status: "pending",
        is_manual: true,
        note: formData.notes,
      };

      // Convert order items to the format expected by the API
      const orderItemsPayload = orderItems.map(item => ({
        product_id: parseInt(item.product_id, 10),
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        ...orderPayload,
        order_items: orderItemsPayload,
        // Ensure required fields are included
        status: "pending",
        payment_status: "pending",
        // Convert total_amount to string to match the API type
        total_amount: orderItems
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toString(),
      };

      await orderApi.createOrder(orderData, false);
      toast.success("Order created successfully");

      // Reset form
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        shipping_address: "",
        city: "",
        delivery_charge: "0.00",
        notes: "",
      });
      setOrderItems([]);
      setExtractedData(null);
      setMessageInput("");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to create manual order");
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
      delivery_charge: "0.00",
      notes: "",
    });
    setOrderItems([]);
    setExtractedData(null);
    setMessageInput("");
  };

  return (
    <>
      {/* MAIN DIALOG TRIGGER */}
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
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="delivery_charge">Delivery Charge</Label>
                    <Input
                      id="delivery_charge"
                      name="delivery_charge"
                      type="number"
                      value={formData.delivery_charge}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
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
                      className="pr-10 pl-10"
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
                                </p>
                                <p className="text-xs text-gray-500">
                                  Rs. {product.price.toFixed(2)} •{" "}
                                  {product.stock} in stock
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
                      const product = products.find(
                        p => p.id === item.product_id
                      );
                      return (
                        <div
                          key={item.product_id}
                          className="flex items-center justify-between gap-4 rounded-md bg-gray-50 p-3"
                        >
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="h-12 w-12 rounded-md border object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.product_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Rs. {item.price.toFixed(2)} each
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
                                  handleQuantityChange(item.product_id, -1)
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
                                  handleQuantityChange(item.product_id, 1)
                                }
                                disabled={
                                  product
                                    ? item.quantity >= product.stock
                                    : false
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
                              onClick={() => handleRemoveItem(item.product_id)}
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
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Total Amount:
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          Rs. {calculateTotal().toFixed(2)}
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Location</DialogTitle>
            <DialogDescription>
              We detected the following address. Please confirm if it&apos;s
              correct.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-gray-50 p-3 text-sm">
            <p>
              <strong>Detected Address:</strong>
            </p>
            <p className="mt-1 text-gray-700">{pendingAddress}</p>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmLocationOpen(false);
                toast.info("Address not confirmed. You can edit it manually.");
              }}
            >
              No, edit manually
            </Button>
            <Button
              onClick={() => {
                if (extractedData) {
                  setFormData(prev => ({
                    ...prev,
                    customer_name: extractedData.name || prev.customer_name,
                    customer_email: extractedData.email || prev.customer_email,
                    customer_phone: extractedData.phone || prev.customer_phone,
                    customer_address: pendingAddress || prev.customer_address,
                    city: extractedData.city || prev.city,
                  }));
                  toast.success("All extracted data imported successfully!");
                }
                setConfirmLocationOpen(false);
                setOpenImport(false);
              }}
            >
              Yes, use this address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
