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
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
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
  useSuperAdminBlogCategories,
  useSuperAdminBlogTags,
  useCreateSuperAdminBlogCategory,
  useCreateSuperAdminBlogTag,
  useUpdateSuperAdminBlogCategory,
  useUpdateSuperAdminBlogTag,
  useDeleteSuperAdminBlogCategory,
  useDeleteSuperAdminBlogTag,
} from "@/hooks/super-admin/use-blogs";
import { toast } from "sonner";
import { BlogCategory, BlogTag } from "@/types/super-admin/blog";

export default function CategoryTagManagement() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Manage Categories & Tags
          </h2>
          <p className="text-muted-foreground">
            Create, edit, and delete blog categories and tags.
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="categories"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-6">
          <CategoriesManager />
        </TabsContent>
        <TabsContent value="tags" className="mt-6">
          <TagsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CategoriesManager() {
  const { data: categories, isLoading } = useSuperAdminBlogCategories();
  const createMutation = useCreateSuperAdminBlogCategory();
  const updateMutation = useUpdateSuperAdminBlogCategory();
  const deleteMutation = useDeleteSuperAdminBlogCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogCategory | null>(null);
  const [deletingItem, setDeletingItem] = useState<BlogCategory | null>(null);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate(
      { name: newName },
      {
        onSuccess: () => {
          toast.success("Category created successfully");
          setIsCreateOpen(false);
          setNewName("");
        },
        onError: () => toast.error("Failed to create category"),
      }
    );
  };

  const handleUpdate = () => {
    if (!editingItem || !newName.trim()) return;
    updateMutation.mutate(
      { slug: editingItem.slug, name: newName },
      {
        onSuccess: () => {
          toast.success("Category updated successfully");
          setEditingItem(null);
          setNewName("");
        },
        onError: () => toast.error("Failed to update category"),
      }
    );
  };

  const handleDelete = () => {
    if (!deletingItem) return;
    deleteMutation.mutate(deletingItem.slug, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        setDeletingItem(null);
      },
      onError: () => toast.error("Failed to delete category"),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your blog categories here.</CardDescription>
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
                Create a new category for your blog posts.
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
                className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
                disabled={createMutation.isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="divide-y rounded-md border-none">
          {categories?.map(category => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex-1 font-medium">{category.name}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingItem(category);
                    setNewName(category.name);
                  }}
                >
                  <Pencil className="text-muted-foreground h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingItem(category)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          {categories?.length === 0 && (
            <div className="text-muted-foreground p-4 text-center text-sm">
              No categories found.
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingItem}
        onOpenChange={open => !open && setEditingItem(null)}
      >
        <DialogContent>
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
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
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
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function TagsManager() {
  const { data: tags, isLoading } = useSuperAdminBlogTags();
  const createMutation = useCreateSuperAdminBlogTag();
  const updateMutation = useUpdateSuperAdminBlogTag();
  const deleteMutation = useDeleteSuperAdminBlogTag();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogTag | null>(null);
  const [deletingItem, setDeletingItem] = useState<BlogTag | null>(null);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate(
      { name: newName },
      {
        onSuccess: () => {
          toast.success("Tag created successfully");
          setIsCreateOpen(false);
          setNewName("");
        },
        onError: () => toast.error("Failed to create tag"),
      }
    );
  };

  const handleUpdate = () => {
    if (!editingItem || !newName.trim()) return;
    updateMutation.mutate(
      { slug: editingItem.slug, name: newName },
      {
        onSuccess: () => {
          toast.success("Tag updated successfully");
          setEditingItem(null);
          setNewName("");
        },
        onError: () => toast.error("Failed to update tag"),
      }
    );
  };

  const handleDelete = () => {
    if (!deletingItem) return;
    deleteMutation.mutate(deletingItem.slug, {
      onSuccess: () => {
        toast.success("Tag deleted successfully");
        setDeletingItem(null);
      },
      onError: () => toast.error("Failed to delete tag"),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Manage your blog tags here.</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tag</DialogTitle>
              <DialogDescription>
                Create a new tag for your blog posts.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Tag Name"
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
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="divide-y rounded-md border-none">
          {tags?.map(tag => (
            <div key={tag.id} className="flex items-center justify-between p-4">
              <div className="flex-1 font-medium">{tag.name}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingItem(tag);
                    setNewName(tag.name);
                  }}
                >
                  <Pencil className="text-muted-foreground h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingItem(tag)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          {tags?.length === 0 && (
            <div className="text-muted-foreground p-4 text-center text-sm">
              No tags found.
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingItem}
        onOpenChange={open => !open && setEditingItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Tag Name"
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
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!deletingItem}
        onOpenChange={open => !open && setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tag
              "{deletingItem?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
