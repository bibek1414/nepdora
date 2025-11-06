"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit } from "lucide-react";
import {
  useCreateFAQ,
  useUpdateFAQ,
  useFAQCategories,
  useCreateFAQCategory,
} from "@/hooks/super-admin/use-faq-category";
import { FAQ } from "@/types/super-admin/faq-category";

const faqSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question must be less than 500 characters"),
  answer: z
    .string()
    .min(1, "Answer is required")
    .min(10, "Answer must be at least 10 characters")
    .max(2000, "Answer must be less than 2000 characters"),
  category_id: z.number("Category is required").min(1, "Category is required"),
});

type FAQFormData = z.infer<typeof faqSchema>;

interface FAQFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ;
  mode: "create" | "edit";
}

export function FAQForm({ open, onOpenChange, faq, mode }: FAQFormProps) {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();
  const { data: categories, isLoading: isLoadingCategories } =
    useFAQCategories();
  const createCategory = useCreateFAQCategory();

  const form = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category_id: undefined,
    },
  });

  const safeAllCategories = categories || [];
  const isCreatingCategory = createCategory.isPending;

  // Reset form when dialog opens/closes or FAQ changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && faq) {
        form.reset({
          question: faq.question,
          answer: faq.answer,
          // FIX: Extract the ID from the nested category object
          category_id: faq.category?.id || faq.category_id,
        });
      } else {
        form.reset({
          question: "",
          answer: "",
          category_id: undefined,
        });
      }
    }
  }, [open, mode, faq, form]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const newCategory = await createCategory.mutateAsync({
        name: newCategoryName.trim(),
      });
      setIsCategoryDialogOpen(false);
      setNewCategoryName("");
      // Set the newly created category as selected
      form.setValue("category_id", newCategory.id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const onSubmit = async (data: FAQFormData) => {
    try {
      if (mode === "create") {
        await createFAQ.mutateAsync(data);
      } else if (mode === "edit" && faq) {
        await updateFAQ.mutateAsync({ id: faq.id, data });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isLoading = createFAQ.isPending || updateFAQ.isPending;

  // Get the select value, ensuring it's a string for the Select component
  const selectValue = form.watch("category_id")?.toString() || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Create New FAQ
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Edit FAQ
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new frequently asked question and its answer."
              : "Update the selected FAQ question and answer."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category_id"
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
                            Add a new category for FAQ items.
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
                    value={selectValue}
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
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your question here..."
                      {...field}
                      disabled={isLoading}
                      className="min-h-[50px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed answer..."
                      className="min-h-[120px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create FAQ" : "Update FAQ"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// FAQ Form Trigger Component
interface FAQFormTriggerProps {
  faq?: FAQ;
  mode: "create" | "edit";
  children?: React.ReactNode;
}

export function FAQFormTrigger({ faq, mode, children }: FAQFormTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <FAQForm open={open} onOpenChange={setOpen} faq={faq} mode={mode} />
    </>
  );
}
