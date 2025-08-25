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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useDeleteCategory } from "@/hooks/use-category";
import { CategoryForm } from "./category-form";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  ImageOff,
  ChevronLeft,
  ChevronRight,
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

  const pagination = data?.pagination;
  const categories = data?.results || [];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load categories"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
          <CardDescription>
            {pagination
              ? `Page ${pagination.page} of ${pagination.totalPages}`
              : "Loading categories..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(limit)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map(category => (
                      <TableRow key={category.id}>
                        <TableCell>
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
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
                          {category.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[400px] truncate">
                          {category.description}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(category)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                    Showing {categories.length} of {pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <CategoryForm category={editingCategory} onClose={handleCloseForm} />
      )}

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
