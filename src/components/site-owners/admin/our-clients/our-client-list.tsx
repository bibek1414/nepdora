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

  if (isLoading) {
    return (
      <div className="animate-in fade-in min-h-screen bg-white duration-700">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
            <p className="animate-pulse text-sm text-slate-400">
              Loading clients...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in min-h-screen bg-white duration-700">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Error loading clients. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-700">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Our Clients
            </h1>
            <p className="text-sm text-slate-500">
              Manage your client logos and links.
            </p>
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

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 border-slate-200 bg-white pr-10 pl-10 text-sm placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-900"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="px-6 py-4 font-semibold text-slate-700">
                  Client Info
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-slate-700">
                  URL
                </TableHead>
                <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientsData?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-12 text-center text-slate-500"
                  >
                    No clients found. Click "Add Client" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                clientsData?.map(client => (
                  <TableRow
                    key={client.id}
                    className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                  >
                    <TableCell className="px-6 py-4">
                      <TableUserCell
                        imageSrc={client.logo || undefined}
                        fallback={client.name.charAt(0).toUpperCase()}
                        title={client.name}
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {client.url ? (
                        <a
                          href={client.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          {client.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">---</span>
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
        </TableWrapper>

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
