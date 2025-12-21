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
import { SimplePagination } from "@/components/ui/simple-pagination";
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
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#003d79]">Subcategories</h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-black text-white hover:bg-black/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subcategory
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search subcategories..."
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
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-black/5">
                        <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                          Image
                        </TableHead>
                        <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                          Name
                        </TableHead>
                        <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                          Parent Category
                        </TableHead>
                        <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                          Description
                        </TableHead>
                        <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {subCategories.map(subCategory => {
                        const categoryName = getCategoryName(
                          subCategory.category
                        );

                        return (
                          <TableRow
                            key={subCategory.id}
                            className="group border-b border-black/5 transition-colors hover:bg-black/2"
                          >
                            <TableCell className="px-6 py-4">
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
                            <TableCell className="px-6 py-4">
                              <span className="text-sm font-normal text-black">
                                {subCategory.name}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              {categoryName ? (
                                <span className="rounded bg-black/5 px-2 py-1 text-[10px] font-normal text-black/60">
                                  {categoryName}
                                </span>
                              ) : (
                                <span className="text-xs text-black/20">—</span>
                              )}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="max-w-[300px] truncate text-xs text-black/50">
                                {subCategory.description}
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full text-black/40 hover:text-black/60"
                                  onClick={() => handleEdit(subCategory)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(subCategory)}
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
          </div>
        </div>

        {/* Results summary and Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-black/5 bg-white px-6 py-4">
            <div className="text-[10px] text-black/40">
              Showing {subCategories.length} results
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
