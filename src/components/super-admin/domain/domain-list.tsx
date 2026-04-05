"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Search } from "lucide-react";

import DomainTable from "@/components/super-admin/domain/domain-table";
import { DomainDetailsDialog } from "@/components/super-admin/domain/domain-details-dialog";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncer } from "@/hooks/use-debouncer";
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

import { useDomains, useDeleteDomain } from "@/hooks/super-admin/use-domain";
import { Domain } from "@/types/super-admin/domain";

export default function DomainsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncer(searchTerm, 500);

  const { data, isLoading, isError, error, refetch } = useDomains(
    page,
    pageSize,
    debouncedSearch
  );

  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);
  const deleteMutation = useDeleteDomain();

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

  // Details Dialog states
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  // Delete confirmation states
  const [deleteDomainId, setDeleteDomainId] = useState<number | null>(null);

  const handleAddNew = () => {
    setEditingDomain(null);
    setDialogOpen(true);
  };

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain);
    setDialogOpen(true);
  };

  const handleRowClick = (domain: Domain) => {
    setSelectedDomain(domain);
    setDetailsOpen(true);
  };

  const confirmDelete = (id: number) => {
    setDeleteDomainId(id);
  };

  const handleDeleteStatus = async () => {
    if (!deleteDomainId) return;

    try {
      await deleteMutation.mutateAsync(deleteDomainId);
      toast.success("Domain deleted successfully");
      refetch();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete domain"
      );
    } finally {
      setDeleteDomainId(null);
    }
  };

  const handleFrontendUrlClick = (tenantSchemaName: string) => {
    // Analytics or logging can go here
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Error: {error?.message}
      </div>
    );
  }

  const domains = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domains</h1>
        </div>
        <div className="relative w-full max-w-sm sm:w-80">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search domains..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {/* Main Table */}
      <DomainTable
        domains={domains}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        onFrontendUrlClick={handleFrontendUrlClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Details Dialog */}
      <DomainDetailsDialog
        domains={domains}
        currentDomainId={selectedDomain?.id || null}
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedDomain(null);
        }}
        onDomainChange={id => {
          const domain = domains.find(d => d.id === id);
          if (domain) setSelectedDomain(domain);
        }}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deleteDomainId}
        onOpenChange={op => {
          if (!op) setDeleteDomainId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              domain and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault();
                handleDeleteStatus();
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
