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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSubCategories,
  useDeleteSubCategory,
} from "@/hooks/use-subcategory";
import { SubCategoryForm } from "./sub-category-form";
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
import { SubCategory } from "@/types/owner-site/product";

export const SubCategoryList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [deleteSubCategory, setDeleteSubCategory] =
    useState<SubCategory | null>(null);

  const { data, isLoading, error } = useSubCategories({ page, limit });
  const deleteSubCategoryMutation = useDeleteSubCategory();

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setShowForm(true);
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
        <CardContent className="p-6">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subcategories</h1>
          <p className="text-muted-foreground">Manage your subcategories</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subcategory
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subcategory List</CardTitle>
          <CardDescription>
            {pagination
              ? `Page ${pagination.page} of ${pagination.totalPages}`
              : "Loading subcategories..."}
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
                      <TableHead>Parent Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subCategories.map(subCategory => {
                      const categoryName = getCategoryName(
                        subCategory.category
                      );

                      return (
                        <TableRow key={subCategory.id}>
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
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(subCategory)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(subCategory)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">
                    Showing {subCategories.length} of {pagination.total} results
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
