"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useServices,
  useDeleteService,
} from "@/hooks/owner-site/admin/use-services";
import ServicesTable from "@/components/site-owners/admin/services/services-table";
import ServicesHeader from "@/components/site-owners/admin/services/services-header";
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
  ServicesPost,
  ServicesFilters,
} from "@/types/owner-site/admin/services";
import Pagination from "@/components/ui/pagination";
import ServicesSearch from "./services-search";

const ServicesManagement = () => {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    service: ServicesPost | null;
  }>({ isOpen: false, service: null });

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    pageSize: 10,
  });

  const queryFilters = useMemo(() => {
    const qf: ServicesFilters = {
      page: filters.page,
      search: filters.search,
      page_size: filters.pageSize,
    };
    return qf;
  }, [filters]);

  const {
    data: serviceData,
    isLoading: isLoadingServices,
    error,
    refetch,
  } = useServices(queryFilters);

  const deleteServiceMutation = useDeleteService();

  const handleCreateNew = () => router.push("/admin/services/add");
  const handleEditService = (service: ServicesPost) =>
    router.push(`/admin/services/edit/${service.slug}`);

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteService = (service: ServicesPost) => {
    setDeleteDialog({ isOpen: true, service });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.service) return;

    deleteServiceMutation.mutate(
      { slug: deleteDialog.service.slug },
      {
        onSuccess: () => {
          toast.success("Service deleted successfully!");
          setDeleteDialog({ isOpen: false, service: null });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to delete service");
          setDeleteDialog({ isOpen: false, service: null });
        },
      }
    );
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, service: null });
  };

  const handleSearch = (term: string) =>
    setFilters(prev => ({ ...prev, search: term, page: 1 }));

  const handlePageChange = (page: number) =>
    setFilters(prev => ({ ...prev, page }));

  const handlePageSizeChange = (pageSize: number) =>
    setFilters(prev => ({ ...prev, pageSize, page: 1 }));

  if (error) {
    toast.error(error.message || "Failed to load services");
  }

  const services = serviceData?.results || [];
  const totalServices = serviceData?.count || 0;
  const totalPages = Math.ceil(totalServices / filters.pageSize);
  const hasNext = !!serviceData?.next;
  const hasPrevious = !!serviceData?.previous;

  return (
    <div className="bg-gray-50 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <ServicesHeader
          onCreateNew={handleCreateNew}
          onRefresh={handleRefresh}
          servicesCount={totalServices}
        />
        <ServicesSearch onSearch={handleSearch} />
        <ServicesTable
          services={services}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          isLoading={isLoadingServices}
        />

        {totalPages > 1 && (
          <Pagination
            count={totalServices}
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
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {deleteDialog.service?.title}
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

export default ServicesManagement;
