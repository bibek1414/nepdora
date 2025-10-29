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
import Pagination from "@/components/ui/pagination";
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
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promo Codes</h1>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Promo Code
        </Button>
      </div>

      <div className="mt-10 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 z-1 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search promo codes..."
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
                  <TableHeader className="[&_tr]:!border-b-0">
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
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
                          className="cursor-pointer border-none transition-colors hover:bg-gray-50"
                          onClick={e => handleRowClick(promoCode, e)}
                        >
                          <TableCell className="font-mono font-bold">
                            {promoCode.code}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="font-semibold">
                                {promoCode.discount_percentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDate(promoCode.valid_from)} -{" "}
                                {formatDate(promoCode.valid_to)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {promoCode.used_count}
                                {promoCode.max_uses
                                  ? ` / ${promoCode.max_uses}`
                                  : " / ∞"}
                              </span>
                              {promoCode.max_uses && (
                                <div className="ml-2 h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                                  <div
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${usagePercentage}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {expired ? (
                              <Badge variant="destructive">Expired</Badge>
                            ) : promoCode.is_active ? (
                              <Badge variant="default" className="bg-green-600">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell className="flex items-center gap-x-2">
                            <Button
                              variant="ghost"
                              onClick={() => handleEdit(promoCode)}
                              className="action-button"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleDelete(promoCode)}
                              className="action-button text-destructive hover:text-destructive hover:bg-transparent"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                            </Button>
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
        </CardContent>
      </Card>

      {/* Results summary and Pagination */}
      {!error && pagination && pagination.totalPages > 1 && (
        <div className="mt-6 space-y-4">
          {/* Results summary */}
          <div className="flex justify-center">
            <div className="text-muted-foreground text-sm">
              Showing {(pagination.page - 1) * pagination.page_size + 1} to{" "}
              {Math.min(
                pagination.page * pagination.page_size,
                pagination.total
              )}{" "}
              of {pagination.total} results
            </div>
          </div>

          {/* Pagination component */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={7}
          />
        </div>
      )}

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
