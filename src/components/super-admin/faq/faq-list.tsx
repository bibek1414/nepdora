"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { useFAQs, useDeleteFAQ } from "@/hooks/superadmin/use-faq-category";
import { FAQFormTrigger } from "./faq-form";
import { FAQ } from "@/types/super-admin/faq-category";
import { toast } from "sonner";

export function FAQList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);

  const { data, isLoading, error } = useFAQs();
  const deleteFAQ = useDeleteFAQ();

  const handleDeleteClick = (faq: FAQ, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event from firing
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (faqToDelete) {
      try {
        await deleteFAQ.mutateAsync(faqToDelete.id);
        toast.success("FAQ deleted successfully");
        setDeleteDialogOpen(false);
        setFaqToDelete(null);
      } catch (error) {
        toast.error("Failed to delete FAQ");
      }
    }
  };

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2 text-lg font-medium">
            Error loading FAQs
          </p>
          <p className="text-muted-foreground text-sm">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 px-6 py-5">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
        </div>
        <FAQFormTrigger mode="create">
          <Button className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900">
            <Plus className="mr-2 h-4 w-4" />
            Add New FAQ
          </Button>
        </FAQFormTrigger>
      </div>

      {/* FAQ Table */}
      {isLoading ? (
        <div className="rounded-lg border">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-600">
            <div className="col-span-3">Question</div>
            <div className="col-span-7">Answer</div>
            <div className="col-span-2">Actions</div>
          </div>
          {/* Loading Skeletons */}
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-3">
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="col-span-7 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="col-span-2 flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : data && data.length > 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-600">
            <div className="col-span-3">Question</div>
            <div className="col-span-7">Answer</div>
            <div className="col-span-2">Actions</div>
          </div>
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {data.map((faq, index) => (
              <FAQFormTrigger key={faq.id} mode="edit" faq={faq}>
                <div
                  className={`grid cursor-pointer grid-cols-12 gap-4 px-6 py-4 ${
                    index % 2 === 0 ? "bg-white" : ""
                  }`}
                >
                  <div className="col-span-3">
                    <p className="text-sm leading-relaxed font-medium text-gray-900">
                      {faq.question}
                    </p>
                  </div>
                  <div className="col-span-7">
                    <p className="text-sm leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                  <div
                    className="col-span-2 flex gap-2"
                    onClick={e => e.stopPropagation()} // Prevent row click when clicking on buttons
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => handleDeleteClick(faq, e)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </FAQFormTrigger>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No FAQs yet
          </h3>
          <p className="mb-4 text-gray-600">
            Get started by creating your first FAQ
          </p>
          <FAQFormTrigger mode="create">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create your first FAQ
            </Button>
          </FAQFormTrigger>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the FAQ &apos;{faqToDelete?.question}
              &apos;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteFAQ.isPending}
            >
              {deleteFAQ.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete FAQ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
