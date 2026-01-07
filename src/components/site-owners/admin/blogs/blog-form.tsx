import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogPost, BlogTag } from "@/types/owner-site/admin/blog";
import { useBlogTags } from "@/hooks/owner-site/admin/use-blogs";
import { blogApi } from "@/services/api/owner-sites/admin/blog";
import { blogFormSchema, BlogFormValues } from "@/schemas/blog.form";
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
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ReusableQuill from "@/components/ui/tip-tap";
import { toast } from "sonner";

interface BlogFormProps {
  blog?: BlogPost | null;
  onSubmit: (data: BlogFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  blog = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = Boolean(blog);
  const {
    data: allTags,
    isLoading: isLoadingTags,
    refetch: refetchTags,
  } = useBlogTags();

  const [selectedTags, setSelectedTags] = useState<BlogTag[]>([]);
  const [formInitialized, setFormInitialized] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  // Add state to track the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      meta_title: "",
      meta_description: "",
      thumbnail_image: null,
      thumbnail_image_alt_description: "",
      tag_ids: [],
    },
  });

  useEffect(() => {
    if (isEditMode && blog && !formInitialized) {
      const blogTags = blog.tags || [];

      form.reset({
        title: blog.title || "",
        content: blog.content || "",
        meta_title: blog.meta_title || "",
        meta_description: blog.meta_description || "",
        thumbnail_image_alt_description:
          blog.thumbnail_image_alt_description || "",
        tag_ids: blogTags.map(tag => tag.id),
      });

      setSelectedTags(blogTags);
      setFormInitialized(true);
    }
  }, [blog, isEditMode, form, formInitialized]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    // Update the form value directly
    form.setValue("thumbnail_image", file, { shouldValidate: true });
  };

  const handleTagToggle = (tag: BlogTag) => {
    const currentTagIds = form.getValues("tag_ids") || [];
    let newTagIds: number[];
    if (currentTagIds.includes(tag.id)) {
      newTagIds = currentTagIds.filter(id => id !== tag.id);
      setSelectedTags(prev => prev.filter(t => t.id !== tag.id));
    } else {
      newTagIds = [...currentTagIds, tag.id];
      setSelectedTags(prev => [...prev, tag]);
    }
    form.setValue("tag_ids", newTagIds, { shouldValidate: true });
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    // Check if tag already exists
    const existingTag = Array.isArray(allTags)
      ? allTags.find(tag => tag.name.toLowerCase() === newTagName.toLowerCase())
      : null;

    if (existingTag) {
      toast.error("Tag already exists");
      return;
    }

    setIsCreatingTag(true);
    try {
      const newTag = await blogApi.createTag({ name: newTagName.trim() });

      // Add the new tag to selected tags
      const currentTagIds = form.getValues("tag_ids") || [];
      const newTagIds = [...currentTagIds, newTag.id];
      setSelectedTags(prev => [...prev, newTag]);
      form.setValue("tag_ids", newTagIds, { shouldValidate: true });

      // Refetch tags to update the list
      refetchTags();

      // Reset form and close dialog
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

  const handleSubmit = (data: BlogFormValues) => {
    const transformedData = {
      ...data,
      tag_ids: data.tag_ids && Array.isArray(data.tag_ids) ? data.tag_ids : [],
      // Ensure the selected file is included
      thumbnail_image: selectedFile || data.thumbnail_image,
    };

    onSubmit(transformedData);
  };

  // Ensure allTags is always an array to prevent the map error
  const safeAllTags = Array.isArray(allTags) ? allTags : [];

  return (
    <div className="mx-auto max-w-6xl p-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 sm:space-y-6 md:space-y-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Left Column - Blog Info */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#003d79]">
                      Blog Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter blog title"
                        {...field}
                        className="text-sm sm:text-base"
                      />
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
                    <FormLabel className="text-sm font-semibold text-[#003d79]">
                      Content
                    </FormLabel>
                    <FormControl>
                      <div className="[&_.tiptap]:min-h-[300px] sm:[&_.tiptap]:min-h-[400px] md:[&_.tiptap]:min-h-[600px] [&_iframe]:min-h-[300px] sm:[&_iframe]:min-h-[400px] md:[&_iframe]:min-h-[600px]">
                        <ReusableQuill
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Write your blog content here..."
                          height="600px"
                          toolbar="advanced"
                          uploadFolder="blogs"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 rounded-lg border border-black/5 p-6">
                <h3 className="text-sm font-semibold text-[#003d79]">
                  Thumbnail Media
                </h3>
                <FormField
                  control={form.control}
                  name="thumbnail_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        Thumbnail Image
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="text-xs file:text-xs sm:text-sm sm:file:text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        {isEditMode && "Leave empty to keep current image."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isEditMode && blog?.thumbnail_image && !selectedFile && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 sm:text-sm">
                      Current image:
                    </p>
                    <Image
                      src={blog.thumbnail_image}
                      alt="Current thumbnail"
                      width={128}
                      height={128}
                      className="mt-1 h-auto max-w-full rounded-md object-cover"
                    />
                  </div>
                )}
                {selectedFile && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 sm:text-sm">
                      New image selected:
                    </p>
                    <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <span className="min-w-0 flex-1 truncate text-xs sm:text-sm">
                        {selectedFile.name}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm"
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
                      <FormLabel className="text-xs text-black/40">
                        Alt Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Image alt description for accessibility"
                          {...field}
                          className="text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Column - SEO Information & Tags */}
            <div className="mt-8 space-y-4 sm:space-y-6 lg:sticky lg:top-20 lg:col-span-1 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto">
              <div className="space-y-4 rounded-lg border border-black/5 p-6">
                <h3 className="text-sm font-semibold text-[#003d79]">
                  SEO Settings
                </h3>
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">
                          Meta Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SEO friendly title"
                            {...field}
                            className="text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormDescription className="text-xs sm:text-sm">
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
                        <FormLabel className="text-sm sm:text-base">
                          Meta Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="SEO friendly description"
                            rows={3}
                            {...field}
                            className="text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormDescription className="text-xs sm:text-sm">
                          {field.value?.length || 0}/160 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-black/5 p-6">
                <FormField
                  control={form.control}
                  name="tag_ids"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <FormLabel className="text-sm font-semibold text-[#003d79]">
                          Categorization
                        </FormLabel>
                        <Dialog
                          open={isTagDialogOpen}
                          onOpenChange={setIsTagDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full text-xs sm:w-auto sm:text-sm"
                            >
                              <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden min-[360px]:inline">
                                Create Tag
                              </span>
                              <span className="min-[360px]:hidden">Create</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">
                                Create New Tag
                              </DialogTitle>
                              <DialogDescription className="text-xs sm:text-sm">
                                Add a new tag that can be used for blog posts.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 sm:space-y-4">
                              <div className="space-y-2">
                                <label
                                  htmlFor="tag-name"
                                  className="text-xs font-medium sm:text-sm"
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
                                  className="text-sm sm:text-base"
                                />
                              </div>
                              <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row sm:space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsTagDialogOpen(false);
                                    setNewTagName("");
                                  }}
                                  disabled={isCreatingTag}
                                  className="w-full text-xs sm:w-auto sm:text-sm"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={handleCreateTag}
                                  disabled={isCreatingTag || !newTagName.trim()}
                                  className="w-full text-xs sm:w-auto sm:text-sm"
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
                                "w-full justify-between text-xs sm:text-sm",
                                !field.value?.length && "text-muted-foreground"
                              )}
                              disabled={isLoadingTags}
                            >
                              <span className="truncate">
                                {field.value?.length
                                  ? `${field.value.length} tag(s) selected`
                                  : "Select tags"}
                              </span>
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50 sm:h-4 sm:w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] max-w-[calc(100vw-2rem)] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search tags..."
                              className="text-sm sm:text-base"
                            />
                            <CommandList>
                              <CommandEmpty className="py-4 text-xs sm:text-sm">
                                No tags found.
                              </CommandEmpty>
                              <CommandGroup>
                                {safeAllTags.map(tag => (
                                  <CommandItem
                                    value={tag.name}
                                    key={tag.id}
                                    onSelect={() => handleTagToggle(tag)}
                                    className="text-xs sm:text-sm"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-3 w-3 sm:h-4 sm:w-4",
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
                      <div className="flex flex-wrap gap-1.5 pt-2 sm:gap-2">
                        {selectedTags.map(tag => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="px-2 py-0.5 text-xs sm:text-sm"
                          >
                            <span className="max-w-[120px] truncate sm:max-w-none">
                              {tag.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTagToggle(tag)}
                              className="ring-offset-background focus:ring-ring ml-1 shrink-0 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
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
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-2 border-t border-black/5 pt-6 sm:flex-row sm:gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full text-black/40 hover:bg-black/5 hover:text-black sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-black/90 sm:w-auto"
            >
              {isLoading
                ? "Saving..."
                : `${isEditMode ? "Update" : "Publish"} Blog`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BlogForm;
