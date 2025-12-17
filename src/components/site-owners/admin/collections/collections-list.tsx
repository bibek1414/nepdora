// components/site-owners/admin/collections/collections-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Database, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  useCollections,
  useDeleteCollection,
} from "@/hooks/owner-site/admin/use-collections";
import { CreateCollectionDialog } from "./create-collection-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection } from "@/types/owner-site/admin/collection";

export function CollectionsList() {
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<Collection | null>(null);

  const { data: collections, isLoading } = useCollections();
  const deleteCollectionMutation = useDeleteCollection();

  const handleDelete = async () => {
    if (!collectionToDelete) return;

    try {
      await deleteCollectionMutation.mutateAsync(collectionToDelete.slug);
      toast.success("Collection deleted successfully");
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete collection"
      );
    }
  };

  const confirmDelete = (collection: Collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your dynamic content collections
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      {!collections || collections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Database className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-semibold">No collections yet</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Create your first collection to start managing dynamic content
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map(collection => (
            <div
              key={collection.id}
              className="group relative flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:bg-gray-50/50 hover:shadow-md"
            >
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-900 group-hover:bg-white group-hover:shadow-sm">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  {collection.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">/{collection.slug}</p>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-gray-50 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 flex-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() =>
                    router.push(`/admin/collections/${collection.slug}`)
                  }
                >
                  View Data
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-900"
                    onClick={() =>
                      router.push(`/admin/collections/${collection.slug}/edit`)
                    }
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => confirmDelete(collection)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the collection &quot;
              {collectionToDelete?.name}&quot; and all its data. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
