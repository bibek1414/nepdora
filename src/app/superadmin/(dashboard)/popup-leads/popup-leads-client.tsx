"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import { Mail, Phone, Calendar, User, Trash2, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useNepdoraPopupSubmissions,
  useDeleteNepdoraPopupSubmission,
} from "@/hooks/super-admin/use-nepdora-popup";
import PopupSubmissionDetailsDialog from "./popup-submission-details-dialog";

export default function PopupLeadsClient() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  const { data, isLoading, error } = useNepdoraPopupSubmissions({
    page,
    page_size: pageSize,
  });

  const { mutate: deleteLead, isPending: isDeleting } =
    useDeleteNepdoraPopupSubmission();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id, {
        onSuccess: () => {
          toast.success("Lead deleted successfully");
          if (selectedLeadId === id) {
            setIsDialogOpen(false);
            setSelectedLeadId(null);
          }
        },
        onError: () => {
          toast.error("Failed to delete lead");
        },
      });
    }
  };

  const handleViewDetails = (id: number) => {
    setSelectedLeadId(id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLeadId(null);
  };

  const handleLeadChange = (leadId: number) => {
    setSelectedLeadId(leadId);
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-red-500">
        <p className="font-semibold">Error loading popup leads</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-12 mb-40 min-h-screen max-w-6xl space-y-6 px-6 md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Marketing Popup Leads
          </h1>
          <p className="text-muted-foreground text-sm">
            View and manage website design inquiries from the marketing site.
          </p>
        </div>
      </div>

      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-md border bg-white">
            <Table className="border-none! shadow-none!">
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[200px]">User</TableHead>
                  <TableHead>Contact Details</TableHead>
                  <TableHead>Website Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5} className="h-16 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          Loading leads...
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : data?.results.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground h-48 text-center"
                    >
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <p className="font-medium">No popup leads found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.results.map(item => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/50 group cursor-pointer transition-colors"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1 text-sm">
                          {item.email && (
                            <div className="text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {item.email}
                            </div>
                          )}
                          {item.phone_number && (
                            <div className="text-muted-foreground flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {item.phone_number}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.website_type ? (
                          <div className="flex w-fit items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                            <Globe className="h-3 w-3" />
                            {item.website_type}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">
                            Not specified
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {format(new Date(item.created_at), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground h-9 w-9 rounded-lg transition-colors hover:bg-red-50 hover:text-red-600"
                            onClick={e => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 flex items-center justify-between p-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      {data && (
        <PopupSubmissionDetailsDialog
          submissions={data.results}
          currentId={selectedLeadId}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onSubmissionChange={handleLeadChange}
        />
      )}
    </div>
  );
}
