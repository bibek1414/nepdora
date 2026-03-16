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
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <POSProductList />
        </div>

        {/* Sidebar - Cart and Customer */}
        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Checkout</h2>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-50 bg-gray-50/30 shrink-0">
              <POSCustomerSelector />
            </div>
            <div className="flex-1 flex flex-col min-h-0 p-4">
              <POSCart />
            </div>
          </div>
        </div>
      </div>
    </POSProvider>
  );
}
