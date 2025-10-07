import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Portfolio,
  PortfolioTag,
  PortfolioCategory,
} from "@/types/owner-site/admin/portfolio";
import {
  usePortfolioTags,
  usePortfolioCategories,
} from "@/hooks/owner-site/admin/use-portfolio";
import { portfolioApi } from "@/services/api/owner-sites/admin/portfolio";
import {
  portfolioFormSchema,
  PortfolioFormValues,
} from "@/schemas/portfolio.form";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ReusableQuill from "@/components/ui/tip-tap";
import { toast } from "sonner";

interface PortfolioFormProps {
  portfolio?: Portfolio | null;
  onSubmit: (data: PortfolioFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({
  portfolio = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = Boolean(portfolio);
  const {
    data: allTags,
    isLoading: isLoadingTags,
    refetch: refetchTags,
  } = usePortfolioTags();
  const {
    data: allCategories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = usePortfolioCategories();

  const [selectedTags, setSelectedTags] = useState<PortfolioTag[]>([]);
  const [formInitialized, setFormInitialized] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: undefined,
      meta_title: "",
      meta_description: "",
      thumbnail_image: null,
      thumbnail_image_alt_description: "",
      tags: [],
      project_url: "",
      github_url: "",
    },
  });

  useEffect(() => {
    if (isEditMode && portfolio && !formInitialized && !isLoadingCategories) {
      const portfolioTags = portfolio.tags || [];

      form.reset({
        title: portfolio.title || "",
        content: portfolio.content || "",
        category: portfolio.category?.id,
        meta_title: portfolio.meta_title || "",
        meta_description: portfolio.meta_description || "",
        thumbnail_image_alt_description:
          portfolio.thumbnail_image_alt_description || "",
        tags: portfolioTags.map(tag => tag.id),
        project_url: portfolio.project_url || "",
        github_url: portfolio.github_url || "",
      });

      setSelectedTags(portfolioTags);
      setFormInitialized(true);
    }
  }, [
    portfolio,
    isEditMode,
    form,
    formInitialized,
    isLoadingCategories,
    allCategories,
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    form.setValue("thumbnail_image", file, { shouldValidate: true });
  };

  const handleTagToggle = (tag: PortfolioTag) => {
    const currentTagIds = form.getValues("tags") || [];
    let newTagIds: number[];
    if (currentTagIds.includes(tag.id)) {
      newTagIds = currentTagIds.filter(id => id !== tag.id);
      setSelectedTags(prev => prev.filter(t => t.id !== tag.id));
    } else {
      newTagIds = [...currentTagIds, tag.id];
      setSelectedTags(prev => [...prev, tag]);
    }
    form.setValue("tags", newTagIds, { shouldValidate: true });
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    const existingTag = Array.isArray(allTags)
      ? allTags.find(tag => tag.name.toLowerCase() === newTagName.toLowerCase())
      : null;

    if (existingTag) {
      toast.error("Tag already exists");
      return;
    }

    setIsCreatingTag(true);
    try {
      const newTag = await portfolioApi.createTag({ name: newTagName.trim() });

      const currentTagIds = form.getValues("tags") || [];
      const newTagIds = [...currentTagIds, newTag.id];
      setSelectedTags(prev => [...prev, newTag]);
      form.setValue("tags", newTagIds, { shouldValidate: true });

      refetchTags();
      setNewTagName("");
      setIsTagDialogOpen(false);
      toast.success("Tag created successfully");
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const existingCategory = Array.isArray(allCategories)
      ? allCategories.find(
          cat => cat.name.toLowerCase() === newCategoryName.toLowerCase()
        )
      : null;

    if (existingCategory) {
      toast.error("Category already exists");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const newCategory = await portfolioApi.createCategory({
        name: newCategoryName.trim(),
      });

      form.setValue("category", newCategory.id, { shouldValidate: true });

      refetchCategories();
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = (data: PortfolioFormValues) => {
    const transformedData = {
      ...data,
      tags: data.tags && Array.isArray(data.tags) ? data.tags : [],
      thumbnail_image: selectedFile || data.thumbnail_image,
    };

    onSubmit(transformedData);
  };

  const safeAllTags = Array.isArray(allTags) ? allTags : [];
  const safeAllCategories = Array.isArray(allCategories) ? allCategories : [];

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter portfolio title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content *</FormLabel>
                <FormControl>
                  <ReusableQuill
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Write your portfolio content here..."
                    height="250px"
                    toolbar="advanced"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">Category & Links</h3>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Category *</FormLabel>
                    <Dialog
                      open={isCategoryDialogOpen}
                      onOpenChange={setIsCategoryDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="mr-1 h-4 w-4" />
                          Create Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Category</DialogTitle>
                          <DialogDescription>
                            Add a new category for portfolio items.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="category-name"
                              className="text-sm font-medium"
                            >
                              Category Name
                            </label>
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
                              disabled={isCreatingCategory}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleCreateCategory}
                              disabled={
                                isCreatingCategory || !newCategoryName.trim()
                              }
                            >
                              {isCreatingCategory
                                ? "Creating..."
                                : "Create Category"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {safeAllCategories.map(category => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                  <FormDescription>
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
                  <FormDescription>
                    {field.value?.length || 0}/160 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">Media & Tags</h3>
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
            {isEditMode && portfolio?.thumbnail_image && !selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current image:</p>
                <Image
                  src={portfolio.thumbnail_image}
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
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Tags</FormLabel>
                    <Dialog
                      open={isTagDialogOpen}
                      onOpenChange={setIsTagDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="mr-1 h-4 w-4" />
                          Create Tag
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Tag</DialogTitle>
                          <DialogDescription>
                            Add a new tag that can be used for portfolio items.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="tag-name"
                              className="text-sm font-medium"
                            >
                              Tag Name
                            </label>
                            <Input
                              id="tag-name"
                              placeholder="Enter tag name"
                              value={newTagName}
                              onChange={e => setNewTagName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleCreateTag();
                                }
                              }}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsTagDialogOpen(false);
                                setNewTagName("");
                              }}
                              disabled={isCreatingTag}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleCreateTag}
                              disabled={isCreatingTag || !newTagName.trim()}
                            >
                              {isCreatingTag ? "Creating..." : "Create Tag"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                          disabled={isLoadingTags}
                        >
                          <span className="truncate">
                            {field.value?.length
                              ? `${field.value.length} tag(s) selected`
                              : "Select tags"}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandList>
                          <CommandEmpty>No tags found.</CommandEmpty>
                          <CommandGroup>
                            {safeAllTags.map(tag => (
                              <CommandItem
                                value={tag.name}
                                key={tag.id}
                                onSelect={() => handleTagToggle(tag)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(tag.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {tag.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedTags.map(tag => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                        >
                          <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
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
                : `${isEditMode ? "Update" : "Create"} Portfolio`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PortfolioForm;
