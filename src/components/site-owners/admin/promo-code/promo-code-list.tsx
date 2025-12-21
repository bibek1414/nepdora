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
  usePromoCodes,
  useDeletePromoCode,
} from "@/hooks/owner-site/admin/use-promocode";
import { PromoCodeForm } from "./promo-code-form";
import { SimplePagination } from "@/components/ui/simple-pagination";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Calendar,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
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
import { PromoCode } from "@/types/owner-site/admin/promo-code";
import { useDebouncedCallback } from "use-debounce";
import { format } from "date-fns";

export const PromoCodeList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [page_size] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(
    null
  );
  const [deletePromoCode, setDeletePromoCode] = useState<PromoCode | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error } = usePromoCodes({
    page,
    page_size,
    search,
  });
  const deletePromoCodeMutation = useDeletePromoCode();

  const handleEdit = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    setShowForm(true);
  };

  const debouncedSearch = useDebouncedCallback(value => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const handleDelete = (promoCode: PromoCode) => {
    setDeletePromoCode(promoCode);
  };

  const confirmDelete = () => {
    if (deletePromoCode) {
      deletePromoCodeMutation.mutate(deletePromoCode.id);
      setDeletePromoCode(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPromoCode(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const isExpired = (validTo: string) => {
    return new Date(validTo) < new Date();
  };

  // Prevent row click when clicking on action buttons
  const handleRowClick = (promoCode: PromoCode, e: React.MouseEvent) => {
    // Check if the click originated from an action button
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest(".action-button") ||
      target.tagName === "BUTTON"
    ) {
      return;
    }
    handleEdit(promoCode);
  };

  const pagination = data?.pagination;
  const promoCodes = data?.results || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#003d79]">Promo Codes</h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-black text-white hover:bg-black/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Promo Code
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search promo codes..."
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
        </div>

        <div className="rounded-lg bg-white">
          <div className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-6">
                {[...Array(page_size)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Failed to load promo codes
                </h3>
                <p className="mb-6 max-w-sm text-red-600">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-black/5">
                        <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                          Code
                        </TableHead>
                        <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                          Discount
                        </TableHead>
                        <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                          Valid Period
                        </TableHead>
                        <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                          Usage
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
                      {promoCodes.map(promoCode => {
                        const expired = isExpired(promoCode.valid_to);
                        const usagePercentage = promoCode.max_uses
                          ? (promoCode.used_count / promoCode.max_uses) * 100
                          : 0;

                        return (
                          <TableRow
                            key={promoCode.id}
                            className="group border-b border-black/5 transition-colors hover:bg-black/2"
                            onClick={e => handleRowClick(promoCode, e)}
                          >
                            <TableCell className="px-6 py-4">
                              <span className="text-sm font-bold text-[#003d79]">
                                {promoCode.code}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-black">
                                  {promoCode.discount_percentage}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-1 text-[10px] text-black/40">
                                <span>
                                  {formatDate(promoCode.valid_from)} -{" "}
                                  {formatDate(promoCode.valid_to)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-black/60">
                                  {promoCode.used_count}
                                  {promoCode.max_uses
                                    ? ` / ${promoCode.max_uses}`
                                    : " / ∞"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              {expired ? (
                                <span className="rounded bg-red-400/10 px-2 py-1 text-[10px] font-semibold text-red-700">
                                  Expired
                                </span>
                              ) : promoCode.is_active ? (
                                <span className="rounded bg-green-400/10 px-2 py-1 text-[10px] font-semibold text-green-700">
                                  Active
                                </span>
                              ) : (
                                <span className="rounded bg-black/5 px-2 py-1 text-[10px] font-semibold text-black/60">
                                  Inactive
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full text-black/40 hover:text-black/60"
                                  onClick={() => handleEdit(promoCode)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(promoCode)}
                                  className="h-8 w-8 rounded-full text-black/40 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Empty State */}
                {promoCodes.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      No promo codes found
                    </h3>
                    <p className="mb-6 max-w-sm text-gray-500">
                      Get started by creating your first promo code to offer
                      discounts to your customers
                    </p>
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Promo Code
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Results summary and Pagination */}
        {!error && pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-black/5 bg-white px-6 py-4">
            <div className="text-[10px] text-black/40">
              Showing {promoCodes.length} results
            </div>
            <SimplePagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {showForm && (
        <PromoCodeForm promoCode={editingPromoCode} onClose={handleCloseForm} />
      )}

      <AlertDialog
        open={!!deletePromoCode}
        onOpenChange={() => setDeletePromoCode(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the promo code &apos;
              {deletePromoCode?.code}&apos;. This cannot be undone.
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
