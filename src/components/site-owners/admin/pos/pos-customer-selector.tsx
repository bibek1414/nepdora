"use client";

import { useState } from "react";
import { User, UserPlus, Search, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePOS } from "@/contexts/POSContext";
import { useGetRegisteredCustomers } from "@/hooks/owner-site/admin/use-customers";
import POSNewCustomerDialog from "./pos-new-customer-dialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

function CustomerAvatar({
  firstName,
  lastName,
  size = "md",
}: {
  firstName: string;
  lastName: string;
  size?: "sm" | "md";
}) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  return (
    <div
      className={`bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-full font-semibold ${
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs"
      }`}
    >
      {initials}
    </div>
  );
}

export default function POSCustomerSelector() {
  const { selectedCustomer, setSelectedCustomer } = usePOS();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: customersData, isLoading } = useGetRegisteredCustomers({
    search: searchTerm,
    page_size: 6,
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
    <div className="space-y-2.5">
      {/* Label */}
      <div className="flex items-center gap-2">
        <User className="text-muted-foreground h-4 w-4" />
        <span className="text-foreground text-sm font-semibold">Customer</span>
      </div>

      {selectedCustomer ? (
        /* Selected customer card */
        <div className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-lg border px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <CustomerAvatar
              firstName={selectedCustomer.first_name}
              lastName={selectedCustomer.last_name}
            />
            <div className="min-w-0">
              <p className="text-foreground text-sm leading-tight font-semibold">
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </p>
              <p className="text-muted-foreground text-xs">
                {selectedCustomer.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-primary/10 flex h-5 w-5 items-center justify-center rounded-full">
              <Check className="text-primary h-3 w-3" />
            </div>
            <button
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors focus:outline-none"
              onClick={handleClearCustomer}
              aria-label="Remove customer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Search input */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 z-10 h-3.5 w-3.5 -translate-y-1/2" />
            <Input
              placeholder="Search by name or phone…"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border-border bg-muted/40 placeholder:text-muted-foreground focus:bg-background h-10 pl-8 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setIsSearching(false);
                }}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer focus:outline-none"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {isSearching && (
            <Card className="border-border absolute z-20 mt-1.5 w-full overflow-hidden border p-0 shadow-lg">
              <ScrollArea className="max-h-[240px]">
                {isLoading ? (
                  <div className="flex flex-col gap-1 p-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-md px-3 py-2"
                      >
                        <div className="bg-muted h-7 w-7 animate-pulse rounded-full" />
                        <div className="flex-1 space-y-1.5">
                          <div className="bg-muted h-2.5 w-1/2 animate-pulse rounded" />
                          <div className="bg-muted h-2 w-1/3 animate-pulse rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : customersData?.results &&
                  customersData.results.length > 0 ? (
                  <div className="p-1.5">
                    {customersData.results.map(customer => (
                      <button
                        key={customer.id}
                        className="hover:bg-accent focus:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-colors focus:outline-none"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <CustomerAvatar
                          firstName={customer.first_name}
                          lastName={customer.last_name}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {customer.phone}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground px-4 py-3 text-center text-xs">
                    No customers found
                  </p>
                )}
              </ScrollArea>

              {/* Register new */}
              <div className="border-border bg-muted/30 border-t p-1.5">
                <button
                  className="text-primary hover:bg-primary/10 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Register &ldquo;{searchTerm}&rdquo; as new customer
                </button>
              </div>
            </Card>
          )}

          {/* Walk-in indicator */}
          {!isSearching && (
            <p className="text-muted-foreground mt-2 text-xs">
              No customer selected - will be recorded as{" "}
              <span className="text-foreground font-medium">Walk-in</span>
            </p>
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
