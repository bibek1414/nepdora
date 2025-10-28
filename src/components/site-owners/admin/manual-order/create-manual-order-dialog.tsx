"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { orderApi } from "@/services/api/owner-sites/admin/orders";
import { productApi } from "@/services/api/owner-sites/admin/product";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  sku?: string;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export function CreateManualOrderDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  //   eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [extractedData, setExtractedData] = useState<any>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    shipping_address: "",
    notes: "",
  });

  useEffect(() => {
    if (open) loadProducts();
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim() === "") setFilteredProducts(products);
    else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          p =>
            p.name.toLowerCase().includes(query) ||
            p.sku?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await productApi.getProducts({
        page: 1,
        page_size: 100,
        in_stock: true,
      });
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedProducts: Product[] = response.results.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        price: parseFloat(p.price),
        stock: p.stock || 0,
        image_url: p.thumbnail_image || undefined,
      }));

      setProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

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
      const response = await fetch(
        `https://api.wit.ai/message?v=20251028&q=${encodeURIComponent(messageInput)}`,
        {
          headers: {
            Authorization: "Bearer V5XVUPS6ZLHHOKXKC62IROZEZEXMG7Y5",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch from Wit.ai");
      }

      const data = await response.json();

      // Process the Wit.ai response to match your expected format
      const extractValue = (key: string) => {
        // Handle different possible entity name formats
        const possibleKeys = [
          key,
          `wit$${key}:${key}`,
          `name:${key}`,
          `wit$${key}`,
        ];

        for (const k of possibleKeys) {
          const entity = data.entities?.[k]?.[0];
          if (entity) {
            // For phone numbers, clean up the format
            if (key === "phone_number" && entity.value) {
              return entity.value.replace(/[^0-9+]/g, "");
            }
            return entity.value || entity.body || null;
          }
        }
        return null;
      };

      const extracted = {
        name: extractValue("name"),
        email: extractValue("email"),
        phone: extractValue("phone_number"),
        address: extractValue("location") || extractValue("address"),
      };

      setExtractedData(extracted);
      toast.success("Data extracted successfully!");
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Wit.ai extraction error:", err);
      toast.error(err.message || "Failed to extract data");
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
      customer_name: extractedData.name || "",
      customer_email: extractedData.email || "",
      customer_phone: extractedData.phone || "",
      customer_address: extractedData.address || "",
    }));

    toast.success("Extracted data imported!");
    setOpenImport(false);
  };

  const handleAddProduct = () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingItem = orderItems.find(
      item => item.product_id === selectedProductId
    );

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        const newItems = orderItems.map(item =>
          item.product_id === selectedProductId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setOrderItems(newItems);
      } else {
        toast.error("Cannot add more than available stock");
      }
    } else {
      setOrderItems(prevItems => [
        ...prevItems,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: product.price,
          image_url: product.image_url,
        },
      ]);
    }

    setSelectedProductId("");
    setSearchQuery("");
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
      !formData.customer_address
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
        total_amount: calculateTotal().toFixed(2),
        items: orderItems.map(item => ({
          product_id: parseInt(item.product_id, 10),
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        status: "pending",
        is_manual: true,
      };

      await orderApi.createOrder(orderPayload);
      toast.success("Manual order created successfully");
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        shipping_address: "",
        notes: "",
      });
      setOrderItems([]);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to create manual order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* MAIN ORDER DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Manual Order
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Manual Order</DialogTitle>
            <DialogDescription>
              Fill in customer details, extract contact info, and add products.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <div className="space-y-6 py-4">
              {/* CUSTOMER INFO */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Customer Information
                  </h3>
                  <Button
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
                    <Label>Name *</Label>
                    <Input
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Billing Address *</Label>
                    <Textarea
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleChange}
                      rows={2}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {selectedProductId
                            ? products.find(p => p.id === selectedProductId)
                                ?.name
                            : "Select product..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="end">
                        <Command>
                          <CommandInput
                            placeholder="Search products..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandEmpty>No products found.</CommandEmpty>
                          <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {filteredProducts.map(product => (
                              <CommandItem
                                key={product.id}
                                value={product.id}
                                onSelect={() => {
                                  setSelectedProductId(product.id);
                                  setSearchQuery("");
                                  document.dispatchEvent(
                                    new KeyboardEvent("keydown", {
                                      key: "Escape",
                                    })
                                  );
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  {product.image_url && (
                                    <img
                                      src={product.image_url}
                                      alt={product.name}
                                      className="h-8 w-8 rounded-md object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">
                                      {product.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                      ${product.price.toFixed(2)} •{" "}
                                      {product.stock} in stock
                                    </p>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Button
                      onClick={e => {
                        e.preventDefault();
                        handleAddProduct();
                      }}
                      disabled={!selectedProductId}
                      className="whitespace-nowrap"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {selectedProductId ? "Add to Order" : "Select a Product"}
                    </Button>
                  </div>
                </div>

                {/* ORDER ITEMS */}
                {orderItems.length > 0 && (
                  <div className="divide-y rounded-md border">
                    {orderItems.map(item => {
                      const product = products.find(
                        p => p.id === item.product_id
                      );
                      return (
                        <div
                          key={item.product_id}
                          className="flex items-center justify-between p-3"
                        >
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-muted-foreground text-sm">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 items-center overflow-hidden rounded-md border">
                              <button
                                type="button"
                                className="hover:bg-muted flex h-full items-center justify-center px-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleQuantityChange(item.product_id, -1);
                                }}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="hover:bg-muted flex h-full items-center justify-center px-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleQuantityChange(item.product_id, 1);
                                }}
                                disabled={
                                  product
                                    ? item.quantity >= product.stock
                                    : false
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveItem(item.product_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {/* ORDER SUMMARY */}
                    <div className="bg-muted/50 border-t p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Total Items:
                        </span>
                        <span className="font-medium">
                          {orderItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Total Amount:
                        </span>
                        <span className="text-lg font-bold">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* NOTES */}
              <div className="space-y-2">
                <Label>Order Notes</Label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any special instructions or notes for this order..."
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || orderItems.length === 0}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                `Create Order (${orderItems.reduce((sum, item) => sum + item.quantity, 0)} items)`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EXTRACTION DIALOG */}
      <Dialog open={openImport} onOpenChange={setOpenImport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Extract from Message</DialogTitle>
            <DialogDescription>
              Paste a customer message to extract contact info.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Textarea
              placeholder="Hi, I’m Anju Lama. My email is anju@example.com. My phone is +9779810001018 and I live in Tokha, Kathmandu."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              rows={4}
            />

            <Button
              onClick={handleExtract}
              disabled={extracting}
              className="w-full"
            >
              {extracting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Extract Data
            </Button>

            {extractedData && (
              <div className="bg-muted/50 rounded-md border p-3 text-sm">
                <p>
                  <strong>Name:</strong> {extractedData.name || "—"}
                </p>
                <p>
                  <strong>Email:</strong> {extractedData.email || "—"}
                </p>
                <p>
                  <strong>Phone:</strong> {extractedData.phone || "—"}
                </p>
                <p>
                  <strong>Address:</strong> {extractedData.address || "—"}
                </p>
                <p>
                  <strong>Product:</strong> {extractedData.product || "—"}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenImport(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!extractedData}>
              Import to Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
