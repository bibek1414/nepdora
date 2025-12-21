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
import {
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { SimplePagination } from "@/components/ui/simple-pagination";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const filteredFAQs = (data || []).filter(
    faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFAQs = filteredFAQs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredFAQs.length / ITEMS_PER_PAGE);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="rounded-lg bg-white p-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-black/20" />
            <p className="mb-2 text-sm font-medium text-red-600">
              Error loading FAQs
            </p>
            <p className="text-xs text-black/40">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">FAQs</h1>
        </div>

        {/* Search and Add Button */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <FAQFormTrigger mode="create">
            <Button className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </FAQFormTrigger>
        </div>

        {/* FAQ Table */}
        <div className="rounded-lg bg-white">
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                <p className="text-xs text-black/40">Loading FAQs...</p>
              </div>
            ) : filteredFAQs.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-black/5">
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Question
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Answer
                      </TableHead>
                      <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFAQs.map(faq => (
                      <TableRow
                        key={faq.id}
                        className="group border-b border-black/5 transition-colors hover:bg-black/2"
                      >
                        <TableCell className="px-6 py-4 align-top">
                          <span className="text-sm font-normal text-black">
                            {faq.question}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-md px-6 py-4">
                          <p className="line-clamp-3 text-xs text-black/50">
                            {faq.answer}
                          </p>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right align-top">
                          <div className="flex items-center justify-end gap-1">
                            <FAQFormTrigger mode="edit" faq={faq}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-black/20 hover:text-black/60"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </FAQFormTrigger>
                            <TableActionButtons
                              onDelete={() => {
                                setFaqToDelete(faq);
                                setDeleteDialogOpen(true);
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <SimplePagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
                  <MessageSquare className="h-6 w-6 text-black/20" />
                </div>
                <h3 className="text-sm font-medium text-black">
                  No FAQs found
                </h3>
              </div>
            )}
          </div>
        </div>
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
