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
import { Plus, Edit, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { useFAQs, useDeleteFAQ } from "@/hooks/owner-site/admin/use-faq";
import { FAQFormTrigger } from "./faq-form";
import { FAQ } from "@/types/owner-site/admin/faq";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableWrapper,
  TableActionButtons,
  TableUserCell,
} from "@/components/ui/custom-table";

export function FAQList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);

  const { data, isLoading, error } = useFAQs();
  const deleteFAQ = useDeleteFAQ();

  const handleDeleteClick = (faq: FAQ, e: React.MouseEvent) => {
    e.stopPropagation();
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
      <div className="animate-in fade-in min-h-screen bg-white duration-700">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <TableWrapper>
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="mb-2 text-lg font-medium text-red-600">
                  Error loading FAQs
                </p>
                <p className="text-sm text-slate-500">
                  Please try refreshing the page
                </p>
              </div>
            </div>
          </TableWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-700">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              FAQs
            </h1>
            <p className="text-sm text-slate-500">
              Manage your frequently asked questions.
            </p>
          </div>
          <FAQFormTrigger mode="create">
            <Button className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </FAQFormTrigger>
        </div>

        {/* FAQ Table */}
        <TableWrapper>
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                <p className="animate-pulse text-sm text-slate-400">
                  Loading FAQs...
                </p>
              </div>
            ) : data && data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="px-6 py-4 font-semibold text-slate-700">
                      Question
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-slate-700">
                      Answer
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(faq => (
                    <TableRow
                      key={faq.id}
                      className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {faq.question}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md px-6 py-4">
                        <p className="line-clamp-3 text-sm leading-relaxed text-slate-500">
                          {faq.answer}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right align-top">
                        <div className="flex items-center justify-end gap-1">
                          <FAQFormTrigger mode="edit" faq={faq}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-slate-400 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </FAQFormTrigger>
                          <TableActionButtons
                            onDelete={() =>
                              handleDeleteClick(faq, {
                                stopPropagation: () => {},
                              } as any)
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <MessageSquare className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">
                  No FAQs found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Get started by adding your first FAQ.
                </p>
              </div>
            )}
          </div>
        </TableWrapper>
      </div>

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
