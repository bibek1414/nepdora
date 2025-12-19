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

import { TableWrapper, TableActionButtons } from "@/components/ui/custom-table";
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
      <div className="animate-in fade-in min-h-screen bg-white duration-700">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
            <p className="animate-pulse text-sm text-slate-400">
              Loading pricing plans...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in min-h-screen bg-white duration-700">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-red-50 p-3">
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Pricing Plans
              </h1>
              <p className="text-sm text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Failed to load pricing plans"}
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Pricing Plan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-700">
      <div className="mx-auto max-w-5xl space-y-4 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Pricing Plans
            </h1>
            <p className="text-sm text-slate-500">
              Manage your pricing plans and features.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Pricing Plan
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search pricing plans..."
              value={searchInput}
              onChange={handleSearchChange}
              className="h-9 border-slate-200 bg-white pr-10 pl-10 text-sm placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-900"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="px-6 py-4 font-semibold text-slate-700">
                  Plan Name
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-slate-700">
                  Price
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-slate-700">
                  Description
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-slate-700">
                  Features
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-slate-700">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pricings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <DollarSign className="h-12 w-12 text-slate-200" />
                      <p>
                        No pricing plans found. Click "Add Pricing Plan" to get
                        started.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pricings.map(pricing => (
                  <TableRow
                    key={pricing.id}
                    className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                  >
                    <TableCell className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2 text-slate-900">
                        {pricing.name}
                        {pricing.is_popular && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <span className="text-xs font-semibold">Rs.</span>
                        <span className="font-bold">{pricing.price}</span>
                        <span className="text-xs text-slate-400">/mo</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate px-6 py-4 text-sm text-slate-500">
                      {pricing.description}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className="rounded-md bg-slate-100 font-medium text-slate-600"
                      >
                        {pricing.features.length} features
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {pricing.is_popular ? (
                        <Badge className="bg-yellow-50 font-semibold text-yellow-700 hover:bg-yellow-100">
                          Popular
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-slate-200 font-medium text-slate-500"
                        >
                          Standard
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <TableActionButtons
                        onEdit={() => handleEdit(pricing)}
                        onDelete={() => handleDelete(pricing)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableWrapper>

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
