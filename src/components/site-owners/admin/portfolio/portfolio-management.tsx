"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  usePortfolios,
  useDeletePortfolio,
} from "@/hooks/owner-site/admin/use-portfolio";
import PortfoliosTable from "@/components/site-owners/admin/portfolio/portfolio-table";
import PortfoliosHeader from "@/components/site-owners/admin/portfolio/portfolio-header";
import PortfoliosSearch from "@/components/site-owners/admin/portfolio/portfolio-search";
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
  Portfolio,
  PortfolioFilters,
} from "@/types/owner-site/admin/portfolio";
import Pagination from "@/components/ui/pagination";

const PortfoliosManagement = () => {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    portfolio: Portfolio | null;
  }>({ isOpen: false, portfolio: null });

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    category: "",
    pageSize: 10,
  });

  const queryFilters = useMemo(() => {
    const qf: PortfolioFilters = {
      page: filters.page,
      search: filters.search,
      page_size: filters.pageSize,
    };
    if (filters.category) qf.category = filters.category;
    return qf;
  }, [filters]);

  const {
    data: portfolioData,
    isLoading: isLoadingPortfolios,
    error,
    refetch,
  } = usePortfolios(queryFilters);

  const deletePortfolioMutation = useDeletePortfolio();

  const handleCreateNew = () => router.push("/admin/portfolio/add");
  const handleEditPortfolio = (portfolio: Portfolio) =>
    router.push(`/admin/portfolio/edit/${portfolio.slug}`);

  const handleDeletePortfolio = (portfolio: Portfolio) => {
    setDeleteDialog({ isOpen: true, portfolio });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.portfolio) return;

    deletePortfolioMutation.mutate(
      { slug: deleteDialog.portfolio.slug },
      {
        onSuccess: () => {
          toast.success("Portfolio deleted successfully!");
          setDeleteDialog({ isOpen: false, portfolio: null });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to delete portfolio");
          setDeleteDialog({ isOpen: false, portfolio: null });
        },
      }
    );
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, portfolio: null });
  };

  const handleSearch = (term: string) =>
    setFilters(prev => ({ ...prev, search: term, page: 1 }));

  const handlePageChange = (page: number) =>
    setFilters(prev => ({ ...prev, page }));

  const handlePageSizeChange = (pageSize: number) =>
    setFilters(prev => ({ ...prev, pageSize, page: 1 }));

  if (error) {
    toast.error(error.message || "Failed to load portfolios");
  }

  const portfolios = portfolioData?.results || [];
  const totalPortfolios = portfolioData?.count || 0;
  const totalPages = Math.ceil(totalPortfolios / filters.pageSize);
  const hasNext = !!portfolioData?.next;
  const hasPrevious = !!portfolioData?.previous;

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-700">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
        <PortfoliosHeader
          onCreateNew={handleCreateNew}
          portfoliosCount={totalPortfolios}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PortfoliosSearch onSearch={handleSearch} />
        </div>
        <PortfoliosTable
          portfolios={portfolios}
          onEdit={handleEditPortfolio}
          onDelete={handleDeletePortfolio}
          isLoading={isLoadingPortfolios}
        />

        {totalPages > 1 && (
          <Pagination
            count={totalPortfolios}
            pageSize={filters.pageSize}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageSizeChange={handlePageSizeChange}
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={7}
          />
        )}
      </div>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={open => !open && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {deleteDialog.portfolio?.title}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PortfoliosManagement;
