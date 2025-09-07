"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  Loader2,
} from "lucide-react";
import { useFAQs, useDeleteFAQ } from "@/hooks/owner-site/use-faq";
import { FAQFormTrigger } from "./faq-form";
import { FAQ } from "@/types/owner-site/faq";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function FAQList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);

  const { data, isLoading, error } = useFAQs();
  const deleteFAQ = useDeleteFAQ();

  const handleDeleteClick = (faq: FAQ) => {
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
          <h1 className="text-xl font-bold tracking-tight">FAQs</h1>
        </div>
        <FAQFormTrigger mode="create">
          <Button className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900">
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </FAQFormTrigger>
      </div>

      {/* FAQ List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-2">
          {data.map(faq => (
            <AccordionItem
              key={faq.id}
              value={faq.id.toString()}
              className="rounded-lg border px-4"
            >
              <div className="flex items-center justify-between py-4">
                <AccordionTrigger className="flex-1 text-left font-semibold hover:no-underline [&>svg]:ml-2">
                  <div className="flex flex-col items-start gap-2">
                    <span className="text-base">{faq.question}</span>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm font-normal">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created{" "}
                        {formatDistanceToNow(new Date(faq.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <div className="ml-4 flex gap-2">
                  <FAQFormTrigger mode="edit" faq={faq}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </FAQFormTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(faq)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="py-12 text-center">
          <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-medium">
            {searchTerm ? "No FAQs found" : "No FAQs yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating your first FAQ"}
          </p>
          {!searchTerm && (
            <FAQFormTrigger mode="create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first FAQ
              </Button>
            </FAQFormTrigger>
          )}
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
