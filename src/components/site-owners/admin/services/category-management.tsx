"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useServiceCategories,
  useCreateServiceCategory,
  useUpdateServiceCategory,
  useDeleteServiceCategory,
} from "@/hooks/owner-site/admin/use-services";
import {
  ServiceCategory,
  ServicesFilters,
} from "@/types/owner-site/admin/services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { SimplePagination } from "@/components/ui/simple-pagination";

const CategoryManagement = () => {
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    pageSize: 10,
  });

  const queryFilters = useMemo(() => {
    const qf: ServicesFilters = {
      page: filters.page,
      search: filters.search,
      page_size: filters.pageSize,
    };
    return qf;
  }, [filters]);

  const { data: categoryData, isLoading } = useServiceCategories(queryFilters);
  const createMutation = useCreateServiceCategory();
  const updateMutation = useUpdateServiceCategory();
  const deleteMutation = useDeleteServiceCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ServiceCategory | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail_image_alt_description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      thumbnail_image_alt_description: "",
    });
    setSelectedFile(null);
    setEditingCategory(null);
  };

  const handleEdit = (category: ServiceCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      thumbnail_image_alt_description:
        category.thumbnail_image_alt_description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category: ServiceCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    const payload: any = {
      ...formData,
      thumbnail_image: selectedFile,
    };

    if (editingCategory) {
      updateMutation.mutate(
        { slug: editingCategory.slug, categoryData: payload },
        {
          onSuccess: () => {
            toast.success("Category updated successfully");
            setIsModalOpen(false);
            resetForm();
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to update category");
          },
        }
      );
    } else {
      createMutation.mutate(
        { categoryData: payload },
        {
          onSuccess: () => {
            toast.success("Category created successfully");
            setIsModalOpen(false);
            resetForm();
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to create category");
          },
        }
      );
    }
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(
        { slug: categoryToDelete.slug },
        {
          onSuccess: () => {
            toast.success("Category deleted successfully");
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to delete category");
          },
        }
      );
    }
  };

  const categories = categoryData?.results || [];
  const totalPages = Math.ceil((categoryData?.count || 0) / filters.pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search categories..."
            value={filters.search}
            onChange={e =>
              setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))
            }
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-slate-900 text-white hover:bg-slate-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    <span className="ml-2 text-slate-500">
                      Loading categories...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-slate-500"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="h-10 w-10 overflow-hidden rounded-md border bg-slate-100">
                      {category.thumbnail_image ? (
                        <Image
                          src={category.thumbnail_image}
                          alt={
                            category.thumbnail_image_alt_description ||
                            category.name
                          }
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-400">
                          IMG
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {category.name}
                  </TableCell>
                  <TableCell className="hidden max-w-md truncate text-slate-500 md:table-cell">
                    {category.description || "No description"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                        className="h-8 w-8 text-slate-600 hover:text-slate-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalPages > 1 && (
        <SimplePagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={page => setFilters(prev => ({ ...prev, page }))}
        />
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the details of your service category."
                : "Create a new category to organize your services."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Category name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Category description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Thumbnail Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                />
                {editingCategory &&
                  editingCategory.thumbnail_image &&
                  !selectedFile && (
                    <div className="mt-1">
                      <p className="mb-1 text-[10px] text-slate-500">
                        Current:
                      </p>
                      <Image
                        src={editingCategory.thumbnail_image}
                        alt="Current thumbnail"
                        width={60}
                        height={60}
                        className="rounded border object-cover"
                      />
                    </div>
                  )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alt">Image Alt Description</Label>
                <Input
                  id="alt"
                  value={formData.thumbnail_image_alt_description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      thumbnail_image_alt_description: e.target.value,
                    }))
                  }
                  placeholder="SEO description for image"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-slate-900 text-white hover:bg-slate-800"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;
              {categoryToDelete?.name}
              &quot;. This action cannot be undone.
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
  );
};

export default CategoryManagement;
