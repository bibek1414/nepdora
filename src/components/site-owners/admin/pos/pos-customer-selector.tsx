"use client";

import { useState } from "react";
import { User, UserPlus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePOS } from "@/contexts/POSContext";
import { useGetRegisteredCustomers } from "@/hooks/owner-site/admin/use-customers";
import POSNewCustomerDialog from "./pos-new-customer-dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function POSCustomerSelector() {
  const { selectedCustomer, setSelectedCustomer } = usePOS();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: customersData, isLoading } = useGetRegisteredCustomers({
    search: searchTerm,
    page_size: 5,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setSearchTerm("");
    setIsSearching(false);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <User className="h-5 w-5" />
          <span className="font-medium">Customer</span>
        </div>
      </div>

      {selectedCustomer ? (
        <div className="flex items-center justify-between rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-[#4F46E5]">
              {selectedCustomer.first_name[0]}
              {selectedCustomer.last_name[0]}
            </div>
            <div>
              <p className="leading-tight font-semibold text-gray-900">
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </p>
              <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500"
            onClick={handleClearCustomer}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search customer by name or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-11 border-gray-200 bg-gray-50 pl-9 placeholder:text-gray-400 focus:bg-white"
            />
          </div>

          {isSearching && (
            <Card className="absolute z-10 mt-1 w-full overflow-hidden border border-gray-100 shadow-lg">
              <ScrollArea className="max-h-[250px]">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Searching...
                  </div>
                ) : customersData?.results &&
                  customersData.results.length > 0 ? (
                  <div className="py-2">
                    {customersData.results.map(customer => (
                      <button
                        key={customer.id}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                          {customer.first_name[0]}
                          {customer.last_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer.phone}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No customers found
                  </div>
                )}
              </ScrollArea>
              <div className="border-t border-gray-50 bg-gray-50/50 p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-[#4F46E5] hover:bg-transparent hover:text-[#4338CA]"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <UserPlus className="mr-1 h-3 w-3" />
                  Register "{searchTerm}" as new customer
                </Button>
              </div>
            </Card>
          )}

          {!isSearching && (
            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className="cursor-default bg-gray-50 px-3 py-1 font-normal text-gray-500"
              >
                Walk-in Customer
              </Badge>
            </div>
          )}
        </div>
      )}

      <POSNewCustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSelectCustomer}
        initialPhone={/^\d+$/.test(searchTerm) ? searchTerm : ""}
      />
    </div>
  );
}
