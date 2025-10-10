"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSubCategories,
  useDeleteSubCategory,
} from "@/hooks/owner-site/admin/use-subcategory";
import { SubCategoryForm } from "./sub-category-form";
import Pagination from "@/components/ui/pagination";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  ImageOff,
  Search,
  X,
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
import { SubCategory } from "@/types/owner-site/admin/product";
import { useDebouncedCallback } from "use-debounce";
export const SubCategoryList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [page_size] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [deleteSubCategory, setDeleteSubCategory] =
    useState<SubCategory | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading, error } = useSubCategories({
    page,
    page_size,
    search,
  });
  const deleteSubCategoryMutation = useDeleteSubCategory();

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setShowForm(true);
  };
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
  const handleDelete = (subCategory: SubCategory) => {
    setDeleteSubCategory(subCategory);
  };

  const confirmDelete = () => {
    if (deleteSubCategory) {
      deleteSubCategoryMutation.mutate(deleteSubCategory.slug);
      setDeleteSubCategory(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSubCategory(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Helper function to get category name from either string or object
  const getCategoryName = (
    category: string | { name: string } | null | undefined
  ): string | null => {
    if (!category) return null;
    if (typeof category === "string") return category;
    return category.name;
  };

  const pagination = data?.pagination;
  const subCategories = data?.results || [];

  if (error) {
    return (
      <Card>
        <CardContent>
          <p className="text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load subcategories"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subcategories</h1>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subcategory
        </Button>
      </div>
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
      <Card className="border-none shadow-none">
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(page_size)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="[&_tr]:!border-b-0">
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Parent Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {subCategories.map(subCategory => {
                      const categoryName = getCategoryName(
                        subCategory.category
                      );

                      return (
                        <TableRow key={subCategory.id} className="border-none">
                          <TableCell>
                            {subCategory.image ? (
                              <Image
                                src={subCategory.image}
                                alt={subCategory.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            ) : (
                              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-md">
                                <ImageOff className="text-muted-foreground h-6 w-6" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {subCategory.name}
                          </TableCell>
                          <TableCell>
                            {categoryName ? (
                              <Badge variant="secondary">{categoryName}</Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[300px] truncate">
                            {subCategory.description}
                          </TableCell>
                          <TableCell className="flex items-center gap-x-2">
                            <Button
                              variant="ghost"
                              onClick={() => handleEdit(subCategory)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleDelete(subCategory)}
                              className="text-destructive hover:text-destructive hover:bg-transparent"
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
              {subCategories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    No subcategories found
                  </h3>
                  <p className="mb-6 max-w-sm text-gray-500">
                    Get started by creating your first subcategory to further
                    organize your products
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subcategory
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
        <SubCategoryForm
          subCategory={editingSubCategory}
          onClose={handleCloseForm}
        />
      )}

      <AlertDialog
        open={!!deleteSubCategory}
        onOpenChange={() => setDeleteSubCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete &apos;
              {deleteSubCategory?.name}&apos;.
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
