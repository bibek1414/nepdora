"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTemplateCategories,
  useTemplateSubcategories,
  useCreateTemplateCategory,
  useUpdateTemplateCategory,
  useDeleteTemplateCategory,
  useCreateTemplateSubcategory,
  useUpdateTemplateSubcategory,
  useDeleteTemplateSubcategory,
} from "@/hooks/super-admin/components/use-template-category";
import { toast } from "sonner";
import {
  TemplateCategory,
  TemplateSubcategory,
} from "@/types/super-admin/components/template-category";

interface TemplateCategoryManagementProps {
  initialTab?: string;
}

export default function TemplateCategoryManagement({
  initialTab = "categories",
}: TemplateCategoryManagementProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Link
              href="/superadmin/template"
              className="flex items-center text-sm text-gray-500 hover:text-gray-900"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
            </Link>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Template Categories & Subcategories
          </h2>
          <p className="text-muted-foreground">
            Manage how templates are organized into categories and
            subcategories.
          </p>
        </div>
      </div>

      <Tabs
        defaultValue={initialTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="categories" className="cursor-pointer">
            Categories
          </TabsTrigger>
          <TabsTrigger value="subcategories" className="cursor-pointer">
            Subcategories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-6 cursor-pointer">
          <CategoriesManager />
        </TabsContent>
        <TabsContent value="subcategories" className="mt-6">
          <SubcategoriesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CategoriesManager() {
  const { data: categories, isLoading } = useTemplateCategories();
  const createMutation = useCreateTemplateCategory();
  const updateMutation = useUpdateTemplateCategory();
  const deleteMutation = useDeleteTemplateCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TemplateCategory | null>(null);
  const [deletingItem, setDeletingItem] = useState<TemplateCategory | null>(
    null
  );
  const [newName, setNewName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createMutation.mutateAsync({ name: newName });
      toast.success("Category created successfully");
      setIsCreateOpen(false);
      setNewName("");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !newName.trim()) return;
    try {
      await updateMutation.mutateAsync({
        slug: editingItem.slug,
        name: newName,
      });
      toast.success("Category updated successfully");
      setEditingItem(null);
      setNewName("");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMutation.mutateAsync(deletingItem.slug);
      toast.success("Category deleted successfully");
      setDeletingItem(null);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage template categories.</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[400px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Create a new category for templates.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Category Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="divide-y rounded-md border">
          {categories?.map(category => (
            <div
              key={category.id}
              className="flex items-center justify-between bg-white p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex-1 font-medium text-gray-900">
                {category.name}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-blue-600"
                  onClick={() => {
                    setEditingItem(category);
                    setNewName(category.name);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600"
                  onClick={() => setDeletingItem(category)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {categories?.length === 0 && (
            <div className="text-muted-foreground p-8 text-center text-sm">
              No categories found.
            </div>
          )}
        </div>
      </CardContent>

      <Dialog
        open={!!editingItem}
        onOpenChange={open => !open && setEditingItem(null)}
      >
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingItem}
        onOpenChange={open => !open && setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category "{deletingItem?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function SubcategoriesManager() {
  const { data: categories } = useTemplateCategories();
  const { data: subcategories, isLoading } = useTemplateSubcategories();
  const createMutation = useCreateTemplateSubcategory();
  const updateMutation = useUpdateTemplateSubcategory();
  const deleteMutation = useDeleteTemplateSubcategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TemplateSubcategory | null>(
    null
  );
  const [deletingItem, setDeletingItem] = useState<TemplateSubcategory | null>(
    null
  );
  const [newName, setNewName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const handleCreate = async () => {
    if (!newName.trim() || !selectedCategoryId) return;
    try {
      await createMutation.mutateAsync({
        name: newName,
        category_id: Number(selectedCategoryId),
      });
      toast.success("Subcategory created successfully");
      setIsCreateOpen(false);
      setNewName("");
      setSelectedCategoryId("");
    } catch (error) {
      toast.error("Failed to create subcategory");
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !newName.trim()) return;
    try {
      await updateMutation.mutateAsync({
        slug: editingItem.slug,
        name: newName,
        category_id: selectedCategoryId
          ? Number(selectedCategoryId)
          : undefined,
      });
      toast.success("Subcategory updated successfully");
      setEditingItem(null);
      setNewName("");
      setSelectedCategoryId("");
    } catch (error) {
      toast.error("Failed to update subcategory");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMutation.mutateAsync(deletingItem.slug);
      toast.success("Subcategory deleted successfully");
      setDeletingItem(null);
    } catch (error) {
      toast.error("Failed to delete subcategory");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subcategories</CardTitle>
          <CardDescription>Manage template subcategories.</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Subcategory
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[400px]">
            <DialogHeader>
              <DialogTitle>Add Subcategory</DialogTitle>
              <DialogDescription>
                Create a new subcategory for templates.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subcategory Name</label>
                <Input
                  placeholder="Subcategory Name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || !selectedCategoryId}
                className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="divide-y rounded-md border">
          {subcategories?.map(sub => {
            const categoryObj =
              typeof sub.category === "object" ? sub.category : null;
            const categoryId =
              typeof sub.category === "number" ? sub.category : sub.category.id;
            const category =
              categoryObj || categories?.find(c => c.id === categoryId);

            return (
              <div
                key={sub.id}
                className="flex items-center justify-between bg-white p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{sub.name}</div>
                  <div className="text-xs text-gray-500">
                    Category: {category?.name || "Unknown"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                    onClick={() => {
                      setEditingItem(sub);
                      setNewName(sub.name);
                      const catId =
                        typeof sub.category === "object"
                          ? sub.category.id
                          : sub.category;
                      setSelectedCategoryId(catId.toString());
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                    onClick={() => setDeletingItem(sub)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          {subcategories?.length === 0 && (
            <div className="text-muted-foreground p-8 text-center text-sm">
              No subcategories found.
            </div>
          )}
        </div>
      </CardContent>

      <Dialog
        open={!!editingItem}
        onOpenChange={open => !open && setEditingItem(null)}
      >
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subcategory Name</label>
              <Input
                placeholder="Subcategory Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingItem}
        onOpenChange={open => !open && setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subcategory "{deletingItem?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
