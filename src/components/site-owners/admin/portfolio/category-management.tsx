"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  usePortfolioCategories,
  useCreatePortfolioCategory,
  useUpdatePortfolioCategory,
  useDeletePortfolioCategory,
} from "@/hooks/owner-site/admin/use-portfolio";
import CategoryTable from "@/components/site-owners/admin/portfolio/category-table";
import CategoryDialog from "@/components/site-owners/admin/portfolio/category-dialog";
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
import { PortfolioCategory } from "@/types/owner-site/admin/portfolio";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CategoryManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<PortfolioCategory | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    category: PortfolioCategory | null;
  }>({ isOpen: false, category: null });

  const { data: categories = [], isLoading } = usePortfolioCategories();

  const createMutation = useCreatePortfolioCategory();
  const updateMutation = useUpdatePortfolioCategory();
  const deleteMutation = useDeletePortfolioCategory();

  const handleCreateNew = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: PortfolioCategory) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: PortfolioCategory) => {
    setDeleteDialog({ isOpen: true, category });
  };

  const handleDialogSubmit = (data: { name: string }) => {
    if (selectedCategory) {
      updateMutation.mutate(
        { id: selectedCategory.id, categoryData: data },
        {
          onSuccess: () => {
            toast.success("Category updated successfully");
            setIsDialogOpen(false);
          },
          onError: () => {
            toast.error("Failed to update category");
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Category created successfully");
          setIsDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to create category");
        },
      });
    }
  };

  const confirmDelete = () => {
    if (!deleteDialog.category) return;

    deleteMutation.mutate(
      { id: deleteDialog.category.id },
      {
        onSuccess: () => {
          toast.success("Category deleted successfully");
          setDeleteDialog({ isOpen: false, category: null });
        },
        onError: () => {
          toast.error("Failed to delete category");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-6">
          <Link
            href="/admin/portfolio"
            className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolios
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#003d79]">
              Manage Categories
            </h1>
            <Button
              onClick={handleCreateNew}
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        <CategoryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleDialogSubmit}
          category={selectedCategory}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        <AlertDialog
          open={deleteDialog.isOpen}
          onOpenChange={open =>
            !open && setDeleteDialog({ isOpen: false, category: null })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete category &quot;
                {deleteDialog.category?.name}&quot;? This action cannot be
                undone and may affect projects using this category.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CategoryManagement;
