"use client";

import { POSProvider } from "@/contexts/POSContext";
import POSProductList from "@/components/site-owners/admin/pos/pos-product-list";
import POSCart from "@/components/site-owners/admin/pos/pos-cart";
import POSCustomerSelector from "@/components/site-owners/admin/pos/pos-customer-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderList from "@/components/site-owners/admin/orders/order-list";

export default function POSPage() {
  return (
    <POSProvider>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Main Content - Product/Order List Tabs */}
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <Tabs defaultValue="products" className="flex h-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <TabsList className="h-14 bg-gray-100 p-1">
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-primary h-10 cursor-pointer rounded-md px-6 py-2 text-sm font-semibold data-[state=active]:text-white"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-primary h-10 cursor-pointer rounded-md px-6 py-2 text-sm font-semibold data-[state=active]:text-white"
                >
                  Orders
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="products"
              className="m-0 flex-1 overflow-hidden"
            >
              <POSProductList />
            </TabsContent>

            <TabsContent value="orders" className="m-0 flex-1 overflow-hidden">
              <OrderList isPOS={true} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Cart and Customer */}
        <div className="z-50 flex h-full w-[400px] flex-col overflow-hidden border-l border-gray-200 bg-white">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-gray-50 bg-gray-50/30 p-4">
              <POSCustomerSelector />
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <POSCart />
            </div>
          </div>
        </div>
      </div>
    </POSProvider>
  );
}
