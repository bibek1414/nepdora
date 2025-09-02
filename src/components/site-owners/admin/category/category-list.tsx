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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCategories,
  useDeleteCategory,
} from "@/hooks/owner-site/use-category";
import { CategoryForm } from "./category-form";
import Pagination from "@/components/ui/pagination";
import { MoreHorizontal, Plus, Edit, Trash2, ImageOff } from "lucide-react";
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
import { Category } from "@/types/owner-site/product";

export const CategoryList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const { data, isLoading, error } = useCategories({
    page,
    limit,
  });

  const deleteCategoryMutation = useDeleteCategory();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category: Category) => {
    setDeleteCategory(category);
  };

  const confirmDelete = () => {
    if (deleteCategory) {
      deleteCategoryMutation.mutate(deleteCategory.slug);
      setDeleteCategory(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const pagination = data?.pagination;
  const categories = data?.results || [];

  if (error) {
    return (
      <div className="">
        <div className="mx-auto">
          <Card className="rounded-lg border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <p className="text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Failed to load categories"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Categories Card */}
        <Card className="overflow-hidden rounded-lg shadow-none border-none bg-white">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[...Array(limit)].map((_, i) => (
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
                      <TableHead className="px-6 py-4 text-sm font-medium text-gray-700">
                        Name
                      </TableHead>
                      <TableHead className="px-6 py-4 text-sm font-medium text-gray-700">
                        Description
                      </TableHead>
                      <TableHead className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category, index) => (
                      <TableRow
                        key={category.id}
                        className="border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                      >
                        <TableCell className="px-6 py-4">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                              <ImageOff className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {category.name}
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="max-w-md truncate text-gray-600">
                            {category.description}
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={e => {
                                e.stopPropagation();
                                handleEdit(category);
                              }}
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                              <span className="sr-only">Edit category</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                handleDelete(category);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete category</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Empty State */}
                {categories.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      No categories found
                    </h3>
                    <p className="mb-6 max-w-sm text-gray-500">
                      Get started by creating your first category to organize
                      your products
                    </p>
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
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
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
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

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm category={editingCategory} onClose={handleCloseForm} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteCategory}
        onOpenChange={() => setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category &apos;{deleteCategory?.name}&apos;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
