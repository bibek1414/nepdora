"use client";

import { POSProvider } from "@/contexts/POSContext";
import POSProductList from "@/components/site-owners/admin/pos/pos-product-list";
import POSCart from "@/components/site-owners/admin/pos/pos-cart";
import POSCustomerSelector from "@/components/site-owners/admin/pos/pos-customer-selector";

export default function POSPage() {
  return (
    <POSProvider>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
        {/* Main Content - Product List */}
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <POSProductList />
        </div>

        {/* Sidebar - Cart and Customer */}
        <div className="flex h-full w-[400px] flex-col overflow-hidden border-l border-gray-200 bg-white">
          <div className="shrink-0 border-b border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-800">Checkout</h2>
          </div>

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
