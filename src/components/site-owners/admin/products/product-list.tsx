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
import Pagination from "@/components/ui/pagination";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ImageIcon,
  X,
  Folder,
  FolderTree,
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

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [page_size, setpage_size] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState("");
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
    <div className="">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-end gap-3">
          <Link href="/admin/categories">
            <Button
              variant="outline"
              className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
            >
              <Folder className="mr-2 h-4 w-4" />
              Manage Category
            </Button>
          </Link>

          <Link href="/admin/subcategories">
            <Button
              variant="outline"
              className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
            >
              <FolderTree className="mr-2 h-4 w-4" />
              Manage Subcategory
            </Button>
          </Link>

          <Link href="/admin/products/add">
            <Button className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mt-10 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 z-1 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search subcategories..."
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

        {/* Products Card */}
        <Card className="overflow-hidden rounded-lg border-none bg-white shadow-none">
          <CardContent className="p-0">
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
                    <TableRow className="border-b border-gray-100 bg-gray-50/50">
                      <TableHead className="px-6 py-4 text-sm font-medium text-gray-700">
                        Image
                      </TableHead>
                      <TableHead
                        className="cursor-pointer px-6 py-4 text-sm font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => handleSortChange("name")}
                      >
                        Name{" "}
                        {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer px-6 py-4 text-sm font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => handleSortChange("price")}
                      >
                        Price{" "}
                        {sortBy === "price" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer px-6 py-4 text-sm font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => handleSortChange("stock")}
                      >
                        Stock{" "}
                        {sortBy === "stock" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-6 py-4 text-sm font-medium text-gray-700">
                        Category
                      </TableHead>
                      <TableHead className="px-6 py-4 text-sm font-medium text-gray-700">
                        Status
                      </TableHead>
                      <TableHead className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow
                        key={product.id}
                        className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                        onClick={() =>
                          (window.location.href = `/admin/products/edit/${product.slug}`)
                        }
                      >
                        <TableCell className="px-6 py-4">
                          {product.thumbnail_image ? (
                            <Image
                              src={product.thumbnail_image}
                              alt={
                                product.thumbnail_alt_description ||
                                product.name
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
                              product.stock > 0
                                ? "text-gray-900"
                                : "text-red-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          {product.category && (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              {product.category.name}
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <Badge
                            variant={
                              product.stock > 0 ? "default" : "destructive"
                            }
                            className={
                              product.stock > 0
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={e => {
                                e.stopPropagation();
                                window.open(
                                  `/admin/products/edit/${product.slug}`,
                                  "_self"
                                );
                              }}
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                              <span className="sr-only">Edit product</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                handleDelete(product);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete product</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Empty State */}
                {products.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      No products found
                    </h3>
                    <p className="mb-6 max-w-sm text-gray-500">
                      {search
                        ? "Try adjusting your search terms to find what you're looking for"
                        : "Get started by adding your first product to the inventory"}
                    </p>
                    <Button
                      asChild
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Link href="/admin/products/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Results summary and Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 space-y-4">
            {/* Results summary */}
            <div className="flex justify-center">
              <div className="text-sm text-gray-700">
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
      </div>

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
