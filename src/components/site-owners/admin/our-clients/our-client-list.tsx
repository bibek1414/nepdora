"use client";

import { useState, useCallback, useEffect } from "react";
import {
  useGetOurClients,
  useDeleteOurClient,
} from "@/hooks/owner-site/admin/use-our-client";
import {
  OurClient,
  OurClientFilters,
} from "@/types/owner-site/admin/our-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { OurClientForm } from "./our-client-form";
import { SimplePagination } from "@/components/ui/simple-pagination";
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
  TableWrapper,
  TableActionButtons,
  TableUserCell,
} from "@/components/ui/custom-table";
import { RefreshCw } from "lucide-react";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function OurClientList() {
  const [filters, setFilters] = useState<OurClientFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<OurClient | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: clientsData, isLoading, error } = useGetOurClients(filters);
  const deleteMutation = useDeleteOurClient();

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm]);

  const handleEdit = (client: OurClient) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredClients = clientsData || [];
  const paginatedClients = filteredClients.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-black/20" />
            <p className="text-xs text-black/40">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="rounded-lg bg-white p-12 text-center">
            <h2 className="text-sm font-medium text-red-600">
              Error loading clients
            </h2>
            <p className="mt-1 text-xs text-black/40">
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">Our Clients</h1>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search clients..."
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
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={() => {
              setEditingClient(null);
              setIsFormOpen(true);
            }}
            className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>

        <div className="rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/5">
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Client Info
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  URL
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-12 text-center text-xs text-black/40"
                  >
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedClients.map(client => (
                  <TableRow
                    key={client.id}
                    className="group border-b border-black/5 transition-colors hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-md border border-black/5">
                          <img
                            src={client.logo || ""}
                            alt={client.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span className="text-sm font-normal text-black">
                          {client.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {client.url ? (
                        <a
                          href={client.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#003d79] hover:underline"
                        >
                          {client.url}
                          <ExternalLink className="h-3 w-3 text-black/40" />
                        </a>
                      ) : (
                        <span className="text-xs text-black/20">---</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <TableActionButtons
                        onEdit={() => handleEdit(client)}
                        onDelete={() => setDeleteId(client.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <SimplePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        <OurClientForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          client={editingClient}
        />

        <AlertDialog
          open={!!deleteId}
          onOpenChange={open => !open && setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                client.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 font-semibold text-white hover:bg-red-700"
              >
                {deleteMutation.isPending ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
