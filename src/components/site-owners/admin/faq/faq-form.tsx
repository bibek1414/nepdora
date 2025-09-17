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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit } from "lucide-react";
import { useCreateFAQ, useUpdateFAQ } from "@/hooks/owner-site/admin/use-faq";
import { FAQ } from "@/types/owner-site/admin/faq";

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
});

type FAQFormData = z.infer<typeof faqSchema>;

interface FAQFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ;
  mode: "create" | "edit";
}

export function FAQForm({ open, onOpenChange, faq, mode }: FAQFormProps) {
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();

  const form = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  // Reset form when dialog opens/closes or FAQ changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && faq) {
        form.reset({
          question: faq.question,
          answer: faq.answer,
        });
      } else {
        form.reset({
          question: "",
          answer: "",
        });
      }
    }
  }, [open, mode, faq, form]);

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
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
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
                  <FormLabel>Answer</FormLabel>
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
