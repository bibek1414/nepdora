import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { servicesApi } from "@/services/api/owner-sites/admin/services";
import {
  servicesFormSchema,
  ServicesFormValues,
} from "@/schemas/services.form";
import {
  useServiceCategories,
  useCreateServiceCategory,
} from "@/hooks/owner-site/admin/use-services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import Tiptap from "@/components/ui/tip-tap";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ServicesFormProps {
  service?: ServicesPost | null;
  onSubmit: (data: ServicesFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ServicesForm: React.FC<ServicesFormProps> = ({
  service = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = Boolean(service);
  const [formInitialized, setFormInitialized] = useState(false);

  // Add state to track the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ServicesFormValues>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: {
      title: "",
      description: "",
      meta_title: "",
      meta_description: "",
      thumbnail_image: null,
      thumbnail_image_alt_description: "",
    },
  });

  useEffect(() => {
    if (isEditMode && service && !formInitialized) {
      form.reset({
        title: service.title || "",
        description: service.description || "",
        meta_title: service.meta_title || "",
        meta_description: service.meta_description || "",
        thumbnail_image_alt_description:
          service.thumbnail_image_alt_description || "",
        service_category: service.service_category?.id || null,
      });

      setFormInitialized(true);
    }
  }, [service, isEditMode, form, formInitialized]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    // Update the form value directly
    form.setValue("thumbnail_image", file, { shouldValidate: true });
  };

  const handleSubmit = (data: ServicesFormValues) => {
    const transformedData = {
      ...data,
      // Ensure the selected file is included
      thumbnail_image: selectedFile || data.thumbnail_image,
      service_category: data.service_category || null,
    };

    onSubmit(transformedData);
  };

  const { data: categoryData } = useServiceCategories({ page_size: 100 });
  const categories = categoryData?.results || [];

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const createCategoryMutation = useCreateServiceCategory();

  const handleQuickAddCategory = () => {
    if (!newCategoryName) return;

    createCategoryMutation.mutate(
      { categoryData: { name: newCategoryName } },
      {
        onSuccess: newCategory => {
          toast.success("Category created!");
          form.setValue("service_category", newCategory.id);
          setIsQuickAddOpen(false);
          setNewCategoryName("");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to create category");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={value => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog
                      open={isQuickAddOpen}
                      onOpenChange={setIsQuickAddOpen}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsQuickAddOpen(true)}
                        title="Add New Category"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Quick Add Category</DialogTitle>
                          <DialogDescription>
                            Create a new category quickly.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2 py-4">
                          <Input
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleQuickAddCategory();
                              }
                            }}
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsQuickAddOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleQuickAddCategory}
                            disabled={createCategoryMutation.isPending}
                          >
                            {createCategoryMutation.isPending && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Tiptap
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Write your service description here..."
                    height="250px"
                    toolbar="advanced"
                    uploadFolder="services"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">SEO Information</h3>
            <FormField
              control={form.control}
              name="meta_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO friendly title" {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn(
                      (field.value?.length || 0) > 60 && "text-red-500"
                    )}
                  >
                    {field.value?.length || 0}/60 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="SEO friendly description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription
                    className={cn(
                      (field.value?.length || 0) > 160 && "text-red-500"
                    )}
                  >
                    {field.value?.length || 0}/160 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">Media</h3>
            <FormField
              control={form.control}
              name="thumbnail_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditMode && "Leave empty to keep current image."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditMode && service?.thumbnail_image && !selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current image:</p>
                <Image
                  src={service.thumbnail_image}
                  alt="Current thumbnail"
                  width={128}
                  height={128}
                  className="mt-1 rounded-md object-cover"
                />
              </div>
            )}
            {selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">New image selected:</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{selectedFile.name}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      form.setValue("thumbnail_image", null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
            <FormField
              control={form.control}
              name="thumbnail_image_alt_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Image alt description for accessibility"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end space-x-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              {isLoading
                ? "Saving..."
                : `${isEditMode ? "Update" : "Create"} Service`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ServicesForm;
