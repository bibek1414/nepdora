"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePricings,
  useDeletePricing,
} from "@/hooks/owner-site/admin/use-pricing";
import { PricingForm } from "./pricing-form";
import { Plus, Edit, Trash2, Search, X, Star, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pricing } from "@/types/owner-site/admin/pricing";
import { useDebouncedCallback } from "use-debounce";

export const PricingList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null);
  const [deletePricing, setDeletePricing] = useState<Pricing | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error } = usePricings({
    search,
  });
  const deletePricingMutation = useDeletePricing();

  const handleEdit = (pricing: Pricing) => {
    setEditingPricing(pricing);
    setShowForm(true);
  };

  const handleRowClick = (pricing: Pricing, event: React.MouseEvent) => {
    // Prevent row click when clicking on action buttons
    const target = event.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest(".action-button") ||
      target.tagName === "BUTTON"
    ) {
      return;
    }
    handleEdit(pricing);
  };

  const debouncedSearch = useDebouncedCallback(value => {
    setSearch(value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleDelete = (pricing: Pricing, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click from triggering
    setDeletePricing(pricing);
  };

  const confirmDelete = () => {
    if (deletePricing) {
      deletePricingMutation.mutate(deletePricing.id);
      setDeletePricing(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPricing(null);
  };

  const pricings = data?.results || [];

  if (error) {
    return (
      <Card className="border-none shadow-none">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pricing Plans</h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Pricing Plan
          </Button>
        </div>
        <CardContent>
          <p className="text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load pricing plans"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing Plans</h1>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Pricing Plan
        </Button>
      </div>

      <div className="mt-10 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 z-1 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search pricing plans..."
            value={searchInput}
            onChange={handleSearchChange}
            className="border-gray-200 bg-white pr-10 pl-10 placeholder:text-gray-500 focus:border-gray-300 focus:ring-0"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Card className="border-none shadow-none">
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="[&_tr]:!border-b-0">
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pricings.map(pricing => (
                      <TableRow
                        key={pricing.id}
                        className="cursor-pointer border-none transition-colors hover:bg-gray-50"
                        onClick={e => handleRowClick(pricing, e)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {pricing.name}
                            {pricing.is_popular && (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            Rs.{" "}
                            <span className="font-semibold">
                              {pricing.price}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              /mo
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[300px] truncate">
                          {pricing.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {pricing.features.length} features
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {pricing.is_popular ? (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Popular
                            </Badge>
                          ) : (
                            <Badge variant="outline">Standard</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className="flex items-center gap-x-2"
                            onClick={e => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => handleEdit(pricing)}
                              className="action-button"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={e => handleDelete(pricing, e)}
                              className="action-button text-destructive hover:text-destructive hover:bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pricings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <DollarSign className="mb-4 h-16 w-16 text-gray-300" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    No pricing plans found
                  </h3>
                  <p className="mb-6 max-w-sm text-gray-500">
                    Get started by creating your first pricing plan to showcase
                    your offerings
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pricing Plan
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <PricingForm pricing={editingPricing} onClose={handleCloseForm} />
      )}

      <AlertDialog
        open={!!deletePricing}
        onOpenChange={() => setDeletePricing(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete &apos;{deletePricing?.name}
              &apos; and all its features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
