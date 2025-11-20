"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { useUpdateTemplate } from "@/hooks/super-admin/components/use-templates";
import {
  useTemplateCategories,
  useTemplateSubcategories,
  useCreateTemplateCategory,
  useCreateTemplateSubcategory,
} from "@/hooks/super-admin/components/use-template-category";
import { toast } from "sonner";
import { Template } from "@/types/super-admin/components/template";

interface EditTemplateFormProps {
  template: Template;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditTemplateForm({
  template,
  onSuccess,
  onCancel,
}: EditTemplateFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    template.template_image || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    template.template_category?.id || null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    template.template_subcategory?.id || null
  );

  // Category creation dialog state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Subcategory creation dialog state
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const updateTemplateMutation = useUpdateTemplate();
  const { data: categories, isLoading: isLoadingCategories } =
    useTemplateCategories();
  const { data: subcategories, isLoading: isLoadingSubcategories } =
    useTemplateSubcategories(selectedCategory || undefined);
  const createCategory = useCreateTemplateCategory();
  const createSubcategory = useCreateTemplateSubcategory();

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory !== template.template_category?.id) {
      setSelectedSubcategory(null);
    }
  }, [selectedCategory, template.template_category?.id]);
  useEffect(() => {
    if (template.template_subcategory?.id && template.template_category?.id) {
      setSelectedCategory(template.template_category.id);
      setSelectedSubcategory(template.template_subcategory.id);
    }
  }, [template.template_category?.id, template.template_subcategory?.id]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(template.template_image || "");
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const newCategory = await createCategory.mutateAsync({
        name: newCategoryName.trim(),
      });
      setIsCategoryDialogOpen(false);
      setNewCategoryName("");
      setSelectedCategory(newCategory.id);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category");
    }
  };

  const handleCreateSubcategory = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }

    if (!newSubcategoryName.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }

    try {
      const newSubcategory = await createSubcategory.mutateAsync({
        name: newSubcategoryName.trim(),
        category_id: selectedCategory,
      });
      setIsSubcategoryDialogOpen(false);
      setNewSubcategoryName("");
      setSelectedSubcategory(newSubcategory.id);
      toast.success("Subcategory created successfully");
    } catch (error) {
      console.error("Failed to create subcategory:", error);
      toast.error("Failed to create subcategory");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateTemplateMutation.mutateAsync({
        ownerId: template.owner_id,
        payload: {
          template_image: selectedImage || undefined,
          template_category_id: selectedCategory,
          template_subcategory_id: selectedSubcategory,
        },
      });

      toast.success("Template updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to update template:", error);

      if (error instanceof Error) {
        if (error.message.includes("Unexpected response format")) {
          toast.error(
            "Server returned an unexpected response. The image might be too large or in an invalid format."
          );
        } else {
          toast.error(error.message || "Failed to update template");
        }
      } else {
        toast.error("Failed to update template");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update the template image, category, and subcategory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Category (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryDialogOpen(true)}
              >
                <Plus className="mr-1 h-3 w-3" />
                Create Category
              </Button>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCategory?.toString() || undefined}
                onValueChange={value =>
                  setSelectedCategory(value ? Number(value) : null)
                }
                disabled={isLoadingCategories}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(category => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategory && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Subcategory Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Subcategory (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSubcategoryDialogOpen(true)}
                disabled={!selectedCategory}
              >
                <Plus className="mr-1 h-3 w-3" />
                Create Subcategory
              </Button>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedSubcategory?.toString() || undefined}
                onValueChange={value =>
                  setSelectedSubcategory(value ? Number(value) : null)
                }
                disabled={!selectedCategory || isLoadingSubcategories}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={
                      selectedCategory
                        ? "Select a subcategory"
                        : "Select a category first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subcategories?.map(subcategory => (
                    <SelectItem
                      key={subcategory.id}
                      value={subcategory.id.toString()}
                    >
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSubcategory && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubcategory(null)}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="template-image">Thumbnail Image</Label>
            <p className="mb-3 text-sm text-gray-500">
              Upload a new image for this template
            </p>

            {previewUrl && (
              <div className="relative mb-4 inline-block">
                <div className="group relative">
                  <img
                    src={previewUrl}
                    alt={`${template.name} preview`}
                    className="h-32 w-32 rounded-lg border-2 border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Label
                htmlFor="template-image"
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400"
              >
                <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {selectedImage ? "Change Image" : "Upload Image"}
                </span>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </Label>
              <Input
                id="template-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {selectedImage && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {selectedImage.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={updateTemplateMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateTemplateMutation.isPending}>
            {updateTemplateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Template"
            )}
          </Button>
        </div>
      </form>

      {/* Create Category Dialog */}
      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for template items.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateCategory();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCategoryDialogOpen(false);
                  setNewCategoryName("");
                }}
                disabled={createCategory.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateCategory}
                disabled={createCategory.isPending || !newCategoryName.trim()}
              >
                {createCategory.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Subcategory Dialog */}
      <Dialog
        open={isSubcategoryDialogOpen}
        onOpenChange={setIsSubcategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subcategory</DialogTitle>
            <DialogDescription>
              Add a new subcategory for the selected category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory-name">Subcategory Name</Label>
              <Input
                id="subcategory-name"
                placeholder="Enter subcategory name"
                value={newSubcategoryName}
                onChange={e => setNewSubcategoryName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateSubcategory();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSubcategoryDialogOpen(false);
                  setNewSubcategoryName("");
                }}
                disabled={createSubcategory.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateSubcategory}
                disabled={
                  createSubcategory.isPending || !newSubcategoryName.trim()
                }
              >
                {createSubcategory.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Subcategory"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
