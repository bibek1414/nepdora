"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import { issueFormSchema, type IssueFormData } from "@/schemas/issues.form";
import {
  useCreateIssue,
  useUpdateIssue,
  useIssueCategories,
  useCreateIssueCategory,
} from "@/hooks/owner-site/use-issues";
import {
  Issue,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "@/types/owner-site/issues";

type StatusKey = (typeof STATUS_OPTIONS)[number]["value"];

interface IssuesFormProps {
  issue?: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStatus?: StatusKey | null; // Add this property
}

export function IssuesForm({
  issue,
  open,
  onOpenChange,
  initialStatus,
}: IssuesFormProps) {
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } =
    useIssueCategories();
  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();
  const createCategoryMutation = useCreateIssueCategory();

  const form = useForm<IssueFormData>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      issue_category: "",
      new_category: "",
    },
  });

  const isLoading =
    createIssueMutation.isPending ||
    updateIssueMutation.isPending ||
    createCategoryMutation.isPending;

  // Reset form when issue changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (issue) {
        // Editing existing issue - populate form with issue data
        form.reset({
          title: issue.title || "",
          description: issue.description || "",
          priority: issue.priority || "low",
          issue_category: issue.issue_category?.id?.toString() || "",
          new_category: "",
        });
      } else {
        // Creating new issue - reset to defaults
        form.reset({
          title: "",
          description: "",
          priority: "low",
          issue_category: "",
          new_category: "",
        });
      }
      setShowNewCategoryInput(false);
    }
  }, [issue, open, form]);

  const onSubmit = async (data: IssueFormData) => {
    try {
      let categoryId: number | undefined = undefined;

      // Handle category selection
      if (data.issue_category && data.issue_category !== "") {
        categoryId = Number(data.issue_category);
      }

      // Create new category if needed
      if (data.new_category && data.new_category.trim()) {
        const newCategory = await createCategoryMutation.mutateAsync({
          name: data.new_category.trim(),
        });
        categoryId = newCategory.id;
      }

      const issueData = {
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        issue_category: categoryId,
        // Include initial status when creating new issues
        ...(issue ? {} : { status: initialStatus || "pending" }),
      };

      if (issue) {
        await updateIssueMutation.mutateAsync({
          id: issue.id,
          data: issueData,
        });
      } else {
        await createIssueMutation.mutateAsync(issueData);
      }

      handleClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleClose = () => {
    form.reset({
      title: "",
      description: "",
      priority: "low",
      issue_category: "",
      new_category: "",
    });
    setShowNewCategoryInput(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{issue ? "Edit Issue" : "Create New Issue"}</DialogTitle>
          <DialogDescription>
            {issue
              ? "Update the issue details below."
              : "Fill in the details to create a new issue."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter issue title"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the issue in detail..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                option.value === "high"
                                  ? "destructive"
                                  : option.value === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className="h-2 w-2 p-0"
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="issue_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={
                          isLoading || categoriesLoading || showNewCategoryInput
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="flex-1">
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
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setShowNewCategoryInput(!showNewCategoryInput)
                        }
                        disabled={isLoading}
                      >
                        {showNewCategoryInput ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormDescription>
                      Select an existing category or create a new one.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showNewCategoryInput && (
                <FormField
                  control={form.control}
                  name="new_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Category Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new category name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        This will create a new category and assign it to this
                        issue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {issue ? "Update Issue" : "Create Issue"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
