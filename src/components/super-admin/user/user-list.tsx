"use client";

import { useState } from "react";
import UserTable from "@/components/super-admin/user/user-table";
import Pagination from "@/components/ui/pagination";
import { useUsers, useDeleteUser } from "@/hooks/super-admin/use-user";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";
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

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const { data, isLoading, isError, error } = useUsers(page, pageSize);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete);
        // Success handled by mutation
      } catch (error) {
        console.error("Error deleting user:", error);
        // You might want to show a toast notification here
      } finally {
        setUserToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
  };

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Users size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            Error loading users
          </h3>
          <p className="text-gray-600">{error?.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil((data?.count || 0) / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600">
            Manage system users and their store associations
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users size={16} />
          <span>Total: {data?.count || 0} users</span>
        </div>
      </div>

      <UserTable
        users={data?.results || []}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>Deleting...</>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
