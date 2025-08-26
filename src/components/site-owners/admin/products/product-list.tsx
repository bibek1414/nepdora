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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useDeleteProduct } from "@/hooks/use-product";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  Eye,
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
import { Product } from "@/types/owner-site/product";
import { toast } from "sonner";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useDebouncedCallback(value => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  }, 500);

  const { data, isLoading, error } = useProducts({
    page,
    limit,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-none">
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                onChange={e => debouncedSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={sortBy}
                onValueChange={value => {
                  setSortBy(value === "none" ? "" : value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No sorting</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="created_at">Date Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(limit)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleSortChange("name")}
                      >
                        Name{" "}
                        {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleSortChange("price")}
                      >
                        Price{" "}
                        {sortBy === "price" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleSortChange("stock")}
                      >
                        Stock{" "}
                        {sortBy === "stock" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.thumbnail_image ? (
                            <Image
                              src={product.thumbnail_image}
                              alt={
                                product.thumbnail_alt_description ||
                                product.name
                              }
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <div className="bg-muted flex h-[60px] w-[60px] items-center justify-center rounded-md">
                              <ImageIcon className="text-muted-foreground h-6 w-6" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {product.name}
                          </div>
                        </TableCell>

                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div>NPR {product.price}</div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={
                              product.stock > 0
                                ? ""
                                : "text-destructive font-medium"
                            }
                          >
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {product.category && (
                              <Badge variant="outline" className="text-xs">
                                {product.category.name}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.stock > 0 ? "default" : "destructive"
                            }
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8 w-8 p-0"
                            >
                              <Link
                                href={`/admin/products/edit/${product.slug}`}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit product</span>
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete product</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(1)}
                      disabled={!pagination.hasPrevious}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(pagination.totalPages)}
                      disabled={!pagination.hasNext}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted mb-4 rounded-full p-4">
                    <Plus className="text-muted-foreground h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    {search
                      ? "Try adjusting your search terms"
                      : "Get started by adding your first product"}
                  </p>
                  <Button asChild>
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
              product &quot;{deleteProduct?.name}&quot; from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
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
