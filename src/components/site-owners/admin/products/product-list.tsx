"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useProducts,
  useDeleteProduct,
} from "@/hooks/owner-site/admin/use-product";
import { SimplePagination } from "@/components/ui/simple-pagination";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ImageIcon,
  X,
  Gift,
  Folder,
  FolderTree,
  Upload,
} from "lucide-react";
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
import { useDebouncedCallback } from "use-debounce";
import { Product } from "@/types/owner-site/admin/product";
import { toast } from "sonner";
import BulkUploadDialog from "@/components/site-owners/admin/bulk-upload/bulk-upload-dialog";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [page_size, setpage_size] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useDebouncedCallback(value => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
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

  const { data, isLoading, error } = useProducts({
    page,
    page_size,
    search,
    sortBy: sortBy || undefined,
  });

  const deleteProductMutation = useDeleteProduct();

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
  };

  const confirmDelete = async () => {
    if (deleteProduct && deleteProduct.slug) {
      try {
        await deleteProductMutation.mutateAsync(deleteProduct.slug);
        toast.success("Product deleted successfully");
        setDeleteProduct(null);
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("Delete error:", error);
      }
    } else if (deleteProduct) {
      console.error("Product slug is null");
      toast.error("Cannot delete product: missing slug");
      setDeleteProduct(null);
    }
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const pagination = data?.pagination;
  const products = data?.results || [];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Failed to load products"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-[#003d79]">Products</h1>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/promo-code">
              <Button
                variant="ghost"
                className="h-9 px-3 text-xs font-normal text-black/60 hover:bg-black/2 hover:text-black"
              >
                <Gift className="mr-2 h-4 w-4" />
                Promo Codes
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button
                variant="ghost"
                className="h-9 px-3 text-xs font-normal text-black/60 hover:bg-black/2 hover:text-black"
              >
                <Folder className="mr-2 h-4 w-4" />
                Categories
              </Button>
            </Link>
            <Link href="/admin/subcategories">
              <Button
                variant="ghost"
                className="h-9 px-3 text-xs font-normal text-black/60 hover:bg-black/2 hover:text-black"
              >
                <FolderTree className="mr-2 h-4 w-4" />
                Subcategories
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => setShowBulkUploadDialog(true)}
              className="h-9 px-3 text-xs font-normal text-black/60 hover:bg-black/2 hover:text-black"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Link href="/admin/products/add">
              <Button className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search products..."
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
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(page_size)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-black/5">
                    <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                      Image
                    </TableHead>
                    <TableHead
                      className="cursor-pointer px-6 py-3 text-xs font-normal text-black/60 transition-colors hover:text-black"
                      onClick={() => handleSortChange("name")}
                    >
                      Name{" "}
                      {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer px-6 py-3 text-xs font-normal text-black/60 transition-colors hover:text-black"
                      onClick={() => handleSortChange("price")}
                    >
                      Price{" "}
                      {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer px-6 py-3 text-xs font-normal text-black/60 transition-colors hover:text-black"
                      onClick={() => handleSortChange("stock")}
                    >
                      Stock{" "}
                      {sortBy === "stock" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                      Category
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
                  {products.map(product => (
                    <TableRow
                      key={product.id}
                      className="group border-b border-black/5 transition-colors hover:bg-black/2"
                      onClick={() =>
                        (window.location.href = `/admin/products/edit/${product.slug}`)
                      }
                    >
                      <TableCell className="px-6 py-4">
                        {product.thumbnail_image ? (
                          <Image
                            src={product.thumbnail_image}
                            alt={
                              product.thumbnail_alt_description || product.name
                            }
                            width={48}
                            height={48}
                            className="rounded-lg border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          NPR {product.price}
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            product.stock > 0 ? "text-gray-900" : "text-red-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        {product.category && (
                          <span className="rounded bg-black/5 px-2 py-1 text-[10px] font-normal text-black/60">
                            {product.category.name}
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        {product.stock > 0 ? (
                          <span className="rounded bg-green-400/10 px-2 py-1 text-[10px] font-semibold text-green-700">
                            In Stock
                          </span>
                        ) : (
                          <span className="rounded bg-red-400/10 px-2 py-1 text-[10px] font-semibold text-red-700">
                            Out of Stock
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-black/40 hover:text-black/60"
                            onClick={e => {
                              e.stopPropagation();
                              window.location.href = `/admin/products/edit/${product.slug}`;
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={e => {
                              e.stopPropagation();
                              handleDelete(product);
                            }}
                            className="h-8 w-8 rounded-full text-black/40 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <SimplePagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={showBulkUploadDialog}
        onOpenChange={setShowBulkUploadDialog}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product &apos;{deleteProduct?.name}&apos; from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { ProductList };
