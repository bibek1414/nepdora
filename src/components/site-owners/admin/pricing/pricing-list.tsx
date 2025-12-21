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
import { SimplePagination } from "@/components/ui/simple-pagination";
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

import { RefreshCw } from "lucide-react";

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

  const handleDelete = (pricing: Pricing) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-black/20" />
            <p className="text-xs text-black/40">Loading pricing plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-black/5 p-3">
              <DollarSign className="h-8 w-8 text-black/20" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#003d79]">
                Pricing Plans
              </h1>
              <p className="text-xs text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Failed to load pricing plans"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">Pricing Plans</h1>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search pricing plans..."
              value={searchInput}
              onChange={handleSearchChange}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={() => setShowForm(true)}
            className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Pricing Plan
          </Button>
        </div>

        <div className="rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/5">
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Plan Name
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Price
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Description
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Features
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pricings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-black/40"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <DollarSign className="h-12 w-12 text-black/5" />
                      <p className="text-xs">No pricing plans found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pricings.map(pricing => (
                  <TableRow
                    key={pricing.id}
                    className="group border-b border-black/5 transition-colors hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2 text-black">
                        {pricing.name}
                        {pricing.is_popular && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-1 text-black">
                        <span className="text-[10px] font-normal text-black/40">
                          Rs.
                        </span>
                        <span className="text-sm font-normal">
                          {pricing.price}
                        </span>
                        <span className="text-[10px] text-black/40">/mo</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate px-6 py-4 text-xs text-black/50">
                      {pricing.description}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="rounded bg-black/5 px-2 py-1 text-[10px] font-normal text-black/60">
                        {pricing.features.length} features
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {pricing.is_popular ? (
                        <span className="rounded bg-yellow-400/10 px-2 py-1 text-[10px] font-semibold text-yellow-700">
                          Popular
                        </span>
                      ) : (
                        <span className="rounded border border-black/5 px-2 py-1 text-[10px] font-normal text-black/40">
                          Standard
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(pricing)}
                          className="h-8 w-8 rounded-full text-black/40 hover:text-black/60"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pricing)}
                          className="h-8 w-8 rounded-full text-black/40 hover:text-black/60"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

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
                className="bg-red-600 font-semibold text-white hover:bg-red-700"
              >
                {deletePricingMutation.isPending ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
