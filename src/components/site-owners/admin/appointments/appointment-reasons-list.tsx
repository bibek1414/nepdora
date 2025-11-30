"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tag,
  MoreVertical,
  Trash2,
  Edit,
  Plus,
  Loader2,
  Calendar,
} from "lucide-react";
import { AppointmentReason } from "@/types/owner-site/admin/appointment";
import { getApiBaseUrl } from "@/config/site";
import { toast } from "sonner";

const AppointmentReasonsList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] =
    useState<AppointmentReason | null>(null);
  const [reasonName, setReasonName] = useState("");
  const queryClient = useQueryClient();

  // Fetch reasons
  const {
    data: reasons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["appointment-reasons"],
    queryFn: async () => {
      const BASE_API_URL = getApiBaseUrl();
      const response = await fetch(`${BASE_API_URL}/api/appointment-reasons/`);
      if (!response.ok) throw new Error("Failed to fetch reasons");
      return await response.json();
    },
  });

  // Create reason mutation
  const createReason = useMutation({
    mutationFn: async (name: string) => {
      const BASE_API_URL = getApiBaseUrl();
      const response = await fetch(`${BASE_API_URL}/api/appointment-reasons/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to create reason");
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Reason created successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointment-reasons"] });
      setReasonName("");
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to create reason");
    },
  });

  // Update reason mutation
  const updateReason = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const BASE_API_URL = getApiBaseUrl();
      const response = await fetch(
        `${BASE_API_URL}/api/appointment-reasons/${id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );
      if (!response.ok) throw new Error("Failed to update reason");
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Reason updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointment-reasons"] });
      setReasonName("");
      setSelectedReason(null);
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update reason");
    },
  });

  // Delete reason mutation
  const deleteReason = useMutation({
    mutationFn: async (id: number) => {
      const BASE_API_URL = getApiBaseUrl();
      const response = await fetch(
        `${BASE_API_URL}/api/appointment-reasons/${id}/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to delete reason");
    },
    onSuccess: () => {
      toast.success("Reason deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointment-reasons"] });
    },
    onError: () => {
      toast.error("Failed to delete reason");
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reasonName.trim()) {
      createReason.mutate(reasonName.trim());
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReason && reasonName.trim()) {
      updateReason.mutate({ id: selectedReason.id, name: reasonName.trim() });
    }
  };

  const handleEditClick = (reason: AppointmentReason) => {
    setSelectedReason(reason);
    setReasonName(reason.name);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (reason: AppointmentReason) => {
    if (confirm(`Are you sure you want to delete "${reason.name}"?`)) {
      deleteReason.mutate(reason.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const LoadingSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading appointment reasons. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Appointment Reasons
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the reasons customers can select when booking appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Reason
          </Button>
        </div>
      </div>

      {/* Table */}
      {reasons && reasons.length > 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reasons.map((reason: AppointmentReason) => (
                    <TableRow key={reason.id}>
                      <TableCell className="font-medium">{reason.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{reason.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(reason.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(reason.updated_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(reason)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(reason)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No appointment reasons yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first appointment reason
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Reason
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle>Create Appointment Reason</DialogTitle>
              <DialogDescription>
                Add a new reason that customers can select when booking
                appointments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="create-reason-name">Reason Name</Label>
                <Input
                  id="create-reason-name"
                  placeholder="e.g., Consultation, Follow-up, New Patient"
                  value={reasonName}
                  onChange={e => setReasonName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setReasonName("");
                }}
                disabled={createReason.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createReason.isPending || !reasonName.trim()}
              >
                {createReason.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Reason"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Appointment Reason</DialogTitle>
              <DialogDescription>
                Update the name of this appointment reason.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-reason-name">Reason Name</Label>
                <Input
                  id="edit-reason-name"
                  placeholder="e.g., Consultation, Follow-up, New Patient"
                  value={reasonName}
                  onChange={e => setReasonName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setReasonName("");
                  setSelectedReason(null);
                }}
                disabled={updateReason.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateReason.isPending || !reasonName.trim()}
              >
                {updateReason.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Reason"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentReasonsList;
